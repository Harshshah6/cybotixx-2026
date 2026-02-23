import "dotenv/config";
import db from "../src/lib/prisma-client";

const initialEvents = [
    {
        name: "Cyber Security Hackathon",
        slug: "cyber-security-hackathon",
        description: "A 24-hour hackathon focused on network security and ethical hacking.",
        eventDate: new Date("2026-03-15"),
        eventType: "TEAM" as const,
        minTeamSize: 2,
        maxTeamSize: 4,
        maxSlots: 50,
        isActive: true,
    },
    {
        name: "AI Workshop",
        slug: "ai-workshop",
        description: "Introduction to machine learning and neural networks.",
        eventDate: new Date("2026-04-10"),
        eventType: "SOLO" as const,
        minTeamSize: 1,
        maxTeamSize: 1,
        maxSlots: 100,
        isActive: true,
    },
    {
        name: "Code Golf Contest",
        slug: "code-golf-contest",
        description: "Solve problems with the shortest possible code.",
        eventDate: new Date("2026-03-01"),
        eventType: "SOLO" as const,
        minTeamSize: 1,
        maxTeamSize: 1,
        maxSlots: 30,
        isActive: true,
    }
];

async function main() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error("DATABASE_URL is not set");
    }

    // Using dynamic import or direct instantiation with datasource overrides
    // Since we use a singleton, we might need to recreate it or just use it if it's already configured.
    // Actually, let's just use the client and ensure it has the URL via config if possible, 
    // but if tsx bypasses config, we might need to pass it here.

    console.log("Seeding events...");
    for (const event of initialEvents) {
        await db.event.upsert({
            where: { slug: event.slug },
            update: {},
            create: event,
        });
    }

    console.log("Seeding admin...");
    await db.admin.upsert({
        where: { email: "admin@cybotixx.com" },
        update: {},
        create: {
            email: "admin@cybotixx.com",
            password: "admin123", // In a real app, this would be hashed
        },
    });

    console.log("Seeding completed.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        // No explicit disconnect needed if using the singleton pattern correctly, 
        // but good practice in simple scripts.
    });
