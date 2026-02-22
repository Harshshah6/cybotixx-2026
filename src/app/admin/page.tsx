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
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { initialEvents, initialRegistrations, Event, Registration } from "@/lib/mockData";
import { toast } from "sonner";

const Admin = () => {
    const router = useRouter();
    const [eventDialogOpen, setEventDialogOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<any>(null);
    const [form, setForm] = useState({
        name: "", description: "", event_date: "", event_type: "solo" as "solo" | "team",
        max_team_size: 1, max_slots: "" as string, is_active: true,
    });

    const [events, setEvents] = useState<Event[]>(initialEvents);
    const [registrations, setRegistrations] = useState<Registration[]>(initialRegistrations);
    const [stats, setStats] = useState({ events: initialEvents.length, registrations: initialRegistrations.length });
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Mock auth state
    const authLoading = false;
    const user = { email: "admin@example.com" };
    const isAdmin = true;

    const resetForm = () => {
        setForm({ name: "", description: "", event_date: "", event_type: "solo", max_team_size: 1, max_slots: "", is_active: true });
        setEditingEvent(null);
    };

    // Redirect if not admin (Mock)
    useEffect(() => {
        if (!authLoading && (!user || !isAdmin)) {
            router.push("/adminlogin");
        }
    }, [authLoading, user, isAdmin, router]);

    if (!isAdmin) return null;

    const handleSaveEvent = async () => {
        setIsSaving(true);
        const payload: Event = {
            id: editingEvent ? editingEvent.id : Math.random().toString(36).substr(2, 9),
            name: form.name,
            description: form.description || null,
            event_date: form.event_date || null,
            event_type: form.event_type,
            min_team_size: form.event_type === "team" ? 2 : 1,
            max_team_size: form.event_type === "team" ? form.max_team_size : 1,
            max_slots: form.max_slots ? parseInt(form.max_slots) : null,
            is_active: form.is_active,
        };

        // Mock delay
        setTimeout(() => {
            if (editingEvent) {
                setEvents(prev => prev.map(e => e.id === editingEvent.id ? payload : e));
                toast("Event updated (Mock)");
            } else {
                setEvents(prev => [payload, ...prev]);
                toast("Event created (Mock)");
            }
            setStats(prev => ({ ...prev, events: editingEvent ? prev.events : prev.events + 1 }));
            setIsSaving(false);
            setEventDialogOpen(false);
            resetForm();
        }, 500);
    };

    const handleDeleteEvent = (id: string) => {
        setEvents(prev => prev.filter(e => e.id !== id));
        setStats(prev => ({ ...prev, events: prev.events - 1 }));
        toast("Event deleted (Mock)");
    };

    const handleDeleteRegistration = (id: string) => {
        setRegistrations(prev => prev.filter(r => r.id !== id));
        setStats(prev => ({ ...prev, registrations: prev.registrations - 1 }));
        toast("Registration deleted (Mock)");
    };

    const handleLogout = async () => {
        router.push("/adminlogin");
    };

    const openEdit = (event: any) => {
        setEditingEvent(event);
        setForm({
            name: event.name,
            description: event.description || "",
            event_date: event.event_date || "",
            event_type: event.event_type,
            max_team_size: event.max_team_size || 1,
            max_slots: event.max_slots ? String(event.max_slots) : "",
            is_active: event.is_active,
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
                        <p className="text-3xl font-bold font-mono">{stats?.events ?? "—"}</p>
                    </div>
                    <div className="border rounded-lg p-5">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Users size={14} />
                            <span className="font-mono text-xs uppercase tracking-wider">Registrations</span>
                        </div>
                        <p className="text-3xl font-bold font-mono">{stats?.registrations ?? "—"}</p>
                    </div>
                    <div className="border rounded-lg p-5">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <BarChart3 size={14} />
                            <span className="font-mono text-xs uppercase tracking-wider">Active Events</span>
                        </div>
                        <p className="text-3xl font-bold font-mono">
                            {events?.filter((e) => e.is_active).length ?? "—"}
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
                                            <Input type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} className="mt-1" />
                                        </div>
                                        <div>
                                            <Label>Type</Label>
                                            <Select value={form.event_type} onValueChange={(v: "solo" | "team") => setForm({ ...form, event_type: v })}>
                                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="solo">Solo</SelectItem>
                                                    <SelectItem value="team">Team</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    {form.event_type === "team" && (
                                        <div>
                                            <Label>Max Team Size</Label>
                                            <Input type="number" min={2} value={form.max_team_size} onChange={(e) => setForm({ ...form, max_team_size: +e.target.value })} className="mt-1" />
                                        </div>
                                    )}
                                    <div>
                                        <Label>Max Slots (optional)</Label>
                                        <Input type="number" min={1} value={form.max_slots} onChange={(e) => setForm({ ...form, max_slots: e.target.value })} placeholder="Unlimited" className="mt-1" />
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
                                            <Badge variant="outline" className="font-mono text-[10px] uppercase">{event.event_type}</Badge>
                                        </td>
                                        <td className="p-3 hidden md:table-cell text-muted-foreground">
                                            {event.event_date ? new Date(event.event_date).toLocaleDateString() : "—"}
                                        </td>
                                        <td className="p-3 hidden md:table-cell">
                                            <Badge variant={event.is_active ? "default" : "secondary"} className="font-mono text-[10px]">
                                                {event.is_active ? "Active" : "Inactive"}
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
                                {registrations?.map((r: any) => (
                                    <tr key={r.id} className="border-b hover:bg-muted/20 transition-colors">
                                        <td className="p-3 font-medium">{r.full_name}</td>
                                        <td className="p-3 hidden sm:table-cell">{r.events?.name}</td>
                                        <td className="p-3 hidden md:table-cell text-muted-foreground">{r.email}</td>
                                        <td className="p-3 hidden lg:table-cell text-muted-foreground">
                                            {r.team_members && r.team_members.length > 0 ? `${r.team_members.length} members` : "—"}
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
