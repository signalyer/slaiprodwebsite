import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect } from "react";

interface FeatureDetail {
  title: string;
  tag: string;
  description: string;
  fullDescription: string;
  image: string;
  accent: string;
  number: string;
}

interface FeatureDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  features: FeatureDetail[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

const FeatureDetailModal = ({
  isOpen,
  onClose,
  features,
  currentIndex,
  onNavigate,
}: FeatureDetailModalProps) => {
  const feature = features[currentIndex];
  const total = features.length;

  const prev = () => onNavigate(currentIndex === 0 ? total - 1 : currentIndex - 1);
  const next = () => onNavigate(currentIndex === total - 1 ? 0 : currentIndex + 1);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, currentIndex]);

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!feature) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-4xl pointer-events-auto overflow-hidden rounded-2xl border border-border/60 bg-card"
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 24 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              style={{ boxShadow: `0 32px 80px hsl(0 0% 0% / 0.6), 0 0 0 1px ${feature.accent}20` }}
            >
              {/* Accent top line */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${feature.accent}, transparent)` }}
              />

              <div className="grid md:grid-cols-[1fr_1.1fr]">
                {/* Left: Image */}
                <div className="relative h-64 md:h-full min-h-[360px] overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={feature.image}
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.35 }}
                    />
                  </AnimatePresence>

                  {/* Dark overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/70 via-transparent to-transparent" />

                  {/* Accent color wash */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{ background: `linear-gradient(135deg, ${feature.accent}30, transparent 60%)` }}
                  />

                  {/* Number watermark */}
                  <div
                    className="absolute top-5 left-5 font-heading font-bold text-6xl leading-none select-none"
                    style={{ color: `${feature.accent}25` }}
                  >
                    {feature.number}
                  </div>

                  {/* Tag */}
                  <div
                    className="absolute bottom-5 left-5 text-[11px] font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm"
                    style={{
                      background: `${feature.accent}20`,
                      color: feature.accent,
                      border: `1px solid ${feature.accent}40`,
                    }}
                  >
                    {feature.tag}
                  </div>
                </div>

                {/* Right: Content */}
                <div className="flex flex-col p-8 md:p-10">
                  {/* Close button */}
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors z-10"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.28 }}
                      className="flex-1 flex flex-col"
                    >
                      <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-5 leading-tight pr-8">
                        {feature.title}
                      </h2>

                      {/* Accent divider */}
                      <div
                        className="w-12 h-px mb-6"
                        style={{ background: `linear-gradient(90deg, ${feature.accent}, transparent)` }}
                      />

                      <p className="text-muted-foreground leading-relaxed text-[15px] flex-1">
                        {feature.fullDescription}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/40">
                    {/* Progress dots */}
                    <div className="flex items-center gap-1.5">
                      {features.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => onNavigate(i)}
                          className="transition-all duration-200 rounded-full"
                          style={{
                            width: i === currentIndex ? "20px" : "6px",
                            height: "6px",
                            background: i === currentIndex ? feature.accent : "hsl(var(--border))",
                          }}
                          aria-label={`Go to feature ${i + 1}`}
                        />
                      ))}
                    </div>

                    {/* Arrow nav */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={prev}
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground border border-border/60 hover:border-border transition-colors"
                        aria-label="Previous"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-muted-foreground text-xs w-12 text-center tabular-nums">
                        {currentIndex + 1} / {total}
                      </span>
                      <button
                        onClick={next}
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground border border-border/60 hover:border-border transition-colors"
                        aria-label="Next"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FeatureDetailModal;
