import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const AgenticCTA = () => {
  const navigate = useNavigate();

  const goToContact = () => {
    navigate("/");
    setTimeout(() => {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <section className="py-2 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-secondary/20 to-background" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto flex justify-end mb-2">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-green-500/20 bg-green-500/5">
            <Shield className="w-3.5 h-3.5 text-green-400 shrink-0" />
            <span className="text-xs text-muted-foreground">
              <strong className="text-green-400">Human-in-the-Loop</strong> checkpoints — traceable reasoning, auditable decisions, human approval at every critical gate.
            </span>
          </div>
        </div>

        <div className="text-center max-w-2xl mx-auto">
          <span className="text-primary font-medium text-sm uppercase tracking-wider mb-4 block">Next Step</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Let's Explore Your{" "}
            <span className="gradient-text">Next Step</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
            Whether you're exploring your first agent or scaling a multi-agent system, we'll help you pick the right architecture and deploy agents that deliver real outcomes.
          </p>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="hero"
              size="lg"
              onClick={goToContact}
            >
              Schedule a Consultation
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AgenticCTA;
