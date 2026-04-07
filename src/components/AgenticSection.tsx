import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Network, Sparkles, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const patterns = [
  {
    icon: Bot,
    title: "The Solo Expert",
    description: "A single agent runs the full decision cycle — perceive, reason, act, and learn from outcomes autonomously.",
    accent: "hsl(172 72% 42%)",
    tag: "Autonomous",
  },
  {
    icon: Network,
    title: "The Command Center",
    description: "Multiple specialized agents coordinated by an orchestrator, with human approval gates at critical junctures.",
    accent: "hsl(230 70% 62%)",
    tag: "Multi-Agent",
  },
  {
    icon: Sparkles,
    title: "The Smart Router",
    description: "An intelligent routing layer classifies incoming signals and dispatches each to the right agent pipeline.",
    accent: "hsl(270 60% 65%)",
    tag: "Adaptive",
  },
];

const AgenticSection = () => {
  const navigate = useNavigate();

  return (
    <section id="agentic" className="py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/8 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
        >
          <span className="text-primary font-medium text-xs uppercase tracking-[0.2em]">Agentic AI</span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mt-4 tracking-tight">
            Intelligent Agents for{" "}
            <span className="gradient-text">Real-World Decisions</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-3 leading-relaxed">
            We design and implement agentic AI systems that capture signals, reason with your domain expertise,
            and act autonomously — with humans in the loop at every critical gate.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto mb-6">
          {patterns.map((pattern, i) => {
            const Icon = pattern.icon;
            return (
              <motion.div
                key={pattern.title}
                className="group relative rounded-2xl bg-card border border-border/60 p-7 cursor-pointer overflow-hidden transition-all duration-400"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: 0.08 * i, duration: 0.45 }}
                whileHover={{ y: -5, borderColor: `${pattern.accent}50` }}
                onClick={() => navigate("/agentic-ai")}
                style={{ "--accent-color": pattern.accent } as React.CSSProperties}
              >
                {/* Tag pill */}
                <div
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium mb-5"
                  style={{ background: `${pattern.accent}15`, color: pattern.accent, border: `1px solid ${pattern.accent}30` }}
                >
                  {pattern.tag}
                </div>

                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${pattern.accent}15`, color: pattern.accent }}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="font-heading font-bold text-lg text-foreground mb-3 group-hover:text-primary transition-colors">
                  {pattern.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {pattern.description}
                </p>

                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 30% 30%, ${pattern.accent}08, transparent 70%)` }}
                />
                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-6 right-6 h-px opacity-0 group-hover:opacity-60 transition-opacity duration-400"
                  style={{ background: `linear-gradient(90deg, transparent, ${pattern.accent}, transparent)` }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* CTA row */}
        <motion.div
          className="flex flex-col items-center gap-5"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-primary/20 bg-primary/6">
            <Shield className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="text-sm text-muted-foreground">
              <strong className="text-primary">Human-in-the-Loop</strong> checkpoints at every critical decision gate
            </span>
          </div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              className="h-11 px-7 rounded-xl font-heading font-semibold text-sm text-primary-foreground border border-primary/20"
              style={{ background: "var(--gradient-primary)" }}
              onClick={() => navigate("/agentic-ai")}
            >
              Explore the Architecture
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AgenticSection;
