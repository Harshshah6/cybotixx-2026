'use client';
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar, Loader2 } from "lucide-react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { initialEvents } from "@/lib/mockData";

import { getEventStatus, getStatusVariant } from "@/lib/eventStatus";
import { toast } from "sonner";

const phoneRegex = /^[+]?[\d\s-]{10,15}$/;

const Register = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [teamData, setTeamData] = useState<Record<string, { members: string[] }>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data
  const events = initialEvents;
  const isLoading = false;
  const regCounts: Record<string, number> = {}; // Mock empty counts

  // Filter out ended events
  const activeEvents = events?.filter((e: any) => getEventStatus(e.event_date) !== "ended") || [];

  const isEventFull = (event: any) => {
    if (!event.max_slots) return false;
    return (regCounts?.[event.id] || 0) >= event.max_slots;
  };

  const toggleEvent = (eventId: string) => {
    setSelectedEvents((prev) => {
      if (prev.includes(eventId)) {
        const newTeam = { ...teamData };
        delete newTeam[eventId];
        setTeamData(newTeam);
        return prev.filter((id) => id !== eventId);
      }
      const event = events?.find((e: any) => e.id === eventId);
      if (event?.event_type === "team") {
        setTeamData((prev) => ({
          ...prev,
          [eventId]: {
            members: Array((event.max_team_size || 2) - 1).fill(""),
          },
        }));
      }
      return [...prev, eventId];
    });
  };

  const updateMember = (eventId: string, idx: number, name: string) => {
    setTeamData((prev) => {
      const members = [...prev[eventId].members];
      members[idx] = name;
      return { ...prev, [eventId]: { ...prev[eventId], members } };
    });
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = "Name is required";
    if (!email.trim() || !z.string().email().safeParse(email).success) errs.email = "Valid email required";
    if (!phone.trim() || !phoneRegex.test(phone)) errs.phone = "Valid phone required";
    if (selectedEvents.length === 0) errs.events = "Select at least one event";

    for (const eventId of selectedEvents) {
      const event = events?.find((e: any) => e.id === eventId);
      if (event?.event_type === "team") {
        const td = teamData[eventId];
        td?.members.forEach((m, i) => {
          if (!m.trim()) errs[`member_${eventId}_${i}`] = "Member name required";
        });
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitMock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      toast("Registration successful!");
      setFullName("");
      setEmail("");
      setPhone("");
      setSelectedEvents([]);
      setTeamData({});
      setErrors({});
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">Register</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Event Registration</h1>
          <p className="text-muted-foreground text-sm mb-10">Fill in your details and select events to register.</p>

          <form onSubmit={handleSubmitMock} className="space-y-8">
            {/* Personal Info */}
            <div className="space-y-4">
              <h2 className="font-mono text-sm font-semibold uppercase tracking-wider border-b pb-2">Personal Info</h2>
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" className="mt-1" />
                {errors.fullName && <p className="text-destructive text-xs mt-1">{errors.fullName}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" className="mt-1" />
                  {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 9876543210" className="mt-1" />
                  {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Event Selection */}
            <div className="space-y-4">
              <h2 className="font-mono text-sm font-semibold uppercase tracking-wider border-b pb-2">Select Events</h2>
              {errors.events && <p className="text-destructive text-xs">{errors.events}</p>}

              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="border rounded-lg p-4 animate-pulse">
                      <div className="h-4 bg-muted rounded w-1/3" />
                    </div>
                  ))}
                </div>
              ) : activeEvents.length > 0 ? (
                <div className="space-y-3">
                  {activeEvents.map((event) => {
                    const selected = selectedEvents.includes(event.id);
                    const status = getEventStatus(event.event_date);
                    const full = isEventFull(event);
                    const disabled = full;
                    const spotsLeft = event.max_slots ? event.max_slots - (regCounts?.[event.id] || 0) : null;

                    return (
                      <div key={event.id} className={`border rounded-lg p-4 transition-colors ${disabled ? "opacity-50" : ""} ${selected ? "bg-muted/50 border-foreground/20" : ""}`}>
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id={event.id}
                            checked={selected}
                            onCheckedChange={() => toggleEvent(event.id)}
                            className="mt-0.5"
                            disabled={disabled}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <label htmlFor={event.id} className={`font-mono text-sm font-semibold ${disabled ? "" : "cursor-pointer"}`}>
                                {event.name}
                              </label>
                              <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider">
                                {event.event_type}
                              </Badge>
                              <Badge variant={getStatusVariant(status)} className="font-mono text-[10px] uppercase tracking-wider">
                                {status}
                              </Badge>
                              {full && (
                                <Badge variant="destructive" className="font-mono text-[10px] uppercase tracking-wider">
                                  Full
                                </Badge>
                              )}
                            </div>
                            {event.description && (
                              <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
                            )}
                            <div className="flex items-center gap-3 mt-2">
                              {event.event_date && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Calendar size={10} />
                                  {new Date(event.event_date).toLocaleDateString()}
                                </div>
                              )}
                              {spotsLeft !== null && !full && (
                                <span className="text-xs text-muted-foreground">{spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left</span>
                              )}
                            </div>

                            {/* Team fields */}
                            {selected && event.event_type === "team" && teamData[event.id] && (
                              <div className="mt-4 pl-0 space-y-3 border-t pt-4">
                                <p className="text-xs text-muted-foreground">Member 1 (Leader): {fullName || "—"}</p>
                                {teamData[event.id].members.map((m, i) => (
                                  <div key={i}>
                                    <Label className="text-xs">Member {i + 2} *</Label>
                                    <Input
                                      value={m}
                                      onChange={(e) => updateMember(event.id, i, e.target.value)}
                                      placeholder={`Member ${i + 2} name`}
                                      className="mt-1 h-8 text-sm"
                                    />
                                    {errors[`member_${event.id}_${i}`] && (
                                      <p className="text-destructive text-xs mt-1">{errors[`member_${event.id}_${i}`]}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No events available for registration.</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full font-mono tracking-wider"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" /> Submitting...
                </>
              ) : (
                "Submit Registration"
              )}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
