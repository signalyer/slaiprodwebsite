/**
 * Shared helpers for the admin dashboard:
 *  - leadsStorage     — read verifiedLeads from the AI ROI Framework's
 *                       Storage account (cross-subscription via connection
 *                       string in LEADS_STORAGE_CONNECTION_STRING)
 *  - adminAuth        — session + lockout state in a separate table
 *  - htmlPage         — Signal Layer dark-themed shell for admin pages
 */

const crypto = require('crypto');
const { TableClient } = require('@azure/data-tables');

const LEADS_TABLE = 'verifiedLeads';
const SESSIONS_TABLE = 'adminSessions';
const LOCKOUT_TABLE = 'adminLockout';

const SESSION_TTL_MS = 10 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 3;
const SESSION_COOKIE = 'sl_admin_session';

function leadsClient(tableName) {
  const conn = process.env.LEADS_STORAGE_CONNECTION_STRING;
  if (!conn) throw new Error('LEADS_STORAGE_CONNECTION_STRING is not set');
  return TableClient.fromConnectionString(conn, tableName);
}

async function ensureTable(client) {
  try {
    await client.createTable();
  } catch (err) {
    if (err.statusCode !== 409) throw err;
  }
}

// ── Leads ──────────────────────────────────────────────────────────────────

async function listLeads() {
  const client = leadsClient(LEADS_TABLE);
  const rows = [];
  for await (const entity of client.listEntities()) {
    rows.push({
      email: entity.rowKey,
      name: entity.name ?? '',
      verifiedAt: entity.verifiedAt ?? null,
    });
  }
  rows.sort((a, b) => (a.verifiedAt < b.verifiedAt ? 1 : -1));
  return rows;
}

// ── Session ────────────────────────────────────────────────────────────────

function generateSessionToken() {
  return crypto.randomBytes(32).toString('base64url');
}

async function createSession() {
  const client = leadsClient(SESSIONS_TABLE);
  await ensureTable(client);
  const token = generateSessionToken();
  await client.upsertEntity(
    {
      partitionKey: 'session',
      rowKey: token,
      createdAt: Date.now(),
    },
    'Replace'
  );
  return token;
}

async function validateSession(token) {
  if (!token) return false;
  const client = leadsClient(SESSIONS_TABLE);
  try {
    const entity = await client.getEntity('session', token);
    const elapsed = Date.now() - Number(entity.createdAt);
    if (elapsed > SESSION_TTL_MS) {
      await client.deleteEntity('session', token).catch(() => {});
      return false;
    }
    return true;
  } catch (err) {
    if (err.statusCode === 404) return false;
    throw err;
  }
}

async function destroySession(token) {
  if (!token) return;
  const client = leadsClient(SESSIONS_TABLE);
  try {
    await client.deleteEntity('session', token);
  } catch (err) {
    if (err.statusCode !== 404) throw err;
  }
}

function readSessionCookie(req) {
  const cookieHeader = req.headers?.cookie || '';
  const match = cookieHeader.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  return match ? match[1] : null;
}

function buildSessionCookie(token, maxAgeSeconds) {
  return `${SESSION_COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAgeSeconds}`;
}

