import { motion } from "framer-motion";
import { useState } from "react";
import { SoloDiagram, CommandDiagram, RouterDiagram } from "./diagrams/ArchitectureDiagrams";

const tabColors = [
  { accent: "hsl(175 80% 45%)", bg: "hsl(175 80% 45% / 0.15)", border: "hsl(175 80% 45% / 0.3)" },
  { accent: "hsl(230 70% 60%)", bg: "hsl(230 70% 60% / 0.15)", border: "hsl(230 70% 60% / 0.3)" },
  { accent: "hsl(270 60% 65%)", bg: "hsl(270 60% 65% / 0.15)", border: "hsl(270 60% 65% / 0.3)" },
];

const patterns = [
  {
    id: "solo",
    title: "The Solo Expert",
    subtitle: "Single Agent",
    description:
      "A single agent runs the full decision cycle: perceive signals, reason with your domain expertise, take action, and learn from outcomes. MCP Servers connect it to your databases, APIs, and documents.",
    practices: [
      "ReAct reasoning loops (Reason → Act → Observe → Repeat)",
      "MCP for standardized tool and data access",
      "Full reasoning trace for auditability",
      "Outcome feedback loops for continuous improvement",
    ],
    recommended: "Signal monitoring, data classification, routine decisions, focused analytical tasks.",
    visual: SoloDiagram,
  },
  {
    id: "command",
    title: "The Command Center",
    subtitle: "Hierarchical Multi-Agent",
    description:
      "Multiple specialized agents coordinated by an orchestrator. Research, Analysis, and Execution agents each handle their domain while human approval gates protect critical decisions.",
    practices: [
      "Graph-based orchestration with state management",
      "MCP Servers for each agent's tool and data access",
      "Cross-validation between agents to catch errors",
      "Human approval gates at configurable thresholds",
    ],
    recommended: "Complex multi-source decisions, high-stakes business choices, tasks combining market + internal + domain data.",
    visual: CommandDiagram,
  },
  {
    id: "router",
    title: "The Smart Router",
    subtitle: "Intent-Based Architecture",
    description:
      "An intelligent routing layer classifies each incoming signal by type, complexity, and risk — then dispatches it to the right pipeline automatically, from fast solo agents to full orchestration with human approval.",
    practices: [
      "Intent classification trained on your domain",
      "Least Agency principle — minimum autonomy per task",
      "Dynamic architecture selection in milliseconds",
      "Unified observability and tracing across routes",
    ],
    recommended: "Production deployments with diverse request types, enterprises running multiple use cases, systems requiring adaptive autonomy.",
    visual: RouterDiagram,
  },
];

const ArchitecturePatterns = () => {
  const [activeTab, setActiveTab] = useState(0);
  const active = patterns[activeTab];
  const colors = tabColors[activeTab];
  const Visual = active.visual;

  return (
    <section id="architecture-patterns" className="py-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />
      <div className="container mx-auto px-6 relative z-10">
        <span className="text-primary font-medium text-sm uppercase tracking-wider mb-6 block text-center">Architecture Patterns</span>

        <div className="flex gap-6 max-w-6xl mx-auto">
          {/* Vertical Tabs */}
          <div className="flex flex-col gap-2 shrink-0 w-44">
            {patterns.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActiveTab(i)}
                className="text-left px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 whitespace-nowrap"
                style={
                  activeTab === i
                    ? { backgroundColor: tabColors[i].bg, color: tabColors[i].accent, border: `1px solid ${tabColors[i].border}` }
                    : { backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border) / 0.5)", color: "hsl(var(--muted-foreground))" }
                }
              >
                {p.title}
              </button>
            ))}
          </div>

          {/* Content */}
          <motion.div
            key={active.id}
            className="flex-1 rounded-xl bg-card p-6"
            style={{ border: `1px solid ${colors.border}`, boxShadow: `0 0 30px ${colors.accent}08` }}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* Diagram */}
              <div className="rounded-lg overflow-hidden bg-background/50 border border-border/30">
                <Visual />
              </div>

              {/* Info */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="text-sm font-mono px-2 py-1 rounded font-bold"
                    style={{ color: colors.accent, backgroundColor: `${colors.accent}15` }}
                  >
                    {active.subtitle}
                  </span>
                  <h3 className="font-heading text-xl font-bold text-foreground">{active.title}</h3>
                </div>
                <p className="text-base text-muted-foreground leading-relaxed mb-4">{active.description}</p>

                <h4 className="font-heading text-base font-semibold text-foreground mb-3">Best Practices</h4>
                <ul className="space-y-2 mb-4">
                  {active.practices.map((u, i) => (
                    <li key={i} className="flex items-start gap-2 text-base text-muted-foreground">
                      <span style={{ color: colors.accent }} className="mt-0.5">✓</span>
                      <span>{u}</span>
                    </li>
                  ))}
                </ul>

                <h4 className="font-heading text-base font-semibold text-foreground mb-2">Recommended For</h4>
                <p className="text-base text-muted-foreground leading-relaxed">{active.recommended}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ArchitecturePatterns;
