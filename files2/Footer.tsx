import { Mail } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { label: "About",       id: "about" },
    { label: "Platform",    id: "features" },
    { label: "Methodology", id: "approach" },
    { label: "Agentic AI",  id: "agentic" },
    { label: "Contact",     id: "contact" },
  ];

  const handleNavClick = (id: string) => {
    if (location.pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  };

  return (
    <footer className="relative border-t border-border/40">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

          {/* Brand */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "var(--gradient-primary)" }}
              >
                <span className="font-heading font-bold text-background text-xs">SL</span>
              </div>
              <span className="font-heading font-bold text-lg text-foreground">
                Signal<span className="gradient-text">Layer</span>
              </span>
            </div>
            <p className="text-muted-foreground text-xs max-w-[220px] leading-relaxed">
              AI/ML decision intelligence — outcome-driven, human-validated.
            </p>
          </div>

          {/* Nav links — scroll on home, navigate + scroll on other pages */}
          <nav className="flex flex-wrap gap-x-7 gap-y-2">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm bg-transparent border-none cursor-pointer p-0"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Email only */}
          <a
            href="mailto:contact@signallayer.ai?subject=Signal%20Layer"
            aria-label="Email"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-colors text-sm"
          >
            <Mail className="w-4 h-4" />
            contact@signallayer.ai
          </a>
        </div>

        <div className="mt-6 pt-5 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {year} Signal Layer. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
