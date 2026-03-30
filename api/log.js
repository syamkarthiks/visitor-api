export default async function handler(req, res) {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    let ip =
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.headers['x-real-ip'] ||
      "unknown";

    const body = req.method === "POST" ? req.body : {};
    const ua = body.ua || req.headers['user-agent'] || "Unknown";

    // 🌍 location (safe)
    let info = {};
    try {
      const r = await fetch(`https://ipwho.is/${ip}`);
      const data = await r.json();
      if (data.success) info = data;
    } catch {}

    // 📱 device
    let device = "Desktop";
    if (/android/i.test(ua)) device = "Android";
    if (/iPhone/i.test(ua)) device = "iPhone";
    if (/iPad/i.test(ua)) device = "iPad";

    // 🌐 browser
    let browser = "Unknown";
    if (ua.includes("Chrome")) browser = "Chrome";
    else if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";

    // 🔗 referrer
    let source = body.referrer || "Direct";

    const payload = {
      ip,
      isp: info.connection?.isp || "Unknown",
      city: info.city || "Unknown",
      region: info.region || "Unknown",

      device,
      browser,
      ua,

      battery: body.battery || "unknown",
      charging: body.charging || false,

      referrer: source,
      time: new Date().toISOString()
    };

    const response = await fetch(
      "https://cczcijtifrhihnpczfjt.supabase.co/rest/v1/visitors",
      {
        method: "POST",
        headers: {
          "apikey": "sb_publishable_VvFlbW7pKR-6iH5gdarBcA_ZOgdpMuc",
          "Authorization": "Bearer sb_publishable_VvFlbW7pKR-6iH5gdarBcA_ZOgdpMuc",
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify(payload)
      }
    );

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: "server error" });
  }
}
