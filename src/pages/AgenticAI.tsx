import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import CursorGlow from "@/components/CursorGlow";
import AgenticHero from "@/components/agentic/AgenticHero";
import ArchitecturePatterns from "@/components/agentic/ArchitecturePatterns";
import AgenticCTA from "@/components/agentic/AgenticCTA";
import { Helmet } from "react-helmet-async";

const AgenticAI = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Agentic AI Solutions | Signal Layer</title>
        <meta name="description" content="Signal Layer helps businesses design and implement agentic AI — intelligent agents that capture signals, reason with your domain expertise, and take action with humans in the loop." />
        <meta property="og:title" content="Agentic AI Solutions | Signal Layer" />
        <meta property="og:description" content="We help organizations build intelligent agents that transform decision-making from passive dashboards to autonomous action." />
        <link rel="canonical" href="https://www.signallayer.ai/agentic-ai" />
      </Helmet>
      <CursorGlow />
      <Header />
      <main>
        <AgenticHero />
        <ArchitecturePatterns />
        <AgenticCTA />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default AgenticAI;
