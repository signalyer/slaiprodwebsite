/**
 * Signal Layer Contact Form — Azure Function
 * Validates Cloudflare Turnstile, sends email via Microsoft Graph API (M365)
 *
 * Required Application Settings (set in Azure Portal → SWA → Configuration):
 *   TURNSTILE_SECRET
 *   GRAPH_TENANT_ID
 *   GRAPH_CLIENT_ID
 *   GRAPH_CLIENT_SECRET
 */

const CONTACT_EMAIL = "contact@signallayer.ai";
const SENDER_EMAIL = "contact@signallayer.ai";
const EMAIL_SUBJECT = "Signal Layer";

async function getGraphToken() {
  const tokenUrl = `https://login.microsoftonline.com/${process.env.GRAPH_TENANT_ID}/oauth2/v2.0/token`;
  const params = new URLSearchParams({
    client_id: process.env.GRAPH_CLIENT_ID,
    client_secret: process.env.GRAPH_CLIENT_SECRET,
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials",
  });

  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const data = await res.json();
  if (!data.access_token) {
    throw new Error(`Graph auth failed: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

module.exports = async function (context, req) {
  if (req.method !== "POST") {
    context.res = { status: 405, body: "Method Not Allowed" };
    return;
  }

  const { name, email, phone, message, turnstileToken } = req.body || {};

  // Field validation
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    context.res = {
      status: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Missing required fields" }),
    };
    return;
  }

  // Verify Cloudflare Turnstile
  if (!turnstileToken) {
    context.res = {
      status: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Missing Turnstile token" }),
    };
    return;
  }

  const turnstileRes = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET,
        response: turnstileToken,
      }),
    }
  );

  const turnstileData = await turnstileRes.json();
  if (!turnstileData.success) {
    context.res = {
      status: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Bot verification failed" }),
    };
    return;
  }

  // Send email via Microsoft Graph API
  let token;
  try {
    token = await getGraphToken();
  } catch (err) {
    context.log.error("Graph token error:", err.message);
    context.res = {
      status: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Email service unavailable" }),
    };
    return;
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
    context.log.error("Graph sendMail error:", errText);
    context.res = {
      status: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Email delivery failed" }),
    };
    return;
  }

  context.res = {
    status: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ok: true }),
  };
};
