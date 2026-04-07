import { motion } from "framer-motion";

const features = [
  "Confidence-based escalation — agents ask for help when they need it",
  "Policy-driven approval gates for high-impact decisions",
  "Full reasoning trace visibility for every agent action",
  "Feedback loops that improve agent judgment over time",
];

const loopSteps = [
  { icon: "🤖", label: "Agent Proposes" },
  { icon: "👤", label: "Human Validates" },
  { icon: "⚡", label: "System Executes" },
  { icon: "📊", label: "Outcome Observed" },
  { icon: "🧠", label: "Agent Learns" },
];

const codeSnippet = `// Escalation Policy
if (agent.confidence < threshold
    || decision.impact === "critical"
    || policy.requiresApproval()) {
  escalateToHuman(decision);
}`;

const HumanInTheLoop = () => {
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
          <span className="text-xs font-mono font-semibold tracking-[0.2em] text-primary uppercase mb-3 block">HUMAN-IN-THE-LOOP</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Autonomous, <span className="gradient-text">Not Unsupervised</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
          {/* Left: Visual */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-wrap items-center justify-center gap-2">
              {loopSteps.map((step, i) => (
                <div key={step.label} className="flex items-center gap-2">
                  <motion.div
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ repeat: Infinity, duration: 3, delay: i * 0.6 }}
                  >
                    <span className="text-lg">{step.icon}</span>
                    <span className="text-xs font-mono text-muted-foreground">{step.label}</span>
                  </motion.div>
                  {i < loopSteps.length - 1 && <span className="text-primary">→</span>}
                  {i === loopSteps.length - 1 && <span className="text-primary">↻</span>}
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-card border border-border/50 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-border/50">
                <div className="w-3 h-3 rounded-full bg-destructive/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <pre className="p-4 text-xs font-mono text-muted-foreground leading-relaxed">
                <code>{codeSnippet}</code>
              </pre>
            </div>
          </motion.div>

          {/* Right: Text */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Every solution we build follows the principle of <strong className="text-foreground">Least Agency</strong> — agents get the minimum autonomy their task requires, and escalate to your team at critical points. This is what makes agentic AI trustworthy enough for production.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Every reasoning chain is traceable. Every decision is auditable. Every critical action has a human checkpoint.
            </p>
            <ul className="space-y-3">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-green-400 mt-1.5 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HumanInTheLoop;
