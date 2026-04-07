import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, Cpu, GitBranch, Shield } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import FloatingParticles from "./FloatingParticles";

// Animated signal flow SVG - encapsulates the "signal → layer → decision" metaphor
const SignalFlowDiagram = () => (
  <svg viewBox="0 0 420 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="hsl(172 72% 42%)" stopOpacity="0" />
        <stop offset="50%" stopColor="hsl(172 72% 42%)" stopOpacity="1" />
        <stop offset="100%" stopColor="hsl(188 85% 48%)" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="nodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(172 72% 42%)" />
        <stop offset="100%" stopColor="hsl(188 85% 48%)" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="softGlow">
        <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>

    {/* Background grid */}
    <pattern id="grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(172 72% 42% / 0.06)" strokeWidth="0.5"/>
    </pattern>
    <rect width="420" height="340" fill="url(#grid)" rx="16"/>

    {/* Input nodes — signals */}
    {[60, 120, 180, 240].map((y, i) => (
      <g key={y}>
        <motion.circle cx="48" cy={y} r="10" fill="hsl(222 24% 12%)" stroke="hsl(172 72% 42% / 0.4)" strokeWidth="1.5"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.12, duration: 0.4 }}
        />
        <motion.circle cx="48" cy={y} r="5" fill="url(#nodeGrad)" filter="url(#glow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ delay: i * 0.12, duration: 2.5, repeat: Infinity }}
        />
        {/* Signal label */}
        <motion.text x="18" y={y + 4} fontSize="7" fill="hsl(172 72% 42% / 0.6)" textAnchor="middle" fontFamily="DM Sans"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.12 + 0.3 }}
        >{["API", "DB", "IoT", "Feed"][i]}</motion.text>
      </g>
    ))}

    {/* Connection lines from inputs to layer node */}
    {[60, 120, 180, 240].map((y, i) => (
      <motion.line key={y} x1="58" y1={y} x2="175" y2="150"
        stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="4 4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.5 }}
        transition={{ delay: i * 0.1 + 0.4, duration: 0.6 }}
      />
    ))}

    {/* Central Intelligence Layer */}
    <motion.rect x="145" y="105" width="90" height="90" rx="16"
      fill="hsl(222 24% 10%)" stroke="hsl(172 72% 42%)" strokeWidth="1.5"
      filter="url(#softGlow)"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8, duration: 0.5 }}
    />
    <motion.text x="190" y="148" fontSize="9" fill="hsl(172 72% 42%)" textAnchor="middle" fontFamily="Syne" fontWeight="700"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
    >SIGNAL</motion.text>
    <motion.text x="190" y="162" fontSize="9" fill="hsl(188 85% 48%)" textAnchor="middle" fontFamily="Syne" fontWeight="700"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.05 }}
    >LAYER</motion.text>
    <motion.text x="190" y="176" fontSize="6.5" fill="hsl(172 72% 42% / 0.5)" textAnchor="middle" fontFamily="DM Sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.1 }}
    >AI + Human</motion.text>
    {/* Rotating ring */}
    <motion.circle cx="190" cy="150" r="50" fill="none" stroke="hsl(172 72% 42% / 0.15)" strokeWidth="1" strokeDasharray="6 6"
      animate={{ rotate: 360 }}
      transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
      style={{ originX: "190px", originY: "150px", transformBox: "fill-box" }}
    />

    {/* Output line */}
    <motion.line x1="235" y1="150" x2="310" y2="150"
      stroke="url(#lineGrad)" strokeWidth="2"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.8 }}
      transition={{ delay: 1.4, duration: 0.5 }}
    />

    {/* Output: Decision node */}
    <motion.rect x="310" y="115" width="88" height="70" rx="14"
      fill="hsl(222 24% 10%)" stroke="hsl(188 85% 48%)" strokeWidth="1.5"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.7, duration: 0.4 }}
    />
    <motion.text x="354" y="148" fontSize="8" fill="hsl(188 85% 48%)" textAnchor="middle" fontFamily="Syne" fontWeight="700"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.9 }}
    >DECISION</motion.text>
    <motion.text x="354" y="162" fontSize="7" fill="hsl(172 72% 42% / 0.6)" textAnchor="middle" fontFamily="DM Sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
    >Outcome-driven</motion.text>

    {/* Pulsing dot on output line */}
    <motion.circle r="4" fill="hsl(188 85% 48%)" filter="url(#glow)"
      initial={{ opacity: 0 }}
      animate={{ cx: [235, 310], opacity: [0, 1, 0] }}
      transition={{ delay: 1.8, duration: 1.2, repeat: Infinity, repeatDelay: 1.5 }}
    />

    {/* Human-in-the-loop badge */}
    <motion.g
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.2, duration: 0.4 }}
    >
      <rect x="125" y="230" width="150" height="28" rx="14" fill="hsl(172 72% 42% / 0.1)" stroke="hsl(172 72% 42% / 0.3)" strokeWidth="1"/>
      <circle cx="143" cy="244" r="5" fill="hsl(172 72% 42%)" />
      <text x="155" y="248" fontSize="8" fill="hsl(172 72% 42%)" fontFamily="DM Sans" fontWeight="500">Human-in-the-Loop ✓</text>
    </motion.g>
  </svg>
);

