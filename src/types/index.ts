import { EventType, RegistrationStatus } from "../../generated/prisma";

export interface Event {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    eventDate: Date;
    eventType: EventType;
    minTeamSize: number;
    maxTeamSize: number;
    maxSlots?: number | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count?: {
        registrations: number;
    };
}

export interface Participant {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    createdAt: Date;
}

export interface TeamMember {
    id: string;
    name: string;
    registrationId: string;
}

export interface Registration {
    id: string;
    participantId: string;
    eventId: string;
    status: RegistrationStatus;
    teamName?: string | null;
    createdAt: Date;
    updatedAt: Date;
    event?: Event;
    participant?: Participant;
    teamMembers?: TeamMember[];
}
