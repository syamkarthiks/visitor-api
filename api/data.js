export default async function handler(req, res) {
  const key = req.headers.authorization;

  if (key !== "Bearer SY4M") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const data = await fetch(
    "https://cczcijtifrhihnpczfjt.supabase.co/rest/v1/visitors?select=*&order=time.desc",
    {
      headers: {
        "apikey": "sb_publishable_VvFlbW7pKR-6iH5gdarBcA_ZOgdpMuc",
        "Content-Type": "application/json"
      }
    }
  ).then(r => r.json());

  res.json(data);
}
