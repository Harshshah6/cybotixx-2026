'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2, LogOut, BarChart3, Users, CalendarDays } from "lucide-react";
import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getEvents, getRegistrations, createEvent, updateEvent, deleteEvent, deleteRegistration } from "@/app/actions/events";
import { logoutAdmin } from "@/app/actions/auth";
import { toast } from "sonner";
import { EventType } from "../../../generated/prisma";
import { Event, Registration } from "@/types";

const Admin = () => {
    const router = useRouter();
    const [eventDialogOpen, setEventDialogOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [form, setForm] = useState({
        name: "", description: "", eventDate: "", eventType: "SOLO" as EventType,
        maxTeamSize: 1, maxSlots: "" as string, isActive: true,
    });

    const [events, setEvents] = useState<Event[]>([]);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [eventsData, registrationsData] = await Promise.all([
                getEvents(),
                getRegistrations()
            ]);
            setEvents(eventsData);
            setRegistrations(registrationsData);
        } catch (error) {
            toast.error("Failed to load admin data");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const resetForm = () => {
        setForm({ name: "", description: "", eventDate: "", eventType: "SOLO", maxTeamSize: 1, maxSlots: "", isActive: true });
        setEditingEvent(null);
    };

    const handleSaveEvent = async () => {
        setIsSaving(true);
        const eventData = {
            name: form.name,
            description: form.description,
            eventDate: form.eventDate,
            eventType: form.eventType,
            maxTeamSize: form.eventType === "TEAM" ? form.maxTeamSize : 1,
            maxSlots: form.maxSlots ? parseInt(form.maxSlots) : undefined,
            isActive: form.isActive,
        };

        try {
            const result = editingEvent
                ? await updateEvent(editingEvent.id, eventData)
                : await createEvent(eventData);

            if (result.success) {
                toast.success(editingEvent ? "Event updated" : "Event created");
                fetchData();
                setEventDialogOpen(false);
                resetForm();
            } else {
                toast.error(result.error || "Operation failed");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteEvent = async (id: string) => {
        if (!confirm("Are you sure? This will delete all registrations for this event.")) return;
        try {
            const result = await deleteEvent(id);
            if (result.success) {
                toast.success("Event deleted");
                fetchData();
            } else {
                toast.error(result.error || "Delete failed");
            }
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    const handleDeleteRegistration = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            const result = await deleteRegistration(id);
            if (result.success) {
                toast.success("Registration deleted");
                fetchData();
            } else {
                toast.error(result.error || "Delete failed");
            }
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    const handleLogout = async () => {
        await logoutAdmin();
        toast.success("Logged out");
        router.push("/adminlogin");
    };

    const openEdit = (event: Event) => {
        setEditingEvent(event);
        setForm({
            name: event.name,
            description: event.description || "",
            eventDate: event.eventDate ? new Date(event.eventDate).toISOString().split('T')[0] : "",
            eventType: event.eventType,
            maxTeamSize: event.maxTeamSize || 1,
            maxSlots: event.maxSlots ? String(event.maxSlots) : "",
            isActive: event.isActive,
        });
        setEventDialogOpen(true);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <h1 className="font-mono text-lg font-bold tracking-widest uppercase">Admin</h1>
                    <Button variant="outline" size="sm" onClick={handleLogout} className="font-mono text-xs gap-2">
                        <LogOut size={14} /> Logout
                    </Button>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 space-y-10">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-5">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <CalendarDays size={14} />
                            <span className="font-mono text-xs uppercase tracking-wider">Events</span>
                        </div>
                        <p className="text-3xl font-bold font-mono">{events.length}</p>
                    </div>
                    <div className="border rounded-lg p-5">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Users size={14} />
                            <span className="font-mono text-xs uppercase tracking-wider">Registrations</span>
                        </div>
                        <p className="text-3xl font-bold font-mono">{registrations.length}</p>
                    </div>
                    <div className="border rounded-lg p-5">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <BarChart3 size={14} />
                            <span className="font-mono text-xs uppercase tracking-wider">Active Events</span>
                        </div>
                        <p className="text-3xl font-bold font-mono">
                            {events?.filter((e) => e.isActive).length ?? "—"}
                        </p>
                    </div>
                </div>

                {/* Events Management */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-mono text-lg font-semibold">Events</h2>
                        <Dialog open={eventDialogOpen} onOpenChange={(o) => { setEventDialogOpen(o); if (!o) resetForm(); }}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="font-mono text-xs gap-1">
                                    <Plus size={14} /> Add Event
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle className="font-mono">{editingEvent ? "Edit Event" : "New Event"}</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={(e) => { e.preventDefault(); handleSaveEvent(); }} className="space-y-4">
                                    <div>
                                        <Label>Name *</Label>
                                        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="mt-1" />
                                    </div>
                                    <div>
                                        <Label>Description</Label>
                                        <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Date</Label>
                                            <Input type="date" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} className="mt-1" />
                                        </div>
                                        <div>
                                            <Label>Type</Label>
                                            <Select value={form.eventType} onValueChange={(v: EventType) => setForm({ ...form, eventType: v })}>
                                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="SOLO">Solo</SelectItem>
                                                    <SelectItem value="TEAM">Team</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    {form.eventType === "TEAM" && (
                                        <div>
                                            <Label>Max Team Size</Label>
                                            <Input type="number" min={2} value={form.maxTeamSize} onChange={(e) => setForm({ ...form, maxTeamSize: +e.target.value })} className="mt-1" />
                                        </div>
                                    )}
                                    <div>
                                        <Label>Max Slots (optional)</Label>
                                        <Input type="number" min={1} value={form.maxSlots} onChange={(e) => setForm({ ...form, maxSlots: e.target.value })} placeholder="Unlimited" className="mt-1" />
                                    </div>
                                    <Button type="submit" className="w-full font-mono" disabled={isSaving}>
                                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : editingEvent ? "Update" : "Create"}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="border rounded-lg overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/30">
                                    <th className="text-left p-3 font-mono text-xs uppercase tracking-wider">Name</th>
                                    <th className="text-left p-3 font-mono text-xs uppercase tracking-wider hidden sm:table-cell">Type</th>
                                    <th className="text-left p-3 font-mono text-xs uppercase tracking-wider hidden md:table-cell">Date</th>
                                    <th className="text-left p-3 font-mono text-xs uppercase tracking-wider hidden md:table-cell">Status</th>
                                    <th className="text-right p-3 font-mono text-xs uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan={5} className="p-3"><div className="h-4 bg-muted rounded animate-pulse w-1/3" /></td></tr>
                                ) : events?.map((event) => (
                                    <tr key={event.id} className="border-b hover:bg-muted/20 transition-colors">
                                        <td className="p-3 font-medium">{event.name}</td>
                                        <td className="p-3 hidden sm:table-cell">
                                            <Badge variant="outline" className="font-mono text-[10px] uppercase">{event.eventType}</Badge>
                                        </td>
                                        <td className="p-3 hidden md:table-cell text-muted-foreground">
                                            {event.eventDate ? new Date(event.eventDate).toLocaleDateString() : "—"}
                                        </td>
                                        <td className="p-3 hidden md:table-cell">
                                            <Badge variant={event.isActive ? "default" : "secondary"} className="font-mono text-[10px]">
                                                {event.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </td>
                                        <td className="p-3 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button variant="ghost" size="sm" onClick={() => openEdit(event)}><Pencil size={14} /></Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDeleteEvent(event.id)}><Trash2 size={14} /></Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Registrations */}
                <section>
                    <h2 className="font-mono text-lg font-semibold mb-4">Registrations</h2>
                    <div className="border rounded-lg overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/30">
                                    <th className="text-left p-3 font-mono text-xs uppercase tracking-wider">Name</th>
                                    <th className="text-left p-3 font-mono text-xs uppercase tracking-wider hidden sm:table-cell">Event</th>
                                    <th className="text-left p-3 font-mono text-xs uppercase tracking-wider hidden md:table-cell">Email</th>
                                    <th className="text-left p-3 font-mono text-xs uppercase tracking-wider hidden lg:table-cell">Team</th>
                                    <th className="text-right p-3 font-mono text-xs uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registrations?.map((r: Registration) => (
                                    <tr key={r.id} className="border-b hover:bg-muted/20 transition-colors">
                                        <td className="p-3 font-medium">{r.participant?.fullName}</td>
                                        <td className="p-3 hidden sm:table-cell">{r.event?.name}</td>
                                        <td className="p-3 hidden md:table-cell text-muted-foreground">{r.participant?.email}</td>
                                        <td className="p-3 hidden lg:table-cell text-muted-foreground">
                                            {r.teamMembers && r.teamMembers.length > 0 ? `${r.teamMembers.length} members` : "—"}
                                        </td>
                                        <td className="p-3 text-right">
                                            <Button variant="ghost" size="sm" onClick={() => handleDeleteRegistration(r.id)}>
                                                <Trash2 size={14} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Admin;
