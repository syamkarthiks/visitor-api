export default async function handler(req, res) {
  const key = req.headers.authorization;

  if (key !== "Bearer SYAM_SECRET") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const data = await fetch(
    "https://cczcijtifrhihnpczfjt.supabase.co",
    {
      headers: {
        "apikey": "sb_publishable_VvFlbW7pKR-6iH5gdarBcA_ZOgdpMuc"
      }
    }
  ).then(r => r.json());

  res.json(data);
}
