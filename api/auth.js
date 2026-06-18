export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const CORRECT = process.env.PORTFOLIO_PASSWORD;
  if (!CORRECT) {
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  const password = req.body?.password;

  if (password === CORRECT) {
    // Session cookie — expires when browser closes (no Max-Age)
    res.setHeader(
      'Set-Cookie',
      `portfolio_auth=ok; Path=/; HttpOnly; SameSite=Strict`
    );
    return res.status(200).json({ ok: true });
  }

  return res.status(401).json({ ok: false });
}
