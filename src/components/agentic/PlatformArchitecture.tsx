import { motion } from "framer-motion";

const tiers = [
  {
    num: "01",
    title: "Signal Foundation",
    accentColor: "hsl(175 80% 45%)",
    blocks: [
      {
        title: "Signal Ingestion",
        text: "Captures real-time signals from market feeds, internal systems, APIs, documents, IoT sensors, and unstructured data streams. Diverse sources are unified into a single semantic layer that agents can query and reason over.",
      },
      {
        title: "Knowledge & Context Layer",
        text: "Signals are enriched with your domain-specific knowledge — entities, relationships, and contextual meaning. Provenance tracking ensures agents know where information came from and how fresh it is. Policy-aware retrieval controls what agents can access based on role and context.",
      },
    ],
  },
  {
    num: "02",
    title: "Agent Orchestration",
    accentColor: "hsl(230 70% 60%)",
    blocks: [
      {
        title: "Multi-Agent Coordination",
        text: "Specialist agents — planner, researcher, analyst, executor — work in concert through graph-based workflows. Each agent has its own tools, memory, and capabilities, but the orchestrator manages task delegation, state tracking, and result assembly.",
      },
      {
        title: "Reasoning Engine",
        text: "Agents don't just predict — they reason. ReAct-style loops enable step-by-step thinking: observe, reason, act, evaluate. Reflection mechanisms allow agents to critique their own outputs, catch errors, and self-correct. Every reasoning chain is traceable and auditable.",
      },
    ],
  },
  {
    num: "03",
    title: "Autonomous Execution",
    accentColor: "hsl(270 60% 65%)",
    blocks: [
      {
        title: "Action & Integration",
        text: "Agents execute validated decisions through API integrations, workflow triggers, notification systems, and downstream automations. The system closes the loop from signal to action — decisions drive real outcomes.",
      },
      {
        title: "Continuous Learning",
        text: "Every action produces an outcome that feeds back into the system. Episodic memory records specific past interactions. Semantic memory captures patterns learned over time. Procedural memory stores refined strategies that improve with use.",
      },
    ],
  },
];

const codeSnippet = `// Signal Layer Agent Orchestration
const orchestrator = createOrchestrator({
  agents: ["planner", "researcher", "analyst", "executor"],
  workflow: "hierarchical",
  memory: { type: "episodic+semantic", persist: true },
  humanInLoop: {
    approval: "critical_decisions",
    escalation: "confidence < 0.7"
  },
  guardrails: { policy: "least_agency", audit: true }
});

await orchestrator.run({
  signal: incomingData,
  goal: "optimize_decision"
});`;

const PlatformArchitecture = () => {
  return (
    <section id="platform-architecture" className="py-14 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-mono font-semibold tracking-[0.2em] text-primary uppercase mb-3 block">PLATFORM ARCHITECTURE</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Three-Tier <span className="gradient-text">Agentic Intelligence</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Signal Layer's architecture mirrors how the best organizations think: know what's happening, decide what to do, and act with confidence.
          </p>
        </motion.div>

        <div className="space-y-4 max-w-5xl mx-auto">
          {tiers.map((tier, idx) => (
            <motion.div
              key={tier.num}
              className="rounded-xl bg-card border border-border/50 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <div className="flex">
                <div className="w-1.5 shrink-0" style={{ backgroundColor: tier.accentColor }} />
                <div className="p-6 flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-mono font-bold px-2 py-1 rounded" style={{ color: tier.accentColor, backgroundColor: `${tier.accentColor}15` }}>
                      TIER {tier.num}
                    </span>
                    <h3 className="font-heading text-xl font-bold text-foreground">{tier.title}</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {tier.blocks.map((block) => (
                      <div key={block.title}>
                        <h4 className="font-heading text-sm font-semibold text-foreground mb-2">{block.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{block.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Code Snippet */}
        <motion.div
          className="max-w-3xl mx-auto mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="rounded-xl bg-card border border-border/50 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border/50">
              <div className="w-3 h-3 rounded-full bg-destructive/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
              <span className="text-xs font-mono text-muted-foreground ml-2">orchestrator.ts</span>
            </div>
            <pre className="p-4 overflow-x-auto text-xs font-mono text-muted-foreground leading-relaxed">
              <code>{codeSnippet}</code>
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PlatformArchitecture;
