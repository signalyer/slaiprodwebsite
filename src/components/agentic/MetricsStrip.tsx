import { motion } from "framer-motion";

const metrics = [
  { value: "3", label: "Agentic Architectures" },
  { value: "3", label: "Agent Memory Systems" },
  { value: "∞", label: "Signal Sources" },
  { value: "100%", label: "Decision Auditability" },
];

const MetricsStrip = () => {
  return (
    <section className="py-10 relative">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="font-heading text-3xl md:text-4xl font-bold gradient-text mb-1">{m.value}</div>
              <div className="text-xs text-muted-foreground font-medium">{m.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MetricsStrip;
