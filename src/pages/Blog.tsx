import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import CursorGlow from "@/components/CursorGlow";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowDown, Shield, Zap, Eye, GitCompare, BarChart3 } from "lucide-react";

const tabs = [
  { id: "problem", label: "Problem & Architecture" },
  { id: "eval", label: "Eval Strategy" },
  { id: "prompts", label: "Prompt Engineering" },
  { id: "safety", label: "Adversarial & Safety" },
  { id: "models", label: "Models & Debugger" },
  { id: "summary", label: "Summary" },
];

const metrics = [
  { value: "97%+", label: "Accuracy", sub: "3 gates at 100%", color: "text-emerald-400" },
  { value: "$0.02", label: "Per Decision", sub: "5-gate pipeline", color: "text-cyan-400" },
  { value: "50x", label: "Cost Range", sub: "across model tiers", color: "text-amber-400" },
  { value: "13M", label: "Tokens", sub: "processed", color: "text-foreground" },
  { value: "$21", label: "Eval Cost", sub: "total spend", color: "text-emerald-400" },
];

const B = ({ type, children }: { type: "pass" | "fail" | "warn"; children: React.ReactNode }) => {
  const c = type === "pass" ? "bg-emerald-500/15 text-emerald-400" : type === "fail" ? "bg-red-500/15 text-red-400" : "bg-amber-500/15 text-amber-400";
  return <span className={`inline-block text-[0.62rem] font-bold px-2 py-0.5 rounded ${c}`}>{children}</span>;
};

const Callout = ({ children, color = "primary" }: { children: React.ReactNode; color?: string }) => (
  <div className={`bg-${color}/[0.06] border-l-2 border-${color} rounded-r-lg p-3 my-3 text-[0.82rem] text-muted-foreground leading-relaxed`}>
    {children}
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <>
    <h2 className="font-heading text-lg font-bold mt-5 mb-3 pb-1.5 border-b border-border">{title}</h2>
    {children}
  </>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[0.84rem] text-muted-foreground leading-[1.7] mb-3">{children}</p>
);

