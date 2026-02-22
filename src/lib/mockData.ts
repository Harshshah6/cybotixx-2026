export interface Event {
  id: string;
  name: string;
  description: string | null;
  event_date: string | null;
  event_type: "solo" | "team";
  min_team_size: number;
  max_team_size: number;
  max_slots: number | null;
  is_active: boolean;
  created_at?: string;
}

export interface Registration {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  event_id: string;
  created_at: string;
  team_name?: string;
  events?: {
    name: string;
    event_type: string;
  };
  team_members?: {
    id: string;
    registration_id: string;
    member_name: string;
    member_order: number;
  }[];
}

export const initialEvents: Event[] = [
  {
    id: "1",
    name: "Cyber Security Hackathon",
    description: "A 24-hour hackathon focused on network security and ethical hacking.",
    event_date: "2026-03-15",
    event_type: "team",
    min_team_size: 2,
    max_team_size: 4,
    max_slots: 50,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "AI Workshop",
    description: "Introduction to machine learning and neural networks.",
    event_date: "2026-04-10",
    event_type: "solo",
    min_team_size: 1,
    max_team_size: 1,
    max_slots: 100,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Code Golf Contest",
    description: "Solve problems with the shortest possible code.",
    event_date: "2026-03-01",
    event_type: "solo",
    min_team_size: 1,
    max_team_size: 1,
    max_slots: 30,
    is_active: true,
    created_at: new Date().toISOString(),
  }
];

export const initialRegistrations: Registration[] = [
  {
    id: "r1",
    full_name: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    event_id: "1",
    created_at: new Date().toISOString(),
    events: { name: "Cyber Security Hackathon", event_type: "team" },
    team_members: [
      { id: "tm1", registration_id: "r1", member_name: "John Doe", member_order: 1 },
      { id: "tm2", registration_id: "r1", member_name: "Jane Smith", member_order: 2 }
    ]
  },
  {
    id: "r2",
    full_name: "Alice Wang",
    email: "alice@example.com",
    phone: "9876543210",
    event_id: "2",
    created_at: new Date().toISOString(),
    events: { name: "AI Workshop", event_type: "solo" }
  }
];
