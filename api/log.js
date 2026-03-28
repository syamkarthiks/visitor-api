export default async function handler(req, res) {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");

    // 🔥 1. Better IP detection (ADD HERE)
    let ip =
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.headers['x-real-ip'] ||
      req.headers['cf-connecting-ip'] ||
      "8.8.8.8";

    const ua = req.headers['user-agent'] || "unknown";

    // 🔥 2. Read frontend data (ADD HERE)
    const body = req.method === "POST" ? req.body : {};

    let info = {};
    try {
      const response = await fetch(`https://ipapi.co/${ip}/json`);
      info = await response.json();
    } catch {}

    // 🔥 3. Combine everything (EDIT HERE)
    const payload = {
      ip,
      country: info.country_name || "Unknown",
      city: info.city || "Unknown",
      isp: info.org || "Unknown",
      ua,

      // ✅ NEW DATA
      referrer: body.referrer || req.headers.referer || "Direct",
      page: body.page || "unknown",
      screen: body.screen || "unknown",
      dark: body.dark || false,
      network: body.network || "unknown",

      time: new Date().toISOString()
    };

    // 🔥 4. Send to Supabase
    await fetch("https://cczcijtifrhihnpczfjt.supabase.co/rest/v1/visitors", {
      method: "POST",
      headers: {
        "apikey": "sb_publishable_VvFlbW7pKR-6iH5gdarBcA_ZOgdpMuc",
        "Authorization": "Bearer YOUR_ANON_KEY",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
}