/* ── Architecture Diagram (styled JSX, not ASCII) ── */
const ArchDiagram = () => {
  const gateStyle = "bg-card border border-border rounded-lg px-3 py-2 text-center";
  return (
    <div className="bg-card/50 border border-border rounded-xl p-4 my-3">
      {/* Submission */}
      <div className="flex flex-col items-center gap-1.5 mb-3">
        <div className="bg-primary/15 border border-primary/30 rounded-lg px-4 py-2 text-sm font-semibold text-primary">Application Submitted</div>
        <ArrowDown className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
      {/* Validation */}
      <div className="flex flex-col items-center gap-1.5 mb-3">
        <div className="bg-secondary border border-border rounded-lg px-4 py-2 text-center max-w-xs">
          <div className="text-sm font-semibold text-foreground">Deterministic Validation</div>
          <div className="text-xs text-muted-foreground">No AI &middot; Pure rules &middot; &lt;2ms</div>
        </div>
        <div className="flex gap-10 text-xs text-muted-foreground">
          <div className="flex flex-col items-center gap-0.5"><ArrowDown className="w-3 h-3" /><span className="text-emerald-400 font-semibold">Valid</span></div>
          <div className="flex flex-col items-center gap-0.5"><ArrowDown className="w-3 h-3" /><span className="text-red-400 font-semibold">Invalid → Correction</span></div>
        </div>
      </div>
      {/* 5 Gates */}
      <div className="flex flex-col items-center gap-1.5 mb-3">
        <div className="text-[0.65rem] text-muted-foreground font-medium uppercase tracking-wider">5 Specialist Agents (sequential, early exit)</div>
        <div className="grid grid-cols-5 gap-1.5 w-full max-w-lg">
          {[
            { n: "1", label: "Status", color: "border-primary/40" },
            { n: "2", label: "Criteria", color: "border-primary/40" },
            { n: "3", label: "Risk", color: "border-amber-500/40" },
            { n: "4", label: "Location", color: "border-primary/40" },
            { n: "5", label: "Conflict", color: "border-primary/40" },
          ].map((g) => (
            <div key={g.n} className={`${gateStyle} ${g.color}`}>
              <div className="text-xs font-bold text-foreground">G{g.n}</div>
              <div className="text-[0.6rem] text-muted-foreground">{g.label}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
          <span>↕</span><span>External Data via Tool Use</span>
        </div>
      </div>
      {/* Decision */}
      <div className="flex justify-center gap-3 mt-2">
        <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-lg px-4 py-2 text-xs font-bold text-emerald-400">PASS</div>
        <div className="bg-red-500/15 border border-red-500/30 rounded-lg px-4 py-2 text-xs font-bold text-red-400">FAIL</div>
        <div className="bg-amber-500/15 border border-amber-500/30 rounded-lg px-4 py-2 text-xs font-bold text-amber-400">ESCALATE → Human</div>
      </div>
    </div>
  );
};

/* ── Eval Coverage Grid (styled JSX, not ASCII) ── */
const EvalGrid = () => {
  const cats = [
    { icon: Zap, title: "Accuracy", color: "text-cyan-400 border-cyan-400/30", items: ["Single gate (30)", "All gates (150)", "Full pipeline (12)"] },
    { icon: Shield, title: "Safety", color: "text-red-400 border-red-400/30", items: ["Prompt injection", "Boundary values", "Missing data", "Contradictory"] },
    { icon: GitCompare, title: "Regression", color: "text-amber-400 border-amber-400/30", items: ["Golden cases (30)", "Consistency (5x)"] },
    { icon: BarChart3, title: "Model & Cost", color: "text-emerald-400 border-emerald-400/30", items: ["Cross-model (5)", "Latency tracking", "Cost per gate"] },
    { icon: Eye, title: "Reasoning", color: "text-purple-400 border-purple-400/30", items: ["Hallucination", "Faithfulness", "Data leakage"] },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 my-5">
      {cats.map((c) => (
        <div key={c.title} className={`bg-card border rounded-xl p-4 ${c.color.split(" ")[1]}`}>
          <c.icon className={`w-4 h-4 mb-2 ${c.color.split(" ")[0]}`} />
          <div className={`text-xs font-bold mb-2 ${c.color.split(" ")[0]}`}>{c.title}</div>
          <ul className="text-[0.68rem] text-muted-foreground space-y-1">
            {c.items.map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
};

const Blog = () => {
  const [activeTab, setActiveTab] = useState("problem");

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Agentic Implementation Journey | Signal Layer</title>
        <meta name="description" content="A practitioner's guide to eval-driven dev, adversarial testing and prompt engineering for high-stakes AI agents." />
      </Helmet>
      <CursorGlow />
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-6">

          {/* Hero */}
          <motion.div className="text-center mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="text-primary font-medium text-sm uppercase tracking-wider mb-2 block">Technical Deep Dive</span>
            <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold mb-3 leading-tight max-w-3xl mx-auto">
              <span className="gradient-text">Building a Multi-Agent Compliance System</span>
            </h1>
            <p className="text-muted-foreground text-base max-w-2xl mx-auto leading-relaxed">
              A practitioner's guide to eval-driven dev, adversarial testing and prompt engineering for high-stakes AI agents.
            </p>
          </motion.div>

          {/* Metrics */}
          <motion.div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-4 max-w-4xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
            {metrics.map((m) => (
              <div key={m.label} className="bg-card border border-border rounded-xl p-3 text-center hover:border-primary/40 transition-colors">
                <div className={`font-heading text-xl font-bold ${m.color}`}>{m.value}</div>
                <div className="text-[0.65rem] text-muted-foreground mt-0.5 font-medium">{m.label}</div>
                <div className="text-[0.55rem] text-muted-foreground/60">{m.sub}</div>
              </div>
            ))}
          </motion.div>

          {/* Tabs */}
          <div className="border-b border-border mb-5 flex flex-wrap max-w-4xl mx-auto">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`px-3 md:px-4 py-3 text-xs md:text-sm font-medium border-b-2 transition-all -mb-px ${
                  activeTab === t.id ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-foreground"
                }`}>{t.label}</button>
            ))}
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto">

            {activeTab === "problem" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <Section title="The Problem">
                  <P>Regulatory compliance review is a sequential decision process. An applicant's submission must pass through five independent checks before approval. Each check queries an external data source, interprets results against complex rules, and produces a reasoned decision.</P>
                  <P>The manual process takes 3-5 business days per case. The goal: an AI agent system that matches human analyst decisions in <strong className="text-foreground">30 seconds</strong> with auditable reasoning. Not replacing the human — producing a recommendation they review in minutes instead of days.</P>
                  <Callout>Regulated industries have zero tolerance for silent failures. A wrong denial means someone loses access to services. The system must know when it's uncertain and escalate rather than guess.</Callout>
                </Section>

                <Section title="Architecture: Deterministic + Agentic">
                  <ArchDiagram />
                  <P><strong className="text-foreground">Phase 1 (Validation)</strong> — deterministic Python. 160 lines, &lt;2ms, 62 tests. No LLM needed for questions with one right answer.</P>
                  <P><strong className="text-foreground">Phase 2 (Compliance Review)</strong> — five specialist agents:</P>
                  <div className="overflow-x-auto mb-5">
                    <table className="w-full text-sm border-collapse">
                      <thead><tr className="border-b border-border text-left text-xs text-muted-foreground uppercase tracking-wider">
                        <th className="py-2.5 px-3">Gate</th><th className="py-2.5 px-3">Responsibility</th><th className="py-2.5 px-3">Data Source</th><th className="py-2.5 px-3">Difficulty</th>
                      </tr></thead>
                      <tbody className="text-muted-foreground">
                        {[["1","Status verification","System A","pass","Standard"],["2","Criteria qualification","System B","pass","Standard"],["3","Risk assessment scoring","System B","fail","Hardest"],["4","Location compliance","System C","pass","Standard"],["5","Rule conflict detection","System A","pass","Standard"]].map(([n,r,d,t,l])=>(
                          <tr key={n} className="border-b border-border/50"><td className="py-2.5 px-3 font-semibold text-foreground">Gate {n}</td><td className="py-2.5 px-3">{r}</td><td className="py-2.5 px-3">{d}</td><td className="py-2.5 px-3"><B type={t as "pass"|"fail"}>{l}</B></td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <ul className="text-[0.84rem] text-muted-foreground leading-[1.8] space-y-1 list-disc pl-5">
                    <li><strong className="text-foreground">Specialist over generalist.</strong> Five focused agents. No attention dilution.</li>
                    <li><strong className="text-foreground">Sequential with early exit.</strong> FAIL ≥ 0.80 confidence skips remaining gates.</li>
                    <li><strong className="text-foreground">Safe defaults.</strong> Any failure → ESCALATE with confidence 0.0. Never auto-deny.</li>
                    <li><strong className="text-foreground">Compliance from day 1.</strong> Immutable audit trail, encryption, access logging.</li>
                  </ul>
                </Section>
              </motion.div>
            )}

            {activeTab === "eval" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <Section title="Simulation as Answer Key">
                  <P>Instead of JSON test files, we built a complete deterministic implementation of all five gates in pure Python. Same tools, same data, same decision space. This serves as both the demo engine and the eval answer key.</P>
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm border-collapse">
                      <thead><tr className="border-b border-border text-left text-xs text-muted-foreground uppercase tracking-wider">
                        <th className="py-2.5 px-3"></th><th className="py-2.5 px-3">JSON Test Files</th><th className="py-2.5 px-3">Deterministic Simulation</th>
                      </tr></thead>
                      <tbody className="text-muted-foreground">
                        {[["New scenarios","Must add manually","Handles any input automatically"],["Edge cases","Only cases you wrote","Catches rule interaction bugs"],["Powers demo","No","Yes"],["Stays in sync","Can drift","IS the rules"]].map(([k,a,b])=>(
                          <tr key={k} className="border-b border-border/50"><td className="py-2.5 px-3 text-foreground font-medium">{k}</td><td className="py-2.5 px-3">{a}</td><td className="py-2.5 px-3 text-emerald-400">{b}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Section>

                <Section title="16 Eval Types, 219 Scenarios">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                    {[{v:"16",l:"Eval Types"},{v:"219",l:"Scenarios"},{v:"173",l:"Runs Completed"},{v:"6,500+",l:"Test Cases"}].map((m)=>(
                      <div key={m.l} className="bg-card border border-border rounded-xl p-4 text-center">
                        <div className="font-heading text-xl font-bold text-cyan-400">{m.v}</div>
                        <div className="text-[0.62rem] text-muted-foreground uppercase tracking-wider mt-1">{m.l}</div>
                      </div>
                    ))}
                  </div>
                  <EvalGrid />
                </Section>
              </motion.div>
            )}

            {activeTab === "prompts" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <Section title="The Journey: 70% → 97%+">
                  <div className="space-y-3 mb-3">
                    {[
                      {ver:"v1",color:"bg-red-500",title:"Baseline: 70-90% by gate",desc:"First prompts. Gate 3 at 70% — agent does arithmetic wrong."},
                      {ver:"v2",color:"bg-amber-500",title:"Pre-computation: 87-97%",desc:"Moved arithmetic into Python. +27 points on hardest gate."},
                      {ver:"v3",color:"bg-emerald-500",title:"Decision tables: 97-100%",desc:"Replaced prose with structured grids. Eliminated remaining mismatches."},
                      {ver:"v5",color:"bg-primary",title:"Final: 97%+ overall (3 gates at 100%)",desc:"Confidence calibration, scope containment, edge cases."},
                    ].map((s)=>(
                      <div key={s.ver} className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-full ${s.color} flex items-center justify-center text-xs font-bold text-background shrink-0 mt-0.5`}>{s.ver}</div>
                        <div><div className="text-sm font-semibold text-foreground leading-snug">{s.title}</div><div className="text-[0.82rem] text-muted-foreground mt-1">{s.desc}</div></div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-emerald-500/[0.06] border-l-2 border-emerald-500 rounded-r-lg p-4 my-5 text-[0.82rem] text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">The 27-Point Pattern:</strong> Stop asking AI to do math. Pre-compute dates, ages, thresholds. Pass results as labels. This single change outweighed all other improvements combined.
                  </div>
                </Section>

                <Section title="Token Savings from Prompt Format (Gate 3)">
                  <div className="overflow-x-auto mb-5">
                    <table className="w-full text-sm border-collapse">
                      <thead><tr className="border-b border-border text-left text-xs text-muted-foreground uppercase tracking-wider">
                        <th className="py-2.5 px-3">Format</th><th className="py-2.5 px-3">Accuracy</th><th className="py-2.5 px-3">Avg Tokens</th><th className="py-2.5 px-3">vs Baseline</th>
                      </tr></thead>
                      <tbody className="text-muted-foreground">
                        {[["Bullets (v1)","90%","3,284","baseline",false],["Prose","93%","2,799","-15%",false],["Table","100%","2,375","-28%",true],["Minimal table","97%","2,264","-31%",false],["Pre-computed","100%","1,668","-49%",true]].map(([f,a,t,d,h])=>(
                          <tr key={f as string} className="border-b border-border/50">
                            <td className={`py-2.5 px-3 ${h ? "font-semibold text-foreground" : ""}`}>{f}</td>
                            <td className={`py-2.5 px-3 ${h ? "font-semibold text-emerald-400" : ""}`}>{a}</td>
                            <td className="py-2.5 px-3">{t}</td>
                            <td className={`py-2.5 px-3 ${h ? "font-semibold text-emerald-400" : ""}`}>{d}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Callout>The best prompt is shorter AND more accurate. Verbosity ≠ quality. Structure beats volume.</Callout>
                </Section>

                <Section title="5 Reusable Patterns">
                  <ol className="text-[0.84rem] text-muted-foreground leading-[1.8] space-y-1 list-decimal pl-5 mb-4">
                    <li><strong className="text-foreground">Pre-compute deterministic values.</strong> Never ask an LLM to calculate.</li>
                    <li><strong className="text-foreground">Decision tables over prose.</strong> Grids eliminate branching ambiguity.</li>
                    <li><strong className="text-foreground">Explicit scope boundaries.</strong> Tell the agent what NOT to do.</li>
                    <li><strong className="text-foreground">Escalation bias direction.</strong> "When in doubt, ESCALATE rather than FAIL."</li>
                    <li><strong className="text-foreground">Confidence guidelines with numeric ranges.</strong> Makes confidence actionable.</li>
                  </ol>
                </Section>

                <Section title="Token Economics">
                  <p className="text-xs text-muted-foreground mb-3">Token breakdown across 13M total</p>
                  <div className="flex h-7 rounded-lg overflow-hidden border border-border mb-3">
                    <div className="bg-primary flex items-center justify-center text-[0.62rem] font-bold text-background" style={{width:"93%"}}>93% Input (prompts + tool data)</div>
                    <div className="bg-accent flex items-center justify-center text-[0.62rem] font-bold text-background" style={{width:"7%"}}>7%</div>
                  </div>
                  <P>Prompt optimization targets the 93%. Compressing instructions saves far more than shortening reasoning.</P>
                </Section>
              </motion.div>
            )}

            {activeTab === "safety" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <Section title="Adversarial Testing">
                  <P>Agentic AI faces a specific threat: <strong className="text-foreground">indirect prompt injection via tool responses</strong>. The agent reads data from external systems via tool calls. That data is the attack surface.</P>
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm border-collapse">
                      <thead><tr className="border-b border-border text-left text-xs text-muted-foreground uppercase tracking-wider">
                        <th className="py-2.5 px-3">Attack Category</th><th className="py-2.5 px-3">Risk</th><th className="py-2.5 px-3">Tests</th><th className="py-2.5 px-3">Status</th>
                      </tr></thead>
                      <tbody className="text-muted-foreground">
                        {[["Prompt Injection","fail","Critical","10","pass","Defended"],["Boundary Values","warn","High","12","warn","9/12"],["Missing Data","warn","Medium","5","warn","4/5"],["Contradictory Data","warn","Medium","4","warn","3/4"]].map(([n,rt,rl,t,st,sl])=>(
                          <tr key={n} className="border-b border-border/50"><td className="py-2.5 px-3 text-foreground font-semibold">{n}</td><td className="py-2.5 px-3"><B type={rt as "pass"|"fail"|"warn"}>{rl}</B></td><td className="py-2.5 px-3">{t}</td><td className="py-2.5 px-3"><B type={st as "pass"|"fail"|"warn"}>{sl}</B></td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Section>

                <Section title="Reasoning Quality Analysis">
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[{v:"6",l:"Hallucinations Flagged",c:"text-amber-400"},{v:"90%",l:"Faithfulness Rate",c:"text-emerald-400"},{v:"24",l:"Data Leakage Flagged",c:"text-red-400"}].map((m)=>(
                      <div key={m.l} className="bg-card border border-border rounded-xl p-4 text-center">
                        <div className={`font-heading text-2xl font-bold ${m.c}`}>{m.v}</div>
                        <div className="text-[0.62rem] text-muted-foreground uppercase tracking-wider mt-1.5">{m.l}</div>
                      </div>
                    ))}
                  </div>
                  <P>Beyond decisions, we scan reasoning for fabricated values, logic inconsistencies, and sensitive data in logged output.</P>
                </Section>
              </motion.div>
            )}

            {activeTab === "models" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <Section title="Cross-Model Comparison">
                  <P>Same prompts. Same tools. Same 219 scenarios. Different model. Different price.</P>
                  <div className="overflow-x-auto mb-5">
                    <table className="w-full text-sm border-collapse">
                      <thead><tr className="border-b border-border text-left text-xs text-muted-foreground uppercase tracking-wider">
                        <th className="py-2.5 px-3">Model Tier</th><th className="py-2.5 px-3">Accuracy</th><th className="py-2.5 px-3">Cost/Case</th><th className="py-2.5 px-3">Relative</th><th className="py-2.5 px-3">Tokens</th>
                      </tr></thead>
                      <tbody className="text-muted-foreground">
                        <tr className="border-b border-border/50"><td className="py-2.5 px-3">Premium (Tier 3)</td><td className="py-2.5 px-3">89%</td><td className="py-2.5 px-3">$0.00800</td><td className="py-2.5 px-3">50x</td><td className="py-2.5 px-3">2,199</td></tr>
                        <tr className="border-b border-border/50 bg-emerald-500/[0.04]"><td className="py-2.5 px-3 font-semibold text-foreground">Mid-tier (Tier 2)</td><td className="py-2.5 px-3 font-semibold text-emerald-400">97%</td><td className="py-2.5 px-3">$0.00249</td><td className="py-2.5 px-3">16x</td><td className="py-2.5 px-3">2,547</td></tr>
                        <tr className="border-b border-border/50"><td className="py-2.5 px-3">Budget (Tier 1)</td><td className="py-2.5 px-3">59%</td><td className="py-2.5 px-3 font-semibold text-emerald-400">$0.00016</td><td className="py-2.5 px-3 font-semibold text-emerald-400">1x</td><td className="py-2.5 px-3">967</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-emerald-500/[0.06] border-l-2 border-emerald-500 rounded-r-lg p-4 my-5 text-[0.82rem] text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Key finding:</strong> Mid-tier model achieved highest accuracy (97%) at 3x less than premium. The mid-tier sweet spot delivers best accuracy-to-cost ratio.
                  </div>
                </Section>

                <Section title="Model Behavior Debugger">
                  <P>AI providers update models without notice. The debugger detects behavioral changes before they reach users.</P>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                    {[{v:"Snapshot",l:"Baseline behavior"},{v:"Diff",l:"Compare versions"},{v:"Regression",l:"One-command PASS/FAIL"},{v:"Safety",l:"Cross-provider score"}].map((m)=>(
                      <div key={m.l} className="bg-card border border-border rounded-xl p-4 text-center">
                        <div className="font-heading text-sm font-bold text-foreground">{m.v}</div>
                        <div className="text-[0.6rem] text-muted-foreground uppercase tracking-wider mt-1">{m.l}</div>
                      </div>
                    ))}
                  </div>
                  <P>Safety comparison runs the full suite across models, producing a composite score: gate accuracy (40%), adversarial robustness (40%), regression stability (20%).</P>
                </Section>

              </motion.div>
            )}

            {activeTab === "summary" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <div className="overflow-x-auto mb-5">
                  <table className="w-full text-sm border-collapse">
                    <thead><tr className="border-b border-border text-left text-xs text-muted-foreground uppercase tracking-wider">
                      <th className="py-2.5 px-3">Metric</th><th className="py-2.5 px-3">Value</th>
                    </tr></thead>
                    <tbody className="text-muted-foreground">
                      {[["Eval types","16"],["Test scenarios","219"],["Total eval runs","173"],["Individual test cases","6,500+"],["API endpoints","77"],["Prompt versions","5 per gate (25 total)"],["Final accuracy","97%+ overall (3 gates at 100%)"],["Cost per 5-gate decision","~$0.02"],["Total eval cost","~$21"],["Models tested","5 (2 providers)"],["Safety issues found","12 fixed, 4 open, 5 pending"]].map(([k,v])=>(
                        <tr key={k} className="border-b border-border/50"><td className="py-2.5 px-3 text-foreground">{k}</td><td className="py-2.5 px-3 font-semibold">{v}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-card border border-border rounded-xl p-6 text-center">
                  <h3 className="font-heading text-lg font-bold gradient-text mb-2">The agent is 10% of the work. The eval infrastructure is 90%.</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">That ratio is correct for regulated industries — and probably correct for any high-stakes AI system.</p>
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
