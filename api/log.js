export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const ip =
    req.headers['x-forwarded-for'] ||
    req.socket.remoteAddress ||
    "unknown";

  const ua = req.headers['user-agent'] || "unknown";

  let info = {};
  try {
    info = await fetch(`https://ipapi.co/${ip}/json`)
      .then(r => r.json());
  } catch {}

  const payload = {
    ip,
    country: info.country_name || "Unknown",
    city: info.city || "Unknown",
    isp: info.org || "Unknown",
    ua,
    referrer: req.headers.referer || "Direct",
    time: new Date().toISOString()
  };

  await fetch("https://cczcjjtifrihhnpczfjt.supabase.co/rest/v1/visitors", {
    method: "POST",
    headers: {
      "apikey": "sb_publishable_VvFlbW7pKR-6iH5gdarBcA_ZOgdpMuc",
      "Content-Type": "application/json",
      "Prefer": "return=minimal"
    },
    body: JSON.stringify(payload)
  });

  res.json({ success: true });
}
