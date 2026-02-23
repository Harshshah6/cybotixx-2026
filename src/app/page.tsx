import Footer from "@/components/Footer";
import AboutSection from "@/components/landing/AboutSection";
import ClubHeadsSection from "@/components/landing/ClubHeadsSection";
import EventsPreviewSection from "@/components/landing/EventsPreviewSection";
import HeroSection from "@/components/landing/HeroSection";
import Navbar from "@/components/Navbar";
import { getEvents } from "./actions/events";

export default async function Home() {
  const events = await getEvents();
  // Show at most 4 events on landing page
  const previewEvents = events.slice(0, 4);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <AboutSection />
        <ClubHeadsSection />
        <EventsPreviewSection events={previewEvents} />
      </main>
      <Footer />
    </div>
  );
}
