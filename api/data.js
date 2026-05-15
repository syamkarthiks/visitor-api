export default async function handler(req, res) {

  // 🔐 Admin password protection
  const key = req.headers.authorization;

  if (key !== "Bearer SY4M") {
    return res.status(401).json({
      error: "Unauthorized"
    });
  }

  try {

    // 📊 Fetch latest visitors first
    const response = await fetch(
      "https://cczcijtifrhihnpczfjt.supabase.co/rest/v1/visitors?select=*&order=time.desc&limit=50",
      {
        headers: {
          "apikey": "sb_publishable_VvFlbW7pKR-6iH5gdarBcA_ZOgdpMuc",
          "Authorization": "Bearer sb_publishable_VvFlbW7pKR-6iH5gdarBcA_ZOgdpMuc"
        }
      }
    );

    const data = await response.json();

    // 🚫 Prevent caching
    res.setHeader("Cache-Control", "no-store");

    // ✅ Return data
    res.status(200).json(data);

  } catch (err) {

    // ❌ Error handling
    res.status(500).json({
      error: "Failed to fetch visitor data"
    });

  }
}
