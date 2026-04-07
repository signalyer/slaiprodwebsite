import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Capture Signals",
    description: "Aggregate data from APIs, databases, sensors, and custom feeds — creating a unified, real-time data foundation.",
    accent: "hsl(172 72% 42%)",
  },
  {
    number: "02",
    title: "Layer Intelligence",
    description: "AI/ML models analyze patterns and predict outcomes, layered with your domain-specific knowledge and context.",
    accent: "hsl(185 78% 44%)",
  },
  {
    number: "03",
    title: "Human Validation",
    description: "Expert analysts review and validate AI outputs — ensuring recommendations align with real-world business logic.",
    accent: "hsl(198 80% 46%)",
  },
  {
    number: "04",
    title: "Drive Outcomes",
    description: "Deliver actionable insights directly into your workflows, enabling confident, measurable, data-driven decisions.",
    accent: "hsl(210 82% 50%)",
  },
];

const ApproachSection = () => {
  return (
    <section id="approach" className="py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-72 h-72 bg-accent/6 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
        >
          <span className="text-primary font-medium text-xs uppercase tracking-[0.2em]">Our Approach</span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mt-4 tracking-tight">
            The <span className="gradient-text">Signal Layer</span> Methodology
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-3 leading-relaxed">
            A proven four-step process that transforms complex data landscapes into clear,
            actionable intelligence — with humans in the loop at every critical gate.
          </p>
        </motion.div>

        {/* Steps — connected timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line (desktop) */}
          <div className="absolute left-[2.35rem] top-8 bottom-8 w-px bg-gradient-to-b from-primary/60 via-accent/40 to-transparent hidden md:block" />

          <div className="space-y-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                className="group relative flex gap-6 md:gap-8 items-start p-6 rounded-2xl bg-card border border-border/60 hover:border-primary/40 transition-all duration-400 overflow-hidden"
                initial={{ opacity: 0, x: -32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ x: 4 }}
              >
                {/* Step number circle */}
                <motion.div
                  className="relative shrink-0 w-[4.7rem] h-[4.7rem] rounded-2xl flex items-center justify-center z-10"
                  style={{ background: `${step.accent}15`, border: `1.5px solid ${step.accent}40` }}
                  whileHover={{ scale: 1.05 }}
                >
                  <span
                    className="font-heading font-bold text-xl"
                    style={{ color: step.accent }}
                  >
                    {step.number}
                  </span>
                </motion.div>

                {/* Content */}
                <div className="flex-1 py-1">
                  <h3 className="font-heading font-bold text-xl text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Step accent color bar */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: step.accent }}
                />

                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-2xl"
                  style={{ background: `radial-gradient(ellipse at 20% 50%, ${step.accent}08, transparent 70%)` }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApproachSection;
