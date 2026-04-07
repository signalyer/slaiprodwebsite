import { motion } from "framer-motion";
import aboutBg from "@/assets/about-holographic.jpg";

const pillars = [
  { number: "01", title: "Signal Capture", desc: "Aggregate from APIs, databases, sensors, and streams into one unified layer." },
  { number: "02", title: "AI Intelligence", desc: "Multi-model ML pipelines extract patterns and generate predictions at scale." },
  { number: "03", title: "Human Validation", desc: "Domain experts review critical outputs before decisions reach your workflow." },
  { number: "04", title: "Outcome Delivery", desc: "Insights embedded directly into your tools, not buried in dashboards." },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Subtle side glow */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-primary/8 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
        >
          <span className="text-primary font-medium text-xs uppercase tracking-[0.2em]">About Signal Layer</span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mt-4 tracking-tight">
            Empowering <span className="gradient-text">Decision-Makers</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-5 leading-relaxed">
            We combine sophisticated machine learning with human domain expertise — 
            so every decision is both intelligent and grounded in your business reality.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10 items-start max-w-6xl mx-auto">
          {/* Left visual */}
          <motion.div
            className="lg:col-span-2 relative pb-6"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative rounded-2xl overflow-hidden border border-border/60">
              <img
                src={aboutBg}
                alt="AI intelligence visualization"
                className="w-full aspect-[4/5] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />

              {/* Floating badge bottom */}
              <div className="absolute bottom-5 left-5 right-5">
                <motion.div
                  className="glass-card rounded-xl p-4 flex items-center gap-4"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--gradient-primary)" }}>
                    <span className="font-heading font-bold text-background text-sm">AI</span>
                  </div>
                  <div>
                    <div className="font-heading font-bold text-sm gradient-text">Human + AI Synergy</div>
                    <div className="text-muted-foreground text-xs mt-0.5">The perfect decision loop</div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Side stat */}
            <motion.div
              className="absolute -bottom-5 -right-4 glass-card rounded-xl p-4 text-center border border-border/60 min-w-[90px]"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              style={{ boxShadow: "var(--shadow-primary)" }}
            >
              <div className="font-heading font-bold text-2xl gradient-text">HITL</div>
              <div className="text-muted-foreground text-[11px] mt-0.5">Always On</div>
            </motion.div>
          </motion.div>

          {/* Right: 4 pillars */}
          <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.number}
                className="group relative p-6 rounded-2xl bg-card border border-border/60 hover:border-primary/40 transition-all duration-400"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                whileHover={{ y: -3 }}
              >
                {/* Number */}
                <div className="font-heading font-bold text-3xl gradient-text opacity-40 mb-3 leading-none">
                  {pillar.number}
                </div>
                <h3 className="font-heading font-semibold text-base text-foreground mb-2 group-hover:text-primary transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {pillar.desc}
                </p>
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/4 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
