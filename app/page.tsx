import { Hero } from "@/components/landing/Hero";
import { EventStrip } from "@/components/landing/EventStrip";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <EventStrip />
      <HowItWorks />
      <Footer />
    </div>
  );
}
