import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import FeaturesSection from "@/components/FeaturesSection";
import ApproachSection from "@/components/ApproachSection";
import AgenticSection from "@/components/AgenticSection";
import OutcomesSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import CursorGlow from "@/components/CursorGlow";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <CursorGlow />
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <ApproachSection />
        <AgenticSection />
        <OutcomesSection />
        <ContactSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
