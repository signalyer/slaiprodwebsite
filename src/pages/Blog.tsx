import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import CursorGlow from "@/components/CursorGlow";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useState } from "react";

const tabs = [
  { id: "problem", label: "Problem & Architecture" },
  { id: "eval", label: "Eval Strategy" },
  { id: "prompts", label: "Prompt Engineering" },
  { id: "safety", label: "Adversarial & Safety" },
  { id: "models", label: "Cross-Model & Debugger" },
  { id: "summary", label: "Summary" },
];

const metrics = [
  { value: "97%+", label: "Accuracy (3 gates at 100%)", color: "text-emerald-400" },
  { value: "$0.02", label: "Per 5-Gate Decision", color: "text-cyan-400" },
  { value: "50x", label: "Cost Range Found", color: "text-amber-400" },
  { value: "13M", label: "Tokens Processed", color: "text-foreground" },
  { value: "$21", label: "Total Eval Cost", color: "text-emerald-400" },
];

const Badge = ({ type, children }: { type: "pass" | "fail" | "warn"; children: React.ReactNode }) => {
  const cls = type === "pass" ? "bg-emerald-500/15 text-emerald-400" : type === "fail" ? "bg-red-500/15 text-red-400" : "bg-amber-500/15 text-amber-400";
  return <span className={`inline-block text-[0.6rem] font-bold px-2 py-0.5 rounded ${cls}`}>{children}</span>;
};

