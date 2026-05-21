/**
 * Vercel Serverless Function — /api/auth
 * Accepts POST with JSON { password: "..." }
 * On success: sets a 30-day HttpOnly cookie and returns { ok: true }
 * On failure: returns 401 { ok: false }
 *
 * Set your password in Vercel → Project Settings → Environment Variables
 * Variable name: PORTFOLIO_PASSWORD
 * If not set, falls back to the hardcoded default below.
 */
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const CORRECT = process.env.PORTFOLIO_PASSWORD || 'Marina2026';
  const password = req.body?.password;

  if (password === CORRECT) {
    const THIRTY_DAYS = 60 * 60 * 24 * 30;
    res.setHeader(
      'Set-Cookie',
      `portfolio_auth=ok; Path=/; HttpOnly; SameSite=Strict; Max-Age=${THIRTY_DAYS}`
    );
    return res.status(200).json({ ok: true });
  }

  return res.status(401).json({ ok: false });
}
