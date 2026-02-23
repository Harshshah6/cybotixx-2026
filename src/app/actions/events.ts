"use server";

import prisma from "@/lib/prisma-client";
import { RegistrationStatus, EventType } from "../../../generated/prisma/client";
import { revalidatePath } from "next/cache";
import { Event, Registration } from "@/types";

export async function getEvents(): Promise<Event[]> {
    try {
        const events = await prisma.event.findMany({
            where: {
                isActive: true,
            },
            include: {
                _count: {
                    select: { registrations: true },
                },
            },
            orderBy: {
                eventDate: "asc",
            },
        });

        return events as Event[];
    } catch (error) {
        console.error("Error fetching events:", error);
        throw new Error("Failed to fetch events");
    }
}

export async function registerParticipant(formData: {
    fullName: string;
    email: string;
    phone: string;
    selectedEvents: string[];
    teamData: Record<string, { members: string[] }>;
}) {
    try {
        const { fullName, email, phone, selectedEvents, teamData } = formData;

        // 1. Create or get participant
        const participant = await prisma.participant.upsert({
            where: { email },
            update: { fullName, phone },
            create: { fullName, email, phone },
        });

        // 2. Create registrations
        for (const eventId of selectedEvents) {
            const event = await prisma.event.findUnique({
                where: { id: eventId },
                include: {
                    _count: {
                        select: { registrations: true }
                    }
                }
            });

            if (!event) throw new Error(`Event ${eventId} not found`);

            // Check if slots are full
            if (event.maxSlots && event._count.registrations >= event.maxSlots) {
                throw new Error(`Registration failed: The event "${event.name}" is already full.`);
            }

            const teamMembers = teamData[eventId]?.members || [];

            await prisma.registration.create({
                data: {
                    participantId: participant.id,
                    eventId: eventId,
                    status: RegistrationStatus.PENDING,
                    teamName: event.eventType === EventType.TEAM ? `${fullName}'s Team` : null,
                    teamMembers: {
                        create: teamMembers.map((name) => ({
                            name,
                        })),
                    },
                },
            });
        }

        revalidatePath("/register");
        revalidatePath("/admin");
        revalidatePath("/registrations");
        revalidatePath("/");

        return { success: true };
    } catch (error: unknown) {
        console.error("Registration error:", error);
        if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
            return { success: false, error: "You are already registered for one of these events." };
        }
        const message = error instanceof Error ? error.message : "Registration failed. Please try again.";
        return { success: false, error: message };
    }
}

export async function getRegistrations(eventId?: string): Promise<Registration[]> {
    try {
        const registrations = await prisma.registration.findMany({
            where: eventId && eventId !== "all" ? { eventId } : {},
            include: {
                event: true,
                participant: true,
                teamMembers: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return registrations as Registration[];
    } catch (error) {
        console.error("Error fetching registrations:", error);
        throw new Error("Failed to fetch registrations");
    }
}

export async function createEvent(data: {
    name: string;
    description?: string;
    eventDate: string;
    eventType: EventType;
    minTeamSize?: number;
    maxTeamSize?: number;
    maxSlots?: number;
    isActive?: boolean;
}): Promise<{ success: boolean; event?: Event; error?: string }> {
    try {
        const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const event = await prisma.event.create({
            data: {
                ...data,
                slug,
                eventDate: new Date(data.eventDate),
                minTeamSize: data.eventType === EventType.TEAM ? (data.minTeamSize || 2) : 1,
                maxTeamSize: data.eventType === EventType.TEAM ? (data.maxTeamSize || 2) : 1,
            },
        });

        revalidatePath("/");
        revalidatePath("/register");
        revalidatePath("/admin");

        return { success: true, event: event as Event };
    } catch (error) {
        console.error("Error creating event:", error);
        return { success: false, error: "Failed to create event" };
    }
}

export async function updateEvent(id: string, data: {
    name: string;
    description?: string;
    eventDate: string;
    eventType: EventType;
    minTeamSize?: number;
    maxTeamSize?: number;
    maxSlots?: number;
    isActive?: boolean;
}): Promise<{ success: boolean; event?: Event; error?: string }> {
    try {
        const event = await prisma.event.update({
            where: { id },
            data: {
                ...data,
                eventDate: new Date(data.eventDate),
                minTeamSize: data.eventType === EventType.TEAM ? (data.minTeamSize || 2) : 1,
                maxTeamSize: data.eventType === EventType.TEAM ? (data.maxTeamSize || 2) : 1,
            },
        });

        revalidatePath("/");
        revalidatePath("/register");
        revalidatePath("/admin");

        return { success: true, event: event as Event };
    } catch (error) {
        console.error("Error updating event:", error);
        return { success: false, error: "Failed to update event" };
    }
}

export async function deleteEvent(id: string) {
    try {
        // Delete registrations first due to foreign key constraints if not cascaded
        await prisma.registration.deleteMany({
            where: { eventId: id },
        });
        await prisma.event.delete({
            where: { id },
        });
        revalidatePath("/");
        revalidatePath("/register");
        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        console.error("Error deleting event:", error);
        return { success: false, error: "Failed to delete event" };
    }
}

export async function deleteRegistration(id: string) {
    try {
        // Team members usually deleted via cascade or deleteMany
        await prisma.teamMember.deleteMany({
            where: { registrationId: id },
        });
        await prisma.registration.delete({
            where: { id },
        });
        revalidatePath("/register");
        revalidatePath("/admin");
        revalidatePath("/registrations");
        return { success: true };
    } catch (error) {
        console.error("Error deleting registration:", error);
        return { success: false, error: "Failed to delete registration" };
    }
}
