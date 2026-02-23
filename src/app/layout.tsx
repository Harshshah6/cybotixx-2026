import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Cybotixx - BCA Forum",
  description: "A student-driven tech community fostering innovation through hackathons, coding contests, workshops, and collaborative learning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
        suppressHydrationWarning
      >
        <Toaster/>
        {children}
      </body>
    </html>
  );
}
