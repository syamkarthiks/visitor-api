export default async function handler(req, res) {
  try {
    // 🔐 Check password
    const key = req.headers.authorization;

    if (key !== "Bearer sym") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 📊 Fetch data from Supabase
    const response = await fetch(
      "https://cczcijtifrhihnpczfjt.supabase.co/rest/v1/visitors?select=*&order=time.desc",
      {
        headers: {
          "apikey": "sb_publishable_VvFlbW7pKR-6iH5gdarBcA_ZOgdpMuc",
          "Authorization": "Bearer sb_publishable_VvFlbW7pKR-6iH5gdarBcA_ZOgdpMuc",
          "Content-Type": "application/json"
        }
      }
    );

    const data = await response.json();

    // 🚀 Send data to frontend
    res.status(200).json(data);

  } catch (err) {
    console.error("DATA ERROR:", err);
    res.status(500).json({ error: "server error" });
  }
}
