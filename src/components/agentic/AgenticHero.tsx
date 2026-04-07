import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import agenticDiagram from "@/assets/agentic-hero-diagram.png";

const AgenticHero = () => {
  const navigate = useNavigate();

  const goToContact = () => {
    navigate("/");
    setTimeout(() => {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <section className="relative flex items-center justify-center overflow-hidden pt-24 pb-10">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
      <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
      <motion.div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/15 rounded-full blur-3xl animate-pulse-glow" />
      <motion.div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/15 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border mb-6"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">AGENTIC AI SOLUTIONS</span>
            </motion.div>

            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight">
              Build Autonomous AI Agents{" "}
              <span className="gradient-text">for Real‑World Decisions</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
              Signal Layer partners with businesses to design and implement agentic AI systems — capturing signals from your data, reasoning with your domain expertise layered in, and acting autonomously while keeping humans in the loop at every critical moment.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="hero"
                  size="xl"
                  onClick={() => document.getElementById("architecture-patterns")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Explore Our Approach
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="heroOutline"
                  size="xl"
                  onClick={goToContact}
                >
                  Talk to Our Team
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Diagram */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <img
              src={agenticDiagram}
              alt="Abstract orchestrator diagram: a central glowing node surrounded by concentric rings representing coordinated AI agent layers"
              className="w-full max-w-md rounded-lg"
            />
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default AgenticHero;