const metrics = [
  { icon: Activity, label: "Signal Sources", value: "100+" },
  { icon: Cpu, label: "AI Models", value: "Multi-LLM" },
  { icon: GitBranch, label: "Architecture", value: "Agentic" },
  { icon: Shield, label: "Approach", value: "HITL" },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Radial glow behind */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-accent/6 rounded-full blur-[100px] animate-hero-glow" />
      </div>

      {/* Particles */}
      <Suspense fallback={null}>
        <FloatingParticles />
      </Suspense>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-80px)]">
          {/* Left: Text content */}
          <motion.div className="flex flex-col justify-center" style={{ y: textY }}>
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25 mb-8 self-start"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-primary tracking-wide">Decision Intelligence Platform</span>
            </motion.div>

            {/* Headline */}
            <h1 className="font-heading font-bold text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-6 tracking-tight">
              {["Outcome-Driven", "AI for", "Smarter Decisions"].map((line, i) => (
                <motion.span
                  key={line}
                  className={`block ${i === 1 ? "gradient-text" : ""}`}
                  initial={{ opacity: 0, y: 24, rotateX: -20 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.55, delay: 0.15 + i * 0.12, ease: [0.215, 0.61, 0.355, 1] }}
                >
                  {line}
                </motion.span>
              ))}
            </h1>

            {/* Subheadline */}
            <motion.p
              className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-lg"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Capture signals from any source. Layer them with AI models and domain expertise. 
              Deliver decisions that are fast, intelligent, and grounded in your reality.
            </motion.p>

            {/* CTAs — 2 only */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.72 }}
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  className="h-12 px-7 rounded-xl font-heading font-semibold text-sm text-primary-foreground border border-primary/20"
                  style={{ background: "var(--gradient-primary)" }}
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Schedule a Demo
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="outline"
                  className="h-12 px-7 rounded-xl font-heading font-semibold text-sm border-border/60 hover:border-primary/40 hover:text-primary transition-colors"
                  onClick={() => navigate("/agentic-ai")}
                >
                  Explore Architecture
                </Button>
              </motion.div>
            </motion.div>

            {/* Metrics strip */}
            <motion.div
              className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              {metrics.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex flex-col gap-1.5 p-3 rounded-xl bg-card/60 border border-border/60 backdrop-blur-sm">
                  <Icon className="w-4 h-4 text-primary" />
                  <span className="font-heading font-bold text-sm text-foreground">{value}</span>
                  <span className="text-[11px] text-muted-foreground leading-tight">{label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Signal flow diagram */}
          <motion.div
            className="relative hidden lg:flex items-center justify-center"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "15%"]) }}
          >
            {/* Diagram glow */}
            <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-3xl scale-90" />
            <div className="relative w-full aspect-[420/340] max-w-[460px] rounded-2xl overflow-hidden border border-border/50 bg-card/30 backdrop-blur-sm p-4">
              <SignalFlowDiagram />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
