"use server";

import { cookies } from "next/headers";
import prisma from "@/lib/prisma-client";

export async function loginAdmin(email: string, password: string) {
    try {
        const admin = await prisma.admin.findUnique({
            where: { email },
        });

        if (admin && admin.password === password) {
            const cookieStore = await cookies();
            cookieStore.set("admin_session", "true", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24, // 1 day
                path: "/",
            });
            return { success: true };
        }

        return { success: false, error: "Invalid email or password" };
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, error: "An error occurred during login" };
    }
}

export async function verifySession() {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");
    return !!session;
}

export async function logoutAdmin() {
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");
    return { success: true };
}
