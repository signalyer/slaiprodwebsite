import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import useActiveSection from "@/hooks/useActiveSection";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const activeSection = useActiveSection(["about", "features", "approach", "agentic", "contact"]);
  const isHome = location.pathname === "/";

  const navLinks = [
    { href: "#about", label: "About", id: "about" },
    { href: "#features", label: "Platform", id: "features" },
    { href: "#approach", label: "Methodology", id: "approach" },
    { href: "#agentic", label: "Agentic AI", id: "agentic" },
    { href: "/blog.html", label: "Blog", id: "blog", external: true },
  ];

  const handleNavClick = (link: typeof navLinks[0]) => {
    if (!isHome) {
      navigate("/" + link.href);
    }
    setIsMenuOpen(false);
  };

  const handleGetStarted = () => {
    if (!isHome) {
      navigate("/#contact");
    } else {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Accent top line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      <div className="bg-background/75 backdrop-blur-2xl border-b border-border/40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-3 group cursor-pointer"
            >
              <motion.div
                className="relative w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center"
                style={{ background: "var(--gradient-primary)" }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Inner grid lines for tech feel */}
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: "linear-gradient(0deg, rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
                  backgroundSize: "8px 8px",
                }} />
                <span className="relative font-heading font-bold text-background text-base tracking-tight">SL</span>
              </motion.div>
              <div className="flex flex-col leading-none">
                <span className="font-heading font-bold text-lg text-foreground tracking-tight">
                  Signal<span className="gradient-text">Layer</span>
                </span>
                <span className="text-[10px] text-muted-foreground font-body tracking-widest uppercase">AI Platform</span>
              </div>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isExternal = (link as any).external;
                const isActive = !isExternal && isHome && activeSection === link.id;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    {...(isExternal ? { target: "_self" } : {})}
                    onClick={(e) => {
                      if (isExternal) return; // let browser navigate normally
                      if (!isHome) {
                        e.preventDefault();
                        handleNavClick(link);
                      }
                    }}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "text-primary bg-primary/8"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeSection"
                        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>
                );
              })}
            </nav>

            {/* CTA Button */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="hidden md:block">
              <Button
                onClick={handleGetStarted}
                className="font-heading font-semibold text-sm px-5 h-9 rounded-xl border border-primary/30 text-primary-foreground"
                style={{ background: "var(--gradient-primary)" }}
              >
                Get Started
              </Button>
            </motion.div>

            {/* Mobile Menu Toggle */}
            <motion.button
              className="md:hidden text-foreground p-2 rounded-lg hover:bg-secondary/60 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.2 }}>
                    <X size={22} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} transition={{ duration: 0.2 }}>
                    <Menu size={22} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Mobile Nav */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.nav
                className="md:hidden mt-3 pb-3 flex flex-col gap-1 overflow-hidden"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                {navLinks.map((link, index) => {
                  const isExternal = (link as any).external;
                  return (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => {
                        if (isExternal) { setIsMenuOpen(false); return; }
                        if (!isHome) { e.preventDefault(); handleNavClick(link); }
                        else setIsMenuOpen(false);
                      }}
                      className={`py-2.5 px-4 rounded-xl transition-colors font-medium text-sm cursor-pointer ${
                        !isExternal && isHome && activeSection === link.id
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      }`}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: index * 0.04 }}
                    >
                      {link.label}
                    </motion.a>
                  );
                })}
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.18 }}
                  className="mt-1"
                >
                  <Button
                    onClick={handleGetStarted}
                    className="w-full font-heading font-semibold text-sm rounded-xl text-primary-foreground"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    Get Started
                  </Button>
                </motion.div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;
