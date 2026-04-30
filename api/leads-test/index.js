module.exports = async function (context, req) {
  context.res = {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ok: true,
      time: new Date().toISOString(),
      hasAdminUser: !!process.env.ADMIN_USERNAME,
      hasAdminPass: !!process.env.ADMIN_PASSWORD,
      hasLeadsConn: !!process.env.LEADS_STORAGE_CONNECTION_STRING,
      node: process.version,
    }),
  };
};