const Blog = () => {
  const [activeTab, setActiveTab] = useState("problem");

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Agentic Implementation Journey | Signal Layer</title>
        <meta name="description" content="A practitioner's guide to eval-driven development, adversarial testing, and prompt engineering for high-stakes AI agents." />
      </Helmet>
      <CursorGlow />
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">

          {/* Hero */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider mb-4 block">Technical Deep Dive</span>
            <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
              Agentic Implementation Journey:{" "}
              <span className="gradient-text">Building a Multi-Agent Compliance Review System</span>
            </h1>
            <p className="text-muted-foreground text-base max-w-2xl mx-auto">
              A practitioner's guide to eval-driven development, adversarial testing, and prompt engineering for high-stakes AI agents.
            </p>
          </motion.div>

          {/* Metric cards */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {metrics.map((m) => (
              <div key={m.label} className="bg-card border border-border rounded-xl p-4 text-center hover:border-primary/40 transition-colors">
                <div className={`font-heading text-xl font-bold ${m.color}`}>{m.value}</div>
                <div className="text-[0.6rem] text-muted-foreground uppercase tracking-wider mt-1">{m.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Tab bar */}
          <div className="border-b border-border mb-6 overflow-x-auto flex gap-0 max-w-4xl mx-auto">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${
                  activeTab === t.id
                    ? "text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="max-w-4xl mx-auto">

            {/* Problem & Architecture */}
            {activeTab === "problem" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <h2 className="font-heading text-lg font-bold mb-3 pb-2 border-b border-border">The Problem</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  Regulatory compliance review is a sequential decision process. An applicant's submission must pass through five independent checks before approval. Each check queries an external data source, interprets results against complex rules, and produces a reasoned decision.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  The manual process takes 3-5 business days per case. The goal: an AI agent system that matches human analyst decisions in 30 seconds with auditable reasoning. Not replacing the human — producing a recommendation they review in minutes instead of days.
                </p>
                <div className="bg-primary/8 border-l-2 border-primary rounded-r-lg p-4 mb-6 text-sm text-muted-foreground leading-relaxed">
                  Regulated industries have zero tolerance for silent failures. A wrong denial means someone loses access to services. The system must know when it's uncertain and escalate rather than guess.
                </div>

                <h2 className="font-heading text-lg font-bold mb-3 pb-2 border-b border-border">Architecture: Deterministic + Agentic</h2>
                <pre className="bg-card border border-border rounded-lg p-4 text-[0.65rem] text-primary/80 leading-relaxed overflow-x-auto mb-4 font-mono">{`                    APPLICATION SUBMITTED
                             |
                             v
             +-------------------------------+
             |   DETERMINISTIC VALIDATION     |
             |   No AI - pure rules, <2ms     |
             +-------+---------------+-------+
                     |               |
                 Valid               Invalid
                     |               |
                     v               v
             +---------------+   Return for
             | AGENT PIPELINE|   Correction
             +-------+-------+
                     |
 +-------+-------+--+--+-------+-------+
 v       v       v     v       v
Gate 1  Gate 2  Gate 3  Gate 4  Gate 5
Status  Criteria Risk   Location Conflict
 |       |       |       |       |
 +---+---+---+---+---+---+---+---+
     v               v
External Data    DECISION
(Tool Use)       PASS | FAIL | ESCALATE`}</pre>

                <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                  <strong className="text-foreground">Phase 1 (Validation)</strong> — deterministic Python. 160 lines, &lt;2ms, 62 tests. No LLM needed for questions with one right answer.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  <strong className="text-foreground">Phase 2 (Compliance Review)</strong> — five specialist agents:
                </p>

                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-sm border-collapse">
                    <thead><tr className="border-b border-border text-left text-xs text-muted-foreground uppercase tracking-wider">
                      <th className="py-2 px-3">Gate</th><th className="py-2 px-3">Responsibility</th><th className="py-2 px-3">Data Source</th><th className="py-2 px-3">Difficulty</th>
                    </tr></thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b border-border/50"><td className="py-2 px-3 font-semibold text-foreground">Gate 1</td><td className="py-2 px-3">Status verification</td><td className="py-2 px-3">System A</td><td className="py-2 px-3"><Badge type="pass">Standard</Badge></td></tr>
                      <tr className="border-b border-border/50"><td className="py-2 px-3 font-semibold text-foreground">Gate 2</td><td className="py-2 px-3">Criteria qualification</td><td className="py-2 px-3">System B</td><td className="py-2 px-3"><Badge type="pass">Standard</Badge></td></tr>
                      <tr className="border-b border-border/50"><td className="py-2 px-3 font-semibold text-foreground">Gate 3</td><td className="py-2 px-3">Risk assessment scoring</td><td className="py-2 px-3">System B</td><td className="py-2 px-3"><Badge type="fail">Hardest</Badge></td></tr>
                      <tr className="border-b border-border/50"><td className="py-2 px-3 font-semibold text-foreground">Gate 4</td><td className="py-2 px-3">Location compliance</td><td className="py-2 px-3">System C</td><td className="py-2 px-3"><Badge type="pass">Standard</Badge></td></tr>
                      <tr className="border-b border-border/50"><td className="py-2 px-3 font-semibold text-foreground">Gate 5</td><td className="py-2 px-3">Rule conflict detection</td><td className="py-2 px-3">System A</td><td className="py-2 px-3"><Badge type="pass">Standard</Badge></td></tr>
                    </tbody>
                  </table>
                </div>

                <ul className="text-sm text-muted-foreground leading-relaxed space-y-1.5 list-disc pl-5">
                  <li><strong className="text-foreground">Specialist over generalist.</strong> Five focused agents. No attention dilution.</li>
                  <li><strong className="text-foreground">Sequential with early exit.</strong> FAIL &ge; 0.80 confidence skips remaining gates.</li>
                  <li><strong className="text-foreground">Safe defaults.</strong> Any failure → ESCALATE with confidence 0.0. Never auto-deny.</li>
                  <li><strong className="text-foreground">Compliance from day 1.</strong> Immutable audit trail, encryption, access logging.</li>
                </ul>
              </motion.div>
            )}

            {/* Eval Strategy */}
            {activeTab === "eval" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <h2 className="font-heading text-lg font-bold mb-3 pb-2 border-b border-border">Simulation as Answer Key</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Instead of JSON test files, we built a complete deterministic implementation of all five gates in pure Python. Same tools, same data, same decision space. This serves as both the demo engine and the eval answer key.
                </p>
                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-sm border-collapse">
                    <thead><tr className="border-b border-border text-left text-xs text-muted-foreground uppercase tracking-wider">
                      <th className="py-2 px-3"></th><th className="py-2 px-3">JSON Test Files</th><th className="py-2 px-3">Deterministic Simulation</th>
                    </tr></thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b border-border/50"><td className="py-2 px-3 text-foreground">New scenarios</td><td className="py-2 px-3">Must add manually</td><td className="py-2 px-3">Handles any input automatically</td></tr>
                      <tr className="border-b border-border/50"><td className="py-2 px-3 text-foreground">Edge cases</td><td className="py-2 px-3">Only cases you wrote</td><td className="py-2 px-3">Catches rule interaction bugs</td></tr>
                      <tr className="border-b border-border/50"><td className="py-2 px-3 text-foreground">Powers demo</td><td className="py-2 px-3">No</td><td className="py-2 px-3">Yes</td></tr>
                      <tr className="border-b border-border/50"><td className="py-2 px-3 text-foreground">Stays in sync</td><td className="py-2 px-3">Can drift</td><td className="py-2 px-3">IS the rules</td></tr>
                    </tbody>
                  </table>
                </div>

                <h2 className="font-heading text-lg font-bold mb-3 pb-2 border-b border-border">16 Eval Types, 219 Scenarios</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {[{ v: "16", l: "Eval Types" }, { v: "219", l: "Scenarios" }, { v: "173", l: "Runs Completed" }, { v: "6,500+", l: "Test Cases" }].map((m) => (
                    <div key={m.l} className="bg-card border border-border rounded-xl p-4 text-center">
                      <div className="font-heading text-xl font-bold text-cyan-400">{m.v}</div>
                      <div className="text-[0.6rem] text-muted-foreground uppercase tracking-wider mt-1">{m.l}</div>
                    </div>
                  ))}
                </div>
                <pre className="bg-card border border-border rounded-lg p-4 text-[0.65rem] text-primary/80 leading-relaxed overflow-x-auto font-mono">{`  EVAL COVERAGE MATRIX
  =====================================================================
  ACCURACY             SAFETY              REGRESSION
  - Single gate (30)   - Prompt injection   - Golden cases (30)
  - All gates (150)    - Boundary values    - Consistency (5x repeat)
  - Full pipeline (12) - Missing data
                        - Contradictory

  MODEL & COST         REASONING QUALITY
  - Cross-model (5)    - Hallucination detection
  - Latency tracking   - Faithfulness analysis
  - Cost per gate      - Sensitive data leakage`}</pre>
              </motion.div>
            )}

            {/* Prompt Engineering */}
            {activeTab === "prompts" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <h2 className="font-heading text-lg font-bold mb-3 pb-2 border-b border-border">The Journey: 70% → 97%+</h2>
                <div className="space-y-3 mb-4">
                  {[
                    { ver: "v1", color: "bg-red-500", title: "Baseline: 70-90% by gate", desc: "First prompts. Gate 3 at 70% — agent does arithmetic wrong." },
                    { ver: "v2", color: "bg-amber-500", title: "Pre-computation: 87-97%", desc: "Moved arithmetic into Python. +27 points on hardest gate." },
                    { ver: "v3", color: "bg-emerald-500", title: "Decision tables: 97-100%", desc: "Replaced prose with structured grids. Eliminated remaining mismatches." },
                    { ver: "v5", color: "bg-primary", title: "Final: 97%+ overall (3 gates at 100%)", desc: "Confidence calibration, scope containment, edge cases." },
                  ].map((s) => (
                    <div key={s.ver} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${s.color} flex items-center justify-center text-xs font-bold text-background shrink-0`}>{s.ver}</div>
                      <div><div className="text-sm font-semibold text-foreground">{s.title}</div><div className="text-xs text-muted-foreground">{s.desc}</div></div>
                    </div>
                  ))}
                </div>

                <div className="bg-emerald-500/8 border-l-2 border-emerald-500 rounded-r-lg p-4 mb-6 text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">The 27-Point Pattern:</strong> Stop asking AI to do math. Pre-compute dates, ages, thresholds. Pass results as labels. This single change outweighed all other improvements combined.
                </div>

                <h2 className="font-heading text-lg font-bold mb-3 pb-2 border-b border-border">Token Savings from Prompt Format (Gate 3)</h2>
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-sm border-collapse">
                    <thead><tr className="border-b border-border text-left text-xs text-muted-foreground uppercase tracking-wider">
                      <th className="py-2 px-3">Format</th><th className="py-2 px-3">Accuracy</th><th className="py-2 px-3">Avg Tokens</th><th className="py-2 px-3">vs Baseline</th>
                    </tr></thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b border-border/50"><td className="py-2 px-3">Bullets (v1)</td><td className="py-2 px-3">90%</td><td className="py-2 px-3">3,284</td><td className="py-2 px-3">baseline</td></tr>
                      <tr className="border-b border-border/50"><td className="py-2 px-3">Prose</td><td className="py-2 px-3">93%</td><td className="py-2 px-3">2,799</td><td className="py-2 px-3">-15%</td></tr>
                      <tr className="border-b border-border/50"><td className="py-2 px-3 font-semibold text-foreground">Table</td><td className="py-2 px-3 font-semibold text-emerald-400">100%</td><td className="py-2 px-3">2,375</td><td className="py-2 px-3 font-semibold text-emerald-400">-28%</td></tr>
                      <tr className="border-b border-border/50"><td className="py-2 px-3">Minimal table</td><td className="py-2 px-3">97%</td><td className="py-2 px-3">2,264</td><td className="py-2 px-3">-31%</td></tr>
                      <tr className="border-b border-border/50"><td className="py-2 px-3 font-semibold text-foreground">Pre-computed</td><td className="py-2 px-3 font-semibold text-emerald-400">100%</td><td className="py-2 px-3">1,668</td><td className="py-2 px-3 font-semibold text-emerald-400">-49%</td></tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-primary/8 border-l-2 border-primary rounded-r-lg p-4 mb-6 text-sm text-muted-foreground leading-relaxed">
                  The best prompt is shorter AND more accurate. Verbosity ≠ quality. Structure beats volume.
                </div>

                <h2 className="font-heading text-lg font-bold mb-3 pb-2 border-b border-border">5 Reusable Patterns</h2>
                <ol className="text-sm text-muted-foreground leading-relaxed space-y-1.5 list-decimal pl-5 mb-6">
                  <li><strong className="text-foreground">Pre-compute deterministic values.</strong> Never ask an LLM to calculate.</li>
                  <li><strong className="text-foreground">Decision tables over prose.</strong> Grids eliminate branching ambiguity.</li>
                  <li><strong className="text-foreground">Explicit scope boundaries.</strong> Tell the agent what NOT to do.</li>
                  <li><strong className="text-foreground">Escalation bias direction.</strong> "When in doubt, ESCALATE rather than FAIL."</li>
                  <li><strong className="text-foreground">Confidence guidelines with numeric ranges.</strong> Makes confidence actionable.</li>
                </ol>

                <h2 className="font-heading text-lg font-bold mb-3 pb-2 border-b border-border">Token Economics</h2>
                <p className="text-xs text-muted-foreground mb-2">Token breakdown across 13M total</p>
                <div className="flex h-6 rounded-lg overflow-hidden border border-border mb-2">
                  <div className="bg-primary flex items-center justify-center text-[0.6rem] font-bold text-background" style={{ width: "93%" }}>93% Input (prompts + tool data)</div>
                  <div className="bg-accent flex items-center justify-center text-[0.6rem] font-bold text-background" style={{ width: "7%" }}>7%</div>
                </div>
                <p className="text-xs text-muted-foreground">Prompt optimization targets the 93%. Compressing instructions saves far more than shortening reasoning.</p>
              </motion.div>
            )}

            {/* Adversarial & Safety */}
            {activeTab === "safety" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <h2 className="font-heading text-lg font-bold mb-3 pb-2 border-b border-border">Adversarial Testing</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Agentic AI faces a specific threat: <strong className="text-foreground">indirect prompt injection via tool responses</strong>. The agent reads data from external systems via tool calls. That data is the attack surface.
                </p>
                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-sm border-collapse">
                    <thead><tr className="border-b border-border text-left text-xs text-muted-foreground uppercase tracking-wider">
                      <th className="py-2 px-3">Attack Category</th><th className="py-2 px-3">Risk</th><th className="py-2 px-3">Tests</th><th className="py-2 px-3">Status</th>
                    </tr></thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b border-border/50"><td className="py-2 px-3 text-foreground font-semibold">Prompt Injection</td><td className="py-2 px-3"><Badge type="fail">Critical</Badge></td><td className="py-2 px-3">10</td><td className="py-2 px-3"><Badge type="pass">Defended</Badge></td></tr>
                      <tr className="border-b border-border/50"><td className="py-2 px-3 text-foreground font-semibold">Boundary Values</td><td className="py-2 px-3"><Badge type="warn">High</Badge></td><td className="py-2 px-3">12</td><td className="py-2 px-3"><Badge type="warn">9/12</Badge></td></tr>
                      <tr className="border-b border-border/50"><td className="py-2 px-3 text-foreground font-semibold">Missing Data</td><td className="py-2 px-3"><Badge type="warn">Medium</Badge></td><td className="py-2 px-3">5</td><td className="py-2 px-3"><Badge type="warn">4/5</Badge></td></tr>
                      <tr className="border-b border-border/50"><td className="py-2 px-3 text-foreground font-semibold">Contradictory Data</td><td className="py-2 px-3"><Badge type="warn">Medium</Badge></td><td className="py-2 px-3">4</td><td className="py-2 px-3"><Badge type="warn">3/4</Badge></td></tr>
                    </tbody>
                  </table>
                </div>

                <h2 className="font-heading text-lg font-bold mb-3 pb-2 border-b border-border">Reasoning Quality Analysis</h2>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-card border border-border rounded-xl p-4 text-center">
                    <div className="font-heading text-xl font-bold text-amber-400">6</div>
                    <div className="text-[0.6rem] text-muted-foreground uppercase tracking-wider mt-1">Hallucinations Flagged</div>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-4 text-center">
                    <div className="font-heading text-xl font-bold text-emerald-400">90%</div>
                    <div className="text-[0.6rem] text-muted-foreground uppercase tracking-wider mt-1">Faithfulness Rate</div>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-4 text-center">
                    <div className="font-heading text-xl font-bold text-red-400">24</div>
                    <div className="text-[0.6rem] text-muted-foreground uppercase tracking-wider mt-1">Data Leakage Flagged</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">Beyond decisions, we scan reasoning for fabricated values, logic inconsistencies, and sensitive data in logged output.</p>
              </motion.div>
            )}

            {/* Cross-Model & Debugger */}
            {activeTab === "models" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <h2 className="font-heading text-lg font-bold mb-3 pb-2 border-b border-border">Cross-Model Comparison</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">Same prompts. Same tools. Same 219 scenarios. Different model. Different price.</p>
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-sm border-collapse">
                    <thead><tr className="border-b border-border text-left text-xs text-muted-foreground uppercase tracking-wider">
                      <th className="py-2 px-3">Model Tier</th><th className="py-2 px-3">Accuracy</th><th className="py-2 px-3">Cost/Case</th><th className="py-2 px-3">Relative</th><th className="py-2 px-3">Tokens</th>
                    </tr></thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b border-border/50"><td className="py-2 px-3">Premium (Tier 3)</td><td className="py-2 px-3">89%</td><td className="py-2 px-3">$0.00800</td><td className="py-2 px-3">50x</td><td className="py-2 px-3">2,199</td></tr>
                      <tr className="border-b border-border/50"><td className="py-2 px-3 font-semibold text-foreground">Mid-tier (Tier 2)</td><td className="py-2 px-3 font-semibold text-emerald-400">97%</td><td className="py-2 px-3">$0.00249</td><td className="py-2 px-3">16x</td><td className="py-2 px-3">2,547</td></tr>
                      <tr className="border-b border-border/50"><td className="py-2 px-3">Budget (Tier 1)</td><td className="py-2 px-3">59%</td><td className="py-2 px-3 font-semibold text-emerald-400">$0.00016</td><td className="py-2 px-3 font-semibold text-emerald-400">1x</td><td className="py-2 px-3">967</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="bg-emerald-500/8 border-l-2 border-emerald-500 rounded-r-lg p-4 mb-6 text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Key finding:</strong> Mid-tier model achieved highest accuracy (97%) at 3x less than premium. The mid-tier sweet spot delivers best accuracy-to-cost ratio.
                </div>

                <h2 className="font-heading text-lg font-bold mb-3 pb-2 border-b border-border">Model Behavior Debugger</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">AI providers update models without notice. The debugger detects behavioral changes before they reach users.</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {[{ v: "Snapshot", l: "Baseline behavior" }, { v: "Diff", l: "Compare versions" }, { v: "Regression", l: "One-command PASS/FAIL" }, { v: "Safety", l: "Cross-provider score" }].map((m) => (
                    <div key={m.l} className="bg-card border border-border rounded-xl p-4 text-center">
                      <div className="font-heading text-base font-bold text-foreground">{m.v}</div>
                      <div className="text-[0.6rem] text-muted-foreground uppercase tracking-wider mt-1">{m.l}</div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">Safety comparison runs the full suite across models, producing a composite score: gate accuracy (40%), adversarial robustness (40%), regression stability (20%).</p>

                <h2 className="font-heading text-lg font-bold mb-3 pb-2 border-b border-border">Infrastructure</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                  <strong className="text-foreground">DB as single source of truth.</strong> Eliminated all file I/O. 125 blob files = 15-25s. DB query = &lt;50ms. Full JSON in <code className="bg-secondary px-1.5 py-0.5 rounded text-xs text-primary">run_data</code> column.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Cloud deployment.</strong> App service (4 workers), static web app CDN, key vault. Four live dashboards backed by database queries.
                </p>
              </motion.div>
            )}

            {/* Summary */}
            {activeTab === "summary" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-sm border-collapse">
                    <thead><tr className="border-b border-border text-left text-xs text-muted-foreground uppercase tracking-wider">
                      <th className="py-2 px-3">Metric</th><th className="py-2 px-3">Value</th>
                    </tr></thead>
                    <tbody className="text-muted-foreground">
                      {[
                        ["Eval types", "16"], ["Test scenarios", "219"], ["Total eval runs", "173"],
                        ["Individual test cases", "6,500+"], ["API endpoints", "77"], ["Prompt versions", "5 per gate (25 total)"],
                        ["Final accuracy", "97%+ overall (3 gates at 100%, Gate 1 at 98%, Gate 2 at 87%)"],
                        ["Cost per 5-gate decision", "~$0.02"], ["Total eval cost", "~$21"],
                        ["Models tested", "5 (2 providers)"], ["Safety issues found", "12 fixed, 4 open, 5 pending"],
                      ].map(([k, v]) => (
                        <tr key={k} className="border-b border-border/50"><td className="py-2 px-3 text-foreground">{k}</td><td className="py-2 px-3 font-semibold">{v}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-card border border-border rounded-xl p-6 text-center">
                  <h3 className="font-heading text-lg font-bold gradient-text mb-2">The agent is 10% of the work. The eval infrastructure is 90%.</h3>
                  <p className="text-sm text-muted-foreground">That ratio is correct for regulated industries — and probably correct for any high-stakes AI system.</p>
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Blog;
