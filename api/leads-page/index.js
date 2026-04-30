/**
 * GET /api/leads — leads dashboard.
 * Renders an HTML table of all verified leads. Requires a valid session
 * cookie (set by /api/leads/login). 10-minute server-side TTL.
 */

const {
  validateSession,
  readSessionCookie,
  listLeads,
  htmlPage,
} = require('../_shared/admin');

function htmlResponse(context, status, html, extraHeaders = {}) {
  context.res = {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      ...extraHeaders,
    },
    body: html,
  };
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
  const d = new Date(iso);
  return d.toISOString().replace('T', ' ').replace(/\.\d+Z$/, ' UTC');
}

module.exports = async function (context, req) {
  try {
    const token = readSessionCookie(req);
    const valid = await validateSession(token);
    if (!valid) {
      context.res = {
        status: 302,
        headers: { Location: '/api/leads/login' },
        body: '',
      };
      return;
    }

    const leads = await listLeads();
    const totalCount = leads.length;
    const last24hCount = leads.filter((l) => {
      if (!l.verifiedAt) return false;
      return Date.now() - new Date(l.verifiedAt).getTime() < 24 * 60 * 60 * 1000;
    }).length;
    const last7dCount = leads.filter((l) => {
      if (!l.verifiedAt) return false;
      return Date.now() - new Date(l.verifiedAt).getTime() < 7 * 24 * 60 * 60 * 1000;
    }).length;

    const rows = leads
      .map(
        (l) =>
          `<tr>
            <td class="email">${escapeHtml(l.email)}</td>
            <td>${escapeHtml(l.name)}</td>
            <td class="date">${formatDate(l.verifiedAt)}</td>
          </tr>`
      )
      .join('');

    const tableHtml = leads.length
      ? `<table>
          <thead><tr><th>Email</th><th>Name</th><th>Verified at</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>`
      : `<div class="card"><div class="empty">No verified leads yet.</div></div>`;

    const html = htmlPage({
      title: 'Signal Layer · Admin · Leads',
      body: `
<div class="wrap">
  <div class="topbar">
    <div>
      <div class="brand">Signal<span class="layer">Layer</span></div>
      <div class="eyebrow">Admin · Leads</div>
    </div>
    <a href="/api/leads/logout">Sign out →</a>
  </div>
  <h1>AI ROI Framework — registered leads</h1>
  <p class="subtitle">Captured on the verification gate at airoiframework.signallayer.ai. Sorted by most recent first.</p>
  <div class="stats">
    <div class="stat"><div class="stat-label">Total leads</div><div class="stat-value">${totalCount}</div></div>
    <div class="stat"><div class="stat-label">Last 7 days</div><div class="stat-value">${last7dCount}</div></div>
    <div class="stat"><div class="stat-label">Last 24 hours</div><div class="stat-value">${last24hCount}</div></div>
  </div>
  ${tableHtml}
</div>`,
    });

    htmlResponse(context, 200, html);
  } catch (err) {
    context.log.error('admin dashboard failed:', err.message, err.stack);
    htmlResponse(context, 500, htmlPage({
      title: 'Signal Layer · Admin · Error',
      body: `<div class="center"><div class="card card-w"><h1>Server error</h1><p class="subtitle">${escapeHtml(err.message)}</p></div></div>`,
    }));
  }
};
