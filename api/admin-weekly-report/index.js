/**
 * POST /api/admin/weekly-report — sends a weekly digest of new leads.
 *
 * Triggered by GitHub Actions cron with header:
 *   Authorization: Bearer <WEEKLY_REPORT_SECRET>
 *
 * Reuses the marketing site's Microsoft Graph service principal to send
 * mail from contact@signallayer.ai. Recipient is in
 * WEEKLY_REPORT_RECIPIENT app setting.
 */

const { listLeads, safeEqual } = require('../_shared/admin');

const SENDER_EMAIL = 'contact@signallayer.ai';

async function getGraphToken() {
  const tokenUrl = `https://login.microsoftonline.com/${process.env.GRAPH_TENANT_ID}/oauth2/v2.0/token`;
  const params = new URLSearchParams({
    client_id: process.env.GRAPH_CLIENT_ID,
    client_secret: process.env.GRAPH_CLIENT_SECRET,
    scope: 'https://graph.microsoft.com/.default',
    grant_type: 'client_credentials',
  });
  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  const data = await res.json();
  if (!data.access_token) {
    throw new Error(`Graph auth failed: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

async function sendMail({ to, subject, htmlBody }) {
  const token = await getGraphToken();
  const res = await fetch(
    `https://graph.microsoft.com/v1.0/users/${SENDER_EMAIL}/sendMail`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: {
          subject,
          body: { contentType: 'HTML', content: htmlBody },
          toRecipients: [{ emailAddress: { address: to } }],
        },
        saveToSentItems: false,
      }),
    }
  );
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Graph sendMail failed: ${errText}`);
  }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toISOString().replace('T', ' ').replace(/\.\d+Z$/, ' UTC');
}

function reportHtml({ totalCount, newLeads, weekStart, weekEnd }) {
  const rows = newLeads
    .map(
      (l) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #1d212a;font-family:'IBM Plex Mono',monospace;font-size:13px;color:#f2f5f8;">${escapeHtml(l.email)}</td><td style="padding:8px 12px;border-bottom:1px solid #1d212a;color:#b8c2cc;font-size:13px;">${escapeHtml(l.name)}</td><td style="padding:8px 12px;border-bottom:1px solid #1d212a;font-family:'IBM Plex Mono',monospace;font-size:12px;color:#6b7590;">${formatDate(l.verifiedAt)}</td></tr>`
    )
    .join('');
  const tableSection = newLeads.length
    ? `<table style="width:100%;border-collapse:collapse;background:#0d1117;border:1px solid #1d212a;border-radius:8px;overflow:hidden;margin-top:8px;">
        <thead>
          <tr>
            <th style="padding:10px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#6b7590;background:rgba(30,184,164,0.05);font-weight:500;">Email</th>
            <th style="padding:10px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#6b7590;background:rgba(30,184,164,0.05);font-weight:500;">Name</th>
            <th style="padding:10px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#6b7590;background:rgba(30,184,164,0.05);font-weight:500;">Verified</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`
    : `<p style="color:#6b7590;font-size:14px;margin:8px 0 0 0;">No new leads this week.</p>`;
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#090b10;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:640px;margin:0 auto;padding:48px 24px;">
    <div style="background:#11151c;border:1px solid #1d212a;border-radius:14px;padding:32px;">
      <div style="font-family:'Syne','Segoe UI',sans-serif;font-size:22px;color:#ffffff;font-weight:600;margin-bottom:6px;">
        Signal<span style="color:#1eb8a4;">Layer</span>
      </div>
      <div style="font-size:11px;color:#8892a4;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:24px;">
        Weekly leads digest
      </div>
      <h1 style="color:#f2f5f8;font-size:20px;margin:0 0 8px 0;font-weight:600;">
        ${newLeads.length} new lead${newLeads.length === 1 ? '' : 's'} this week
      </h1>
      <p style="color:#b8c2cc;font-size:14px;margin:0 0 20px 0;">
        ${escapeHtml(weekStart)} → ${escapeHtml(weekEnd)} · ${totalCount} total verified leads to date
      </p>
      ${tableSection}
      <p style="color:#6b7590;font-size:12px;margin:24px 0 0 0;">
        Full list: <a href="https://signallayer.ai/api/admin" style="color:#1eb8a4;text-decoration:none;">signallayer.ai/api/admin</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

function jsonResponse(context, status, body) {
  context.res = {
    status,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

module.exports = async function (context, req) {
  try {
    // Bearer token auth
    const authHeader = req.headers?.authorization || '';
    const match = authHeader.match(/^Bearer\s+(.+)$/);
    const presented = match ? match[1].trim() : '';
    const expected = process.env.WEEKLY_REPORT_SECRET || '';
    if (!expected || !presented || !safeEqual(presented, expected)) {
      jsonResponse(context, 401, { error: 'Unauthorized' });
      return;
    }

    const recipient = process.env.WEEKLY_REPORT_RECIPIENT;
    if (!recipient) {
      jsonResponse(context, 500, { error: 'WEEKLY_REPORT_RECIPIENT not configured' });
      return;
    }

    const allLeads = await listLeads();
    const weekAgoMs = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const newLeads = allLeads.filter(
      (l) => l.verifiedAt && new Date(l.verifiedAt).getTime() >= weekAgoMs
    );

    const weekStart = new Date(weekAgoMs).toISOString().slice(0, 10);
    const weekEnd = new Date().toISOString().slice(0, 10);

    await sendMail({
      to: recipient,
      subject: `Signal Layer · ${newLeads.length} new lead${newLeads.length === 1 ? '' : 's'} this week`,
      htmlBody: reportHtml({
        totalCount: allLeads.length,
        newLeads,
        weekStart,
        weekEnd,
      }),
    });

    jsonResponse(context, 200, {
      ok: true,
      newLeads: newLeads.length,
      total: allLeads.length,
      sentTo: recipient,
    });
  } catch (err) {
    context.log.error('weekly report failed:', err.message, err.stack);
    jsonResponse(context, 500, { error: err.message });
  }
};
