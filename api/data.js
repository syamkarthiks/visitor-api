export default async function handler(req, res) {

  const key = req.headers.authorization;

  if (key !== "Bearer SY4M") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const response = await fetch(
    "https://cczcijtifrhihnpczfjt.supabase.co/rest/v1/visitors?select=*&order=time.desc",
    {
      headers: {
        "apikey": "sb_publishable_VvFlbW7pKR-6iH5gdarBcA_ZOgdpMuc",
        "Authorization": "Bearer sb_publishable_VvFlbW7pKR-6iH5gdarBcA_ZOgdpMuc"
      }
    }
  );

  const data = await response.json();

  res.json(data);
}
