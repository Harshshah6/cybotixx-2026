import Footer from "@/components/Footer";
import AboutSection from "@/components/landing/AboutSection";
import ClubHeadsSection from "@/components/landing/ClubHeadsSection";
import EventsPreviewSection from "@/components/landing/EventsPreviewSection";
import HeroSection from "@/components/landing/HeroSection";
import Navbar from "@/components/Navbar";

export default async function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <AboutSection />
        <ClubHeadsSection />
        <EventsPreviewSection/>
      </main>
      <Footer />
    </div>
  );
}
