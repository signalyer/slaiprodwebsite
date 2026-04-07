import { motion } from "framer-motion";

const tags = [
  "Multi-Agent Orchestration", "ReAct Reasoning Loops", "Reflection & Self-Correction",
  "RAG Pipelines", "Semantic Knowledge Graphs", "Episodic Memory",
  "Procedural Memory", "Policy Guardrails", "Least Agency Principle",
  "Continuous Learning", "Event-Driven Architecture", "Human-in-the-Loop Gates",
  "Intent Classification", "Dynamic Routing", "Graph-Based Workflows",
];

const TechCapabilities = () => {
  return (
    <section className="py-10 relative">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <span className="text-xs font-mono font-semibold tracking-[0.2em] text-primary uppercase">BUILT WITH</span>
        </motion.div>
        <motion.div
          className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {tags.map((tag, i) => (
            <motion.span
              key={tag}
              className="px-3 py-1.5 rounded-full border border-border bg-card text-xs font-medium text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors cursor-default"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TechCapabilities;
