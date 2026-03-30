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
    const ua = body.ua || req.headers['user-agent'] || "unknown";

    // 🌐 location
    let info = {};
    try {
      const r = await fetch(`https://ipapi.co/${ip}/json/`);
      info = await r.json();
    } catch {}

    // 📱 device
    let device = "Desktop";
    if (/android/i.test(ua)) device = "Android";
    if (/iPhone/i.test(ua)) device = "iPhone";
    if (/iPad/i.test(ua)) device = "iPad";

    // 🌍 browser
    let browser = "Unknown";
    if (ua.includes("Chrome")) browser = "Chrome";
    if (ua.includes("Firefox")) browser = "Firefox";
    if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";

    // 🔗 referrer
    let source = body.referrer || "Direct";

    const payload = {
      ip,
      isp: info.org || "Unknown",
      city: info.city || "Unknown",
      region: info.region || "Unknown",

      device,
      browser,
      ua,

      battery: body.battery || "unknown",
      charging: body.charging || false,

      referrer: source,

      // ✅ FIXED time format
      time: new Date().toISOString()
    };

    await fetch("https://cczcijtifrhihnpczfjt.supabase.co/rest/v1/visitors", {
      method: "POST",
      headers: {
        "apikey": "sb_publishable_VvFlbW7pKR-6iH5gdarBcA_ZOgdpMuc",
        "Authorization": "Bearer sb_publishable_VvFlbW7pKR-6iH5gdarBcA_ZOgdpMuc",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: "server error" });
  }
}
