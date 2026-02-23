import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { JetBrains_Mono, Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "Cybotixx - BCA Forum",
  description: "A student-driven tech community fostering innovation through hackathons, coding contests, workshops, and collaborative learning.",
};

const inter = Inter({
  subsets: ['latin'],
  weight: ['300','400','500','600','700'],
  variable: '--font-inter',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400','500','600','700'],
  variable: '--font-jetbrains',
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrains.variable} antialiased`}
        suppressHydrationWarning
      >
        <Toaster/>
        {children}
      </body>
    </html>
  );
}
