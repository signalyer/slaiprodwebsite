import { useState } from "react";
import { Database, Brain, Settings2, Users, Zap, Shield, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import signalIntake from "@/assets/signal-intake-holographic.jpg";
import decisionMaking from "@/assets/decision-making-holographic.jpg";
import tailoredSolutions from "@/assets/tailored-solutions-holographic.jpg";
import intelligenceLayering from "@/assets/intelligence-layering-holographic.jpg";
import FeatureDetailModal from "./FeatureDetailModal";

const features = [
  {
    number: "01",
    icon: Database,
    title: "Signal Intake",
    tag: "Data Ingestion",
    description: "Seamlessly gather and integrate data from APIs, databases, sensors, and real-time streams into one unified foundation.",
    fullDescription: "At Signal Layer, we initiate our process by gathering diverse signals from a multitude of sources. Our platform seamlessly integrates data inputs — whether from market trends, user interactions, or operational metrics. This comprehensive intake phase ensures we capture the most relevant information tailored to your business needs. By harnessing advanced analytics, we transform raw data into actionable insights that set the foundation for confident decision-making.",
    image: signalIntake,
    accent: "hsl(172 72% 42%)",
    objectPosition: "center center",
  },
  {
    number: "02",
    icon: Brain,
    title: "Intelligent Decision Making",
    tag: "AI/ML Core",
    description: "Multi-model ML pipelines extract meaningful patterns and predictions from your signal data at enterprise scale.",
    fullDescription: "Signal Layer equips businesses with the power to make data-driven choices using sophisticated Machine Learning models. Our technology integrates human expertise with AI — creating a Human-in-the-Loop approach that ensures optimal outcomes. This blend allows organizations to analyze data through the lens of domain-specific knowledge, navigating complexity confidently and seizing opportunities more effectively.",
    image: decisionMaking,
    accent: "hsl(185 78% 44%)",
    objectPosition: "center 35%",
  },
  {
    number: "03",
    icon: Settings2,
    title: "Tailored Solutions",
    tag: "Customization",
    description: "Flexible AI solutions designed to adapt to your unique business challenges, verticals, and objectives.",
    fullDescription: "Tailored Solutions from Signal Layer offers businesses the flexibility to customize Machine Learning models based on their specific needs. Understanding that no two organizations are alike, we provide a platform that adapts to your unique challenges — whether enhancing customer experiences, optimizing operations, or innovating product offerings. Collaborate with our experts to design a strategy that drives measurable results.",
    image: tailoredSolutions,
    accent: "hsl(198 80% 46%)",
    objectPosition: "center 45%",
  },
  {
    number: "04",
    icon: Users,
    title: "Intelligence Layering",
    tag: "Domain Expertise",
    description: "Combine your domain knowledge and operational context directly with AI model outputs for richer, calibrated insights.",
    fullDescription: "Once signals are gathered, our platform allows businesses to layer their own intelligence and domain expertise onto the data. This unique capability empowers organizations to combine industry knowledge with insights from our ML models — enabling more accurate forecasting and tailored recommendations that align with strategic goals and operational realities.",
    image: intelligenceLayering,
    accent: "hsl(210 82% 50%)",
    objectPosition: "center center",
  },
];

const capabilities = [
  {
    icon: Zap,
    title: "Real-Time Processing",
    description: "Process and analyze data streams in real-time for immediate actionable insights with sub-second latency.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade security protocols — encryption at rest and in transit — protect your data throughout the pipeline.",
  },
];

const FeaturesSection = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openModal = (index: number) => {
    setActiveIndex(index);
    setModalOpen(true);
  };

  return (
    <section id="features" className="py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
        >
          <span className="text-primary font-medium text-xs uppercase tracking-[0.2em]">Platform</span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mt-4 tracking-tight">
            Empower Your <span className="gradient-text">Decisions</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-3 leading-relaxed">
            Four core capabilities that transform raw signals into measurable business outcomes.
          </p>
        </motion.div>

        {/* 2×2 Feature Cards */}
        <div className="grid md:grid-cols-2 gap-5 mb-5">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                onClick={() => openModal(i)}
                className="group relative rounded-2xl bg-card border border-border/60 overflow-hidden cursor-pointer transition-all duration-400 flex flex-col"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.09 }}
                whileHover={{ y: -5, borderColor: `${feature.accent}50` }}
                style={{ boxShadow: "none" }}
                whileTap={{ scale: 0.99 }}
              >
                {/* Image container — fixed height, per-image crop point */}
                <div className="relative overflow-hidden shrink-0" style={{ aspectRatio: "4/3" }}>
                  {/* Base image */}
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ objectPosition: feature.objectPosition }}
                  />

                  {/* Permanent dark gradient from bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />

                  {/* Animated color sweep on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(135deg, ${feature.accent}20, transparent 60%)` }}
                  />

                  {/* Scan line animation on hover */}
                  <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.div
                      className="absolute top-0 bottom-0 w-[2px] blur-sm"
                      style={{ background: `linear-gradient(to bottom, transparent, ${feature.accent}, transparent)` }}
                      animate={{ left: ["-5%", "105%"] }}
                      transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
                    />
                  </div>

                  {/* Number badge — top right */}
                  <div
                    className="absolute top-4 right-4 font-heading font-bold text-xs px-2.5 py-1 rounded-full opacity-70"
                    style={{
                      background: `${feature.accent}20`,
                      color: feature.accent,
                      border: `1px solid ${feature.accent}40`,
                    }}
                  >
                    {feature.number}
                  </div>

                  {/* Tag pill — top left */}
                  <div className="absolute top-4 left-4 text-[10px] font-medium px-2.5 py-1 rounded-full bg-background/70 backdrop-blur-sm text-muted-foreground border border-border/60">
                    {feature.tag}
                  </div>


                </div>

                {/* Content */}
                <div className="px-5 py-4 flex flex-col flex-1">
                  {/* Icon */}
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 self-start"
                    style={{ background: `${feature.accent}15`, border: `1.5px solid ${feature.accent}40` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: feature.accent }} />
                  </div>
                  <h3
                    className="font-heading font-bold text-base text-foreground mb-1.5 transition-colors duration-300"
                    style={{ color: undefined }}
                  >
                    <span className="group-hover:text-primary transition-colors duration-300">{feature.title}</span>
                  </h3>
                  <p className="text-muted-foreground text-xs leading-relaxed mb-3">
                    {feature.description}
                  </p>
                  <span
                    className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide transition-all duration-300 group-hover:gap-2 mt-auto"
                    style={{ color: feature.accent }}
                  >
                    Deep dive <ArrowRight className="w-3 h-3" />
                  </span>
                </div>

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{ background: `linear-gradient(90deg, transparent, ${feature.accent}60, transparent)` }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Capability strip — 2 horizontal cards */}
        <div className="grid md:grid-cols-2 gap-5">
          {capabilities.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              className="group relative flex gap-5 p-6 rounded-2xl bg-card border border-border/60 hover:border-primary/40 transition-all duration-400 overflow-hidden"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: 0.38 + i * 0.08 }}
              whileHover={{ y: -3 }}
            >
              {/* Icon */}
              <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center transition-colors duration-300 group-hover:bg-primary/20">
                <Icon className="w-5 h-5 text-primary" />
              </div>

              {/* Text */}
              <div>
                <h3 className="font-heading font-bold text-base text-foreground mb-1.5 group-hover:text-primary transition-colors duration-300">
                  {title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/4 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-2xl" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Feature Modal */}
      <FeatureDetailModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        features={features}
        currentIndex={activeIndex}
        onNavigate={setActiveIndex}
      />
    </section>
  );
};

export default FeaturesSection;
