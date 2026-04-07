import { motion } from "framer-motion";
import { ArrowRight, X, Check } from "lucide-react";

const legacyItems = [
  "Dashboards require humans to interpret data before action",
  "Single-model predictions with no reasoning or self-correction",
  "Insights siloed and disconnected from downstream actions",
  "Weeks or months from data assembly to decision",
  "No learning from outcomes",
];

const agenticItems = [
  "Agents interpret, reason, and act using your domain expertise",
  "Multi-step reasoning loops that think, verify, then act",
  "SIGNALs from diverse sources flow into coordinated LAYERed actions",
  "Real-time decisions with Human-in-the-Loop safeguards",
  "Continuous learning that builds institutional intelligence",
];

const ParadigmShift = () => {
  return (
    <section className="py-14 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-mono font-semibold tracking-[0.2em] text-primary uppercase mb-3 block">THE TRANSFORMATION</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            From Dashboards to <span className="gradient-text">Decision Agents</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Most organizations are stuck in the legacy BI era — drowning in dashboards but starving for action. Signal Layer helps you make the leap to agentic AI. We guide you through every step.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto items-stretch">
          {/* Legacy */}
          <motion.div
            className="rounded-xl border border-border/50 bg-card/50 p-6 opacity-70 relative overflow-hidden"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 0.7, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,hsl(var(--border)/0.1)_10px,hsl(var(--border)/0.1)_11px)]" />
            <div className="relative z-10">
              <span className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground/60 mb-2 block">WHERE MOST BUSINESSES ARE</span>
              <h3 className="font-heading text-lg font-bold text-muted-foreground mb-1">Static AI & Traditional BI</h3>
              <ul className="space-y-3 mt-4">
                {legacyItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground/80">
                    <X className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Agentic */}
          <motion.div
            className="rounded-xl border border-primary/30 bg-card p-6 relative overflow-hidden"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ boxShadow: "0 0 40px hsl(175 80% 45% / 0.08)" }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent" />
            <div className="relative z-10">
              <span className="text-[10px] font-mono font-bold tracking-widest text-primary/80 mb-2 block">WHERE WE TAKE YOU</span>
              <h3 className="font-heading text-lg font-bold text-foreground mb-1">Autonomous Intelligence Agents</h3>
              <ul className="space-y-3 mt-4">
                {agenticItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Arrow between on desktop */}
        <div className="hidden md:flex justify-center mt-6">
          <motion.div
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
            animate={{ x: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <span className="text-xs font-mono text-primary/70">Legacy</span>
            <ArrowRight className="w-5 h-5 text-primary" />
            <span className="text-xs font-mono text-primary font-bold">Agentic</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ParadigmShift;