function clearSessionCookie() {
  return `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

// ── Lockout ────────────────────────────────────────────────────────────────

async function checkLockout(username) {
  const client = leadsClient(LOCKOUT_TABLE);
  await ensureTable(client);
  try {
    const entity = await client.getEntity('lockout', username);
    return {
      locked: !!entity.locked,
      failedAttempts: Number(entity.failedAttempts ?? 0),
    };
  } catch (err) {
    if (err.statusCode === 404) return { locked: false, failedAttempts: 0 };
    throw err;
  }
}

async function recordFailure(username) {
  const client = leadsClient(LOCKOUT_TABLE);
  await ensureTable(client);
  const current = await checkLockout(username);
  const failedAttempts = current.failedAttempts + 1;
  const locked = failedAttempts >= MAX_FAILED_ATTEMPTS;
  await client.upsertEntity(
    {
      partitionKey: 'lockout',
      rowKey: username,
      failedAttempts,
      locked,
      lastAttempt: new Date().toISOString(),
    },
    'Replace'
  );
  return { failedAttempts, locked };
}

async function recordSuccess(username) {
  const client = leadsClient(LOCKOUT_TABLE);
  await ensureTable(client);
  await client.upsertEntity(
    {
      partitionKey: 'lockout',
      rowKey: username,
      failedAttempts: 0,
      locked: false,
      lastAttempt: new Date().toISOString(),
    },
    'Replace'
  );
}

// ── Constant-time string comparison ────────────────────────────────────────

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

// ── HTML page shell ────────────────────────────────────────────────────────

function htmlPage({ title, body }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive, nosnippet">
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700&family=DM+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #090b10;
    --card: #11151c;
    --border: #1d212a;
    --primary: #1eb8a4;
    --accent: #12c7e2;
    --muted: #6b7590;
    --subtle: #8892a4;
    --text: #f2f5f8;
    --error: #e14747;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; }
  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    line-height: 1.5;
  }
  .wrap { max-width: 1100px; margin: 0 auto; padding: 32px 24px; }
  .center { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
  .brand { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 600; margin-bottom: 4px; }
  .brand .layer { color: var(--primary); }
  .eyebrow { font-size: 11px; color: var(--subtle); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 24px; font-family: 'IBM Plex Mono', monospace; }
  h1 { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 600; margin-bottom: 8px; }
  .subtitle { color: var(--muted); font-size: 14px; margin-bottom: 24px; }
  .card { background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 28px; }
  .card-w { width: 100%; max-width: 380px; }
  label { display: block; font-size: 11px; color: var(--subtle); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 6px; font-family: 'IBM Plex Mono', monospace; }
  input[type=text], input[type=password] {
    width: 100%; padding: 10px 12px; border-radius: 8px;
    background: var(--bg); border: 1px solid var(--border); color: var(--text);
    font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none;
  }
  input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(30,184,164,0.15); }
  .field { margin-bottom: 16px; }
  button {
    width: 100%; padding: 11px 16px; border-radius: 10px; border: none;
    background: var(--primary); color: var(--bg);
    font-family: 'Syne', sans-serif; font-weight: 600; font-size: 14px;
    cursor: pointer; transition: filter 0.15s;
    box-shadow: 0 4px 20px rgba(30,184,164,0.25);
  }
  button:hover { filter: brightness(1.1); }
  .error { background: rgba(225,71,71,0.1); border: 1px solid rgba(225,71,71,0.4); color: #ff8888; padding: 10px 12px; border-radius: 8px; font-size: 13px; margin-bottom: 16px; }
  .topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid var(--border); }
  .topbar a { color: var(--subtle); font-size: 12px; text-decoration: none; font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.05em; }
  .topbar a:hover { color: var(--primary); }
  .stats { display: flex; gap: 24px; margin-bottom: 28px; flex-wrap: wrap; }
  .stat { padding: 16px 20px; background: var(--card); border: 1px solid var(--border); border-radius: 10px; }
  .stat-label { font-size: 10px; color: var(--subtle); letter-spacing: 0.1em; text-transform: uppercase; font-family: 'IBM Plex Mono', monospace; }
  .stat-value { font-family: 'IBM Plex Mono', monospace; font-size: 26px; color: var(--primary); margin-top: 4px; }
  table { width: 100%; border-collapse: collapse; background: var(--card); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
  th, td { padding: 12px 16px; text-align: left; border-bottom: 1px solid var(--border); font-size: 14px; }
  th { background: rgba(30,184,164,0.05); color: var(--subtle); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; font-family: 'IBM Plex Mono', monospace; font-weight: 500; }
  tr:last-child td { border-bottom: none; }
  td.email { font-family: 'IBM Plex Mono', monospace; color: var(--text); }
  td.date { font-family: 'IBM Plex Mono', monospace; color: var(--muted); font-size: 12px; }
  .empty { padding: 40px; text-align: center; color: var(--muted); }
</style>
</head>
<body>
${body}
</body>
</html>`;
}

module.exports = {
  // leads
  listLeads,
  // session
  createSession,
  validateSession,
  destroySession,
  readSessionCookie,
  buildSessionCookie,
  clearSessionCookie,
  SESSION_TTL_MS,
  // lockout
  checkLockout,
  recordFailure,
  recordSuccess,
  MAX_FAILED_ATTEMPTS,
  // util
  safeEqual,
  htmlPage,
};
