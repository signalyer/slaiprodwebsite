import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// HTML escape function to prevent XSS
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

// Rate limiting configuration
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(req: Request): string {
  // Try to get real IP from various headers
  const forwardedFor = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const cfConnectingIp = req.headers.get("cf-connecting-ip");
  return cfConnectingIp || realIp || forwardedFor?.split(",")[0]?.trim() || "unknown";
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  
  if (!entry || now >= entry.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetIn: RATE_LIMIT_WINDOW_MS };
  }
  
  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, resetIn: entry.resetTime - now };
  }
  
  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count, resetIn: entry.resetTime - now };
}

const ALLOWED_ORIGINS = [
  "https://signallayer.ai",
  "https://www.signallayer.ai",
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
  };
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactEmailRequest {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Check rate limit
  const rateLimitKey = getRateLimitKey(req);
  const rateLimit = checkRateLimit(rateLimitKey);
  
  if (!rateLimit.allowed) {
    console.log("Rate limit exceeded for:", rateLimitKey);
    return new Response(
      JSON.stringify({ 
        error: "Too many requests. Please try again later.",
        resetIn: Math.ceil(rateLimit.resetIn / 60000)
      }),
      { 
        status: 429, 
        headers: { 
          "Content-Type": "application/json",
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetIn / 1000)),
          ...corsHeaders 
        } 
      }
    );
  }

  try {
    const { name, email, phone, message }: ContactEmailRequest = await req.json();

    // Server-side validation
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Name, email, and message are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!emailRegex.test(email.trim())) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Sanitize inputs
    const sanitizedName = name.trim().slice(0, 100);
    const sanitizedEmail = email.trim().slice(0, 255);
    const sanitizedPhone = phone?.trim().slice(0, 20) || "";
    const sanitizedMessage = message.trim().slice(0, 5000);

    console.log("Sending contact email from:", sanitizedEmail);

    // Send email to Signal Layer
    const emailResponse = await resend.emails.send({
      from: "Signal Layer <contact@signallayer.ai>",
      to: ["contact@signallayer.ai"],
      reply_to: sanitizedEmail,
      subject: `New Contact Form Submission from ${sanitizedName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(sanitizedName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(sanitizedEmail)}</p>
        ${sanitizedPhone ? `<p><strong>Phone:</strong> ${escapeHtml(sanitizedPhone)}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(sanitizedMessage).replace(/\n/g, '<br>')}</p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again later." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
