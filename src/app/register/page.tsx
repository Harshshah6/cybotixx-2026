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
import { getEventStatus, getStatusVariant } from "@/lib/eventStatus";
import { toast } from "sonner";
import { useEffect, useCallback } from "react";
import { getEvents, registerParticipant } from "@/app/actions/events";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { Event } from "@/types";

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
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dialog State
  const [feedbackDialog, setFeedbackDialog] = useState<{
    open: boolean;
    type: "success" | "error";
    message: string;
  }>({
    open: false,
    type: "success",
    message: ""
  });

  const fetchEventsData = useCallback(async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch {
      toast.error("Failed to load events");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEventsData();
  }, [fetchEventsData]);

  // Filter out ended events
  const activeEvents = events?.filter((e) => getEventStatus(e.eventDate) !== "ended") || [];

  const isEventFull = (event: Event) => {
    if (!event.maxSlots) return false;
    return (event._count?.registrations || 0) >= event.maxSlots;
  };

  const toggleEvent = (eventId: string) => {
    setSelectedEvents((prev) => {
      if (prev.includes(eventId)) {
        const newTeam = { ...teamData };
        delete newTeam[eventId];
        setTeamData(newTeam);
        return prev.filter((id) => id !== eventId);
      }
      const event = events?.find((e: Event) => e.id === eventId);
      if (event?.eventType === "TEAM") {
        setTeamData((prev) => ({
          ...prev,
          [eventId]: {
            members: Array((event.maxTeamSize || 2) - 1).fill(""),
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
      const event = events?.find((e: Event) => e.id === eventId);
      if (event?.eventType === "TEAM") {
        const td = teamData[eventId];
        td?.members.forEach((m, i) => {
          if (!m.trim()) errs[`member_${eventId}_${i}`] = "Member name required";
        });
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const result = await registerParticipant({
        fullName,
        email,
        phone,
        selectedEvents,
        teamData
      });

      if (result.success) {
        setFeedbackDialog({
          open: true,
          type: "success",
          message: "Registration successful! We've sent a confirmation to your email."
        });
        setFullName("");
        setEmail("");
        setPhone("");
        setSelectedEvents([]);
        setTeamData({});
        setErrors({});
      } else {
        setFeedbackDialog({
          open: true,
          type: "error",
          message: result.error || "Registration failed. Please try again."
        });
      }
    } catch {
      setFeedbackDialog({
        open: true,
        type: "error",
        message: "An unexpected error occurred. Please check your connection."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">Register</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Event Registration</h1>
          <p className="text-muted-foreground text-sm mb-10">Fill in your details and select events to register.</p>

          <form onSubmit={handleSubmit} className="space-y-8">
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
                    const status = getEventStatus(event.eventDate);
                    const full = isEventFull(event);
                    const disabled = full;
                    const spotsLeft = event.maxSlots ? event.maxSlots - (event._count?.registrations || 0) : null;

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
                                {event.eventType}
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
                              {event.eventDate && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Calendar size={10} />
                                  {new Date(event.eventDate).toLocaleDateString()}
                                </div>
                              )}
                              {spotsLeft !== null && !full && (
                                <span className="text-xs text-muted-foreground">{spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left</span>
                              )}
                            </div>

                            {/* Team fields */}
                            {selected && event.eventType === "TEAM" && teamData[event.id] && (
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

      {/* Feedback Dialog */}
      <Dialog
        open={feedbackDialog.open}
        onOpenChange={(open) => setFeedbackDialog(prev => ({ ...prev, open }))}
      >
        <DialogContent className="sm:max-w-md border-2 border-foreground/10 p-0 overflow-hidden bg-background">
          <div className={`h-2 w-full ${feedbackDialog.type === "success" ? "bg-foreground" : "bg-destructive"}`} />
          <div className="p-8 pb-10">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className={`p-3 rounded-full ${feedbackDialog.type === "success" ? "bg-foreground/5" : "bg-destructive/5"}`}>
                {feedbackDialog.type === "success" ? (
                  <CheckCircle2 className="w-10 h-10 text-foreground" strokeWidth={1.5} />
                ) : (
                  <AlertCircle className="w-10 h-10 text-destructive" strokeWidth={1.5} />
                )}
              </div>

              <div className="space-y-2">
                <DialogTitle className="font-mono text-xl font-bold tracking-tighter uppercase">
                  {feedbackDialog.type === "success" ? "Registration Success" : "Registration Failed"}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground text-sm max-w-70">
                  {feedbackDialog.message}
                </DialogDescription>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-3">
              {feedbackDialog.type === "success" ? (
                <>
                  <Button
                    className="w-full font-mono uppercase tracking-widest text-xs h-12"
                    onClick={() => router.push("/")}
                  >
                    Back to Home
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full font-mono uppercase tracking-widest text-xs h-12 border-foreground/10"
                    onClick={() => setFeedbackDialog({ ...feedbackDialog, open: false })}
                  >
                    Review Details
                  </Button>
                </>
              ) : (
                <Button
                  className="w-full font-mono uppercase tracking-widest text-xs h-12 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  onClick={() => setFeedbackDialog({ ...feedbackDialog, open: false })}
                >
                  <X className="w-3 h-3 mr-2" /> Try Again
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Register;
