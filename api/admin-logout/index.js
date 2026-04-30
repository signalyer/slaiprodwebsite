/**
 * /api/admin/logout — clear session, redirect to login.
 */

const {
  readSessionCookie,
  destroySession,
  clearSessionCookie,
} = require('../_shared/admin');

module.exports = async function (context, req) {
  const token = readSessionCookie(req);
  await destroySession(token).catch(() => {});
  context.res = {
    status: 302,
    headers: {
      Location: '/api/admin/login',
      'Set-Cookie': clearSessionCookie(),
      'Cache-Control': 'no-store',
    },
    body: '',
  };
};
