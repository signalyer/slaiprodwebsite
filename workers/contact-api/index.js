/**
 * Signal Layer Contact Form Worker
 * Validates Cloudflare Turnstile, sends email via Microsoft Graph API (M365)
 * Deploy: wrangler deploy
 * Secrets: wrangler secret put TURNSTILE_SECRET
 *          wrangler secret put GRAPH_TENANT_ID
 *          wrangler secret put GRAPH_CLIENT_ID
 *          wrangler secret put GRAPH_CLIENT_SECRET
 */

const ALLOWED_ORIGINS = [
  "https://signallayer.ai",
  "https://www.signallayer.ai",
  // Add staging/preview domains as needed:
  // "https://your-preview.pages.dev",
];

const CONTACT_EMAIL = "contact@signallayer.ai";
const SENDER_EMAIL = "contact@signallayer.ai";
const EMAIL_SUBJECT = "Signal Layer";

const corsHeaders = (origin) => ({
  "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
});

async function getGraphToken(env) {
  const tokenUrl = `https://login.microsoftonline.com/${env.GRAPH_TENANT_ID}/oauth2/v2.0/token`;
  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.GRAPH_CLIENT_ID,
      client_secret: env.GRAPH_CLIENT_SECRET,
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials",
    }),
  });
  const data = await res.json();
  if (!data.access_token) {
    throw new Error(`Graph auth failed: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return new Response("Forbidden", { status: 403 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
      });
    }

    const { name, email, phone, message, turnstileToken } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
      });
    }

    if (!turnstileToken) {
      return new Response(JSON.stringify({ error: "Missing Turnstile token" }), {
        status: 400,
        headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
      });
    }

    const turnstileRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: env.TURNSTILE_SECRET,
          response: turnstileToken,
          remoteip: request.headers.get("CF-Connecting-IP"),
        }),
      }
    );

    const turnstileData = await turnstileRes.json();
    if (!turnstileData.success) {
      return new Response(JSON.stringify({ error: "Bot verification failed" }), {
        status: 400,
        headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
      });
    }

    // Send email via Microsoft Graph API
    let token;
    try {
      token = await getGraphToken(env);
    } catch (err) {
      console.error("Graph token error:", err.message);
      return new Response(JSON.stringify({ error: "Email service unavailable" }), {
        status: 500,
        headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
      });
    }

    const graphRes = await fetch(
      `https://graph.microsoft.com/v1.0/users/${SENDER_EMAIL}/sendMail`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: {
            subject: EMAIL_SUBJECT,
            body: {
              contentType: "HTML",
              content: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #0fb8a0;">New Contact Form Submission</h2>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 8px; font-weight: bold; width: 100px;">Name</td><td style="padding: 8px;">${escapeHtml(name)}</td></tr>
                    <tr style="background: #f9f9f9;"><td style="padding: 8px; font-weight: bold;">Email</td><td style="padding: 8px;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
                    ${phone ? `<tr><td style="padding: 8px; font-weight: bold;">Phone</td><td style="padding: 8px;">${escapeHtml(phone)}</td></tr>` : ""}
                    <tr ${!phone ? 'style="background: #f9f9f9;"' : ""}><td style="padding: 8px; font-weight: bold; vertical-align: top;">Message</td><td style="padding: 8px; white-space: pre-wrap;">${escapeHtml(message)}</td></tr>
                  </table>
                </div>
              `,
            },
            toRecipients: [
              { emailAddress: { address: CONTACT_EMAIL } },
            ],
            replyTo: [
              { emailAddress: { address: email } },
            ],
          },
          saveToSentItems: false,
        }),
      }
    );

    if (!graphRes.ok) {
      const errText = await graphRes.text();
      console.error("Graph sendMail error:", errText);
      return new Response(JSON.stringify({ error: "Email delivery failed" }), {
        status: 500,
        headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
    });
  },
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
