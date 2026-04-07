import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import confetti from "canvas-confetti";

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";
const CONTACT_API_URL = import.meta.env.VITE_CONTACT_API_URL || "/api/contact";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be under 100 characters"),
  email: z.string().trim().email("Please enter a valid email address").max(255, "Email must be under 255 characters"),
  phone: z.string().trim().max(20, "Phone must be under 20 characters").optional().or(z.literal("")),
  message: z.string().trim().min(1, "Message is required").max(5000, "Message must be under 5,000 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;
type FieldName = keyof ContactFormData;

const RATE_LIMIT_KEY = "slai_contact_submissions";
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

const getSubmissionCount = (): { count: number; resetTime: number } => {
  try {
    const stored = localStorage.getItem(RATE_LIMIT_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      if (Date.now() < data.resetTime) return data;
    }
  } catch { /* ignore */ }
  return { count: 0, resetTime: Date.now() + RATE_LIMIT_WINDOW_MS };
};

const incrementSubmissionCount = () => {
  const current = getSubmissionCount();
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({
    count: current.count + 1,
    resetTime: current.count === 0 ? Date.now() + RATE_LIMIT_WINDOW_MS : current.resetTime,
  }));
};

interface FieldState {
  value: string;
  error: string;
  touched: boolean;
  valid: boolean;
}

const initialFieldState: FieldState = { value: "", error: "", touched: false, valid: false };

const ValidationIcon = ({ field }: { field: FieldState }) => (
  <AnimatePresence mode="wait">
    {field.touched && (
      <motion.span
        key={field.valid ? "valid" : "invalid"}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        className="absolute right-3 top-1/2 -translate-y-1/2"
      >
        {field.valid ? (
          <CheckCircle2 className="w-4 h-4 text-green-500" />
        ) : field.error ? (
          <AlertCircle className="w-4 h-4 text-destructive" />
        ) : null}
      </motion.span>
    )}
  </AnimatePresence>
);

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

const useTurnstile = (siteKey: string) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const tokenRef = useRef<string>("");

  useEffect(() => {
    if (!document.getElementById("cf-turnstile-script")) {
      const script = document.createElement("script");
      script.id = "cf-turnstile-script";
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    const tryRender = () => {
      if (!containerRef.current || !window.turnstile || widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme: "dark",
        callback: (token: string) => { tokenRef.current = token; },
        "expired-callback": () => { tokenRef.current = ""; },
        "error-callback": () => { tokenRef.current = ""; },
      });
    };

    const interval = setInterval(() => {
      if (window.turnstile) { clearInterval(interval); tryRender(); }
    }, 100);

    return () => {
      clearInterval(interval);
      if (widgetIdRef.current && window.turnstile) {
        try { window.turnstile.remove(widgetIdRef.current); } catch { /* ignore */ }
        widgetIdRef.current = null;
        tokenRef.current = "";
      }
    };
  }, [siteKey]);

  const reset = useCallback(() => {
    tokenRef.current = "";
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }, []);

  return { containerRef, tokenRef, reset };
};

const ContactSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { containerRef: turnstileRef, tokenRef, reset: resetTurnstile } = useTurnstile(TURNSTILE_SITE_KEY);

  const [fields, setFields] = useState<Record<FieldName, FieldState>>({
    name: { ...initialFieldState },
    email: { ...initialFieldState },
    phone: { ...initialFieldState },
    message: { ...initialFieldState },
  });
  const [charCount, setCharCount] = useState(0);

  const validateField = (name: FieldName, value: string): { error: string; valid: boolean } => {
    const result = contactSchema.shape[name].safeParse(value);
    if (result.success) return { error: "", valid: true };
    return { error: result.error.errors[0]?.message || "Invalid", valid: false };
  };

  const handleChange = (name: FieldName, value: string) => {
    const { error, valid } = fields[name].touched ? validateField(name, value) : { error: "", valid: false };
    setFields(prev => ({ ...prev, [name]: { value, error, touched: prev[name].touched, valid } }));
    if (name === "message") setCharCount(value.length);
  };

  const handleBlur = (name: FieldName) => {
    const { error, valid } = validateField(name, fields[name].value);
    setFields(prev => ({ ...prev, [name]: { ...prev[name], touched: true, error, valid } }));
  };

  const resetForm = useCallback(() => {
    setFields({
      name: { ...initialFieldState },
      email: { ...initialFieldState },
      phone: { ...initialFieldState },
      message: { ...initialFieldState },
    });
    setCharCount(0);
    setIsSuccess(false);
    resetTurnstile();
  }, [resetTurnstile]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    if (formData.get("website")) {
      toast({ title: "Message sent!", description: "We'll get back to you soon." });
      return;
    }

    const values = {
      name: fields.name.value,
      email: fields.email.value,
      phone: fields.phone.value,
      message: fields.message.value,
    };
    const result = contactSchema.safeParse(values);

    if (!result.success) {
      const newFields = { ...fields };
      result.error.errors.forEach(err => {
        const name = err.path[0] as FieldName;
        newFields[name] = { ...newFields[name], error: err.message, touched: true, valid: false };
      });
      (Object.keys(newFields) as FieldName[]).forEach(key => {
        if (!result.error.errors.some(e => e.path[0] === key)) {
          newFields[key] = { ...newFields[key], touched: true, valid: true, error: "" };
        }
      });
      setFields(newFields);
      return;
    }

    const rateLimit = getSubmissionCount();
    if (rateLimit.count >= RATE_LIMIT_MAX) {
      const minutesLeft = Math.ceil((rateLimit.resetTime - Date.now()) / 60000);
      toast({
        title: "Too many submissions",
        description: `Please wait ${minutesLeft} minute${minutesLeft > 1 ? "s" : ""} before trying again.`,
        variant: "destructive",
      });
      return;
    }

    const turnstileToken = tokenRef.current;
    if (!turnstileToken) {
      toast({
        title: "Verification required",
        description: "Please wait for the security check to complete.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(CONTACT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: result.data.name,
          email: result.data.email,
          phone: result.data.phone || "",
          message: result.data.message,
          turnstileToken,
          site: "signallayer.ai",
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error || "Submission failed");
      }

      incrementSubmissionCount();
      setIsSuccess(true);

      const buttonEl = formRef.current?.querySelector('button[type="submit"]');
      if (buttonEl) {
        const rect = buttonEl.getBoundingClientRect();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: {
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: (rect.top + rect.height / 2) / window.innerHeight,
          },
          colors: ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#34d399"],
          disableForReducedMotion: true,
        });
      }

      toast({ title: "Message sent!", description: "We'll get back to you as soon as possible." });
      setTimeout(resetForm, 2500);
    } catch (error) {
      console.error("Contact form error:", error);
      resetTurnstile();
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field: FieldState) =>
    `bg-secondary/50 border-border focus:border-primary transition-colors ${
      field.touched && field.error ? "border-destructive focus:border-destructive" : ""
    } ${field.touched && field.valid ? "border-green-500/50" : ""}`;

  return (
    <section id="contact" className="py-10 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-secondary/30 via-background to-background" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Contact</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mt-3 mb-4">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Ready to transform your data into actionable insights? Connect with our team today.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <form ref={formRef} onSubmit={handleSubmit} className="p-8 rounded-2xl bg-card border border-border space-y-4">
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <Input type="text" name="website" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">Name <span className="text-destructive">*</span></label>
                  <div className="relative">
                    <Input id="name" name="name" placeholder="Your name" required value={fields.name.value} onChange={(e) => handleChange("name", e.target.value)} onBlur={() => handleBlur("name")} className={`${inputClass(fields.name)} pr-9`} disabled={isSubmitting || isSuccess} />
                    <ValidationIcon field={fields.name} />
                  </div>
                  <AnimatePresence>
                    {fields.name.touched && fields.name.error && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-destructive text-xs mt-1.5">{fields.name.error}</motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">Email <span className="text-destructive">*</span></label>
                  <div className="relative">
                    <Input id="email" name="email" type="email" placeholder="your@email.com" required value={fields.email.value} onChange={(e) => handleChange("email", e.target.value)} onBlur={() => handleBlur("email")} className={`${inputClass(fields.email)} pr-9`} disabled={isSubmitting || isSuccess} />
                    <ValidationIcon field={fields.email} />
                  </div>
                  <AnimatePresence>
                    {fields.email.touched && fields.email.error && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-destructive text-xs mt-1.5">{fields.email.error}</motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">Phone <span className="text-muted-foreground text-xs">(optional)</span></label>
                <div className="relative">
                  <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" value={fields.phone.value} onChange={(e) => handleChange("phone", e.target.value)} onBlur={() => handleBlur("phone")} className={`${inputClass(fields.phone)} pr-9`} disabled={isSubmitting || isSuccess} />
                  <ValidationIcon field={fields.phone} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="message" className="block text-sm font-medium text-foreground">Message <span className="text-destructive">*</span></label>
                  <span className={`text-xs transition-colors ${charCount > 4500 ? "text-destructive" : "text-muted-foreground"}`}>
                    {charCount > 0 && `${charCount.toLocaleString()} / 5,000`}
                  </span>
                </div>
                <Textarea id="message" name="message" placeholder="Tell us about your project..." rows={5} required value={fields.message.value} onChange={(e) => handleChange("message", e.target.value)} onBlur={() => handleBlur("message")} className={`${inputClass(fields.message)} resize-none`} disabled={isSubmitting || isSuccess} />
                <AnimatePresence>
                  {fields.message.touched && fields.message.error && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-destructive text-xs mt-1.5">{fields.message.error}</motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Cloudflare Turnstile */}
              <div ref={turnstileRef} />

              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting || isSuccess}>
                <AnimatePresence mode="wait">
                  {isSuccess ? (
                    <motion.span key="success" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Sent Successfully
                    </motion.span>
                  ) : isSubmitting ? (
                    <motion.span key="loading" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                    </motion.span>
                  ) : (
                    <motion.span key="idle" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex items-center gap-2">
                      Send Message <Send className="w-4 h-4" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
