export default async function handler(req, res) {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");

    // safer IP detection
    let ip = req.headers['x-forwarded-for'];
    if (ip) ip = ip.split(',')[0];
    if (!ip) ip = req.socket?.remoteAddress || "8.8.8.8";

    const ua = req.headers['user-agent'] || "unknown";

    let info = {};
    try {
      const response = await fetch(`https://ipapi.co/${ip}/json`);
      info = await response.json();
    } catch (e) {
      info = {};
    }

    const payload = {
      ip,
      country: info.country_name || "Unknown",
      city: info.city || "Unknown",
      isp: info.org || "Unknown",
      ua,
      referrer: req.headers.referer || "Direct",
      time: new Date().toISOString()
    };

    // send to supabase
    await fetch("https://cczcijtifrhihnpczfjt.supabase.co/rest/v1/visitors", {
      method: "POST",
      headers: {
        "apikey": "sb_publishable_VvFlbW7pKR-6iH5gdarBcA_ZOgdpMuc",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(payload)
    });

    res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
}
