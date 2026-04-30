/**
 * GET  /api/admin/login — show login form.
 * POST /api/admin/login — check creds, set session cookie, redirect.
 *
 * After 3 failed attempts the account is locked. Unlock by clearing
 * the row from the adminLockout table:
 *   az storage entity delete --table-name adminLockout \
 *     --partition-key lockout --row-key sladmin \
 *     --account-name stairoiframeworkdev
 */

const {
  checkLockout,
  recordFailure,
  recordSuccess,
  createSession,
  buildSessionCookie,
  SESSION_TTL_MS,
  safeEqual,
  htmlPage,
} = require('../_shared/admin');

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function loginPage({ error }) {
  const errorHtml = error
    ? `<div class="error">${escapeHtml(error)}</div>`
    : '';
  return htmlPage({
    title: 'Signal Layer · Admin · Sign in',
    body: `
<div class="center">
  <div class="card card-w">
    <div class="brand">Signal<span class="layer">Layer</span></div>
    <div class="eyebrow">Admin</div>
    <h1>Sign in</h1>
    <p class="subtitle">Restricted access · 10-minute session</p>
    ${errorHtml}
    <form method="POST" action="/api/admin/login" autocomplete="off">
      <div class="field">
        <label for="username">Username</label>
        <input id="username" name="username" type="text" required autocomplete="username" autofocus>
      </div>
      <div class="field">
        <label for="password">Password</label>
        <input id="password" name="password" type="password" required autocomplete="current-password">
      </div>
      <button type="submit">Sign in</button>
    </form>
  </div>
</div>`,
  });
}

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

function parseFormBody(rawBody) {
  if (!rawBody) return {};
  const params = new URLSearchParams(rawBody);
  const out = {};
  for (const [k, v] of params) out[k] = v;
  return out;
}

module.exports = async function (context, req) {
  try {
    if (req.method === 'GET') {
      htmlResponse(context, 200, loginPage({ error: null }));
      return;
    }

    if (req.method !== 'POST') {
      context.res = { status: 405, body: 'Method Not Allowed' };
      return;
    }

    let username, password;
    const contentType = req.headers?.['content-type'] || '';
    if (contentType.includes('application/json')) {
      ({ username, password } = req.body || {});
    } else {
      const rawBody = typeof req.body === 'string' ? req.body : '';
      ({ username, password } = parseFormBody(rawBody));
    }

    const expectedUser = process.env.ADMIN_USERNAME;
    const expectedPass = process.env.ADMIN_PASSWORD;
    if (!expectedUser || !expectedPass) {
      htmlResponse(context, 500, loginPage({ error: 'Server is not configured.' }));
      return;
    }

    const submittedUser = String(username || '').trim();
    if (!submittedUser || !password) {
      htmlResponse(context, 400, loginPage({ error: 'Username and password are required.' }));
      return;
    }

    // Lockout check (always against the configured admin username — that's
    // the only account, so failed attempts on the wrong username still
    // count toward locking out the correct one. Conservative.)
    const lockout = await checkLockout(expectedUser);
    if (lockout.locked) {
      htmlResponse(context, 403, loginPage({
        error: 'Account disabled after 3 failed attempts. Contact admin to unlock.',
      }));
      return;
    }

    const userOk = safeEqual(submittedUser, expectedUser);
    const passOk = safeEqual(password, expectedPass);
    if (!userOk || !passOk) {
      const result = await recordFailure(expectedUser);
      const remaining = Math.max(0, 3 - result.failedAttempts);
      const message = result.locked
        ? 'Account disabled after 3 failed attempts. Contact admin to unlock.'
        : `Invalid credentials. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`;
      htmlResponse(context, 401, loginPage({ error: message }));
      return;
    }

    // Success — clear failures, mint a session
    await recordSuccess(expectedUser);
    const token = await createSession();
    const cookie = buildSessionCookie(token, SESSION_TTL_MS / 1000);
    context.res = {
      status: 302,
      headers: {
        Location: '/api/admin',
        'Set-Cookie': cookie,
        'Cache-Control': 'no-store',
      },
      body: '',
    };
  } catch (err) {
    context.log.error('admin login failed:', err.message, err.stack);
    htmlResponse(context, 500, loginPage({ error: 'Server error. Please try again.' }));
  }
};
