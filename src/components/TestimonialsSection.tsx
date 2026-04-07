import { motion } from "framer-motion";
import { TrendingUp, Clock, Target, Users } from "lucide-react";

// Replace these with real client outcomes when available
const outcomes = [
  {
    icon: TrendingUp,
    metric: "40%",
    label: "Faster Decisions",
    context: "Reduction in time-to-decision for complex operational choices",
  },
  {
    icon: Target,
    metric: "3×",
    label: "Signal Coverage",
    context: "More data sources integrated vs. traditional analytics stacks",
  },
  {
    icon: Clock,
    metric: "<24h",
    label: "Time to Insight",
    context: "From raw signal ingestion to validated, actionable recommendation",
  },
  {
    icon: Users,
    metric: "100%",
    label: "Human Validated",
    context: "Every critical decision reviewed by domain experts before delivery",
  },
];

const OutcomesSection = () => {
  return (
    <section className="py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/8 to-background" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-primary/8 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
        >
          <span className="text-primary font-medium text-xs uppercase tracking-[0.2em]">Platform Outcomes</span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mt-4 tracking-tight">
            Built to <span className="gradient-text">Deliver Results</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-3 leading-relaxed">
            Signal Layer is designed around measurable outcomes — not vanity metrics.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
          {outcomes.map(({ icon: Icon, metric, label, context }, i) => (
            <motion.div
              key={label}
              className="group relative p-7 rounded-2xl bg-card border border-border/60 hover:border-primary/40 transition-all duration-400 overflow-hidden text-center"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.09 }}
              whileHover={{ y: -4 }}
            >
              {/* Icon */}
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors">
                <Icon className="w-5 h-5 text-primary" />
              </div>

              {/* Metric */}
              <div className="font-heading font-bold text-4xl gradient-text mb-1 leading-none">
                {metric}
              </div>

              {/* Label */}
              <div className="font-heading font-semibold text-sm text-foreground mb-3">
                {label}
              </div>

              {/* Context */}
              <p className="text-muted-foreground text-xs leading-relaxed">
                {context}
              </p>

              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-2xl" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OutcomesSection;
