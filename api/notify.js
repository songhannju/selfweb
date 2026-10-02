// Vercel serverless function: forwards a visit ping to ntfy so the topic never ships to the browser.
// Set NTFY_TOPIC (and optionally NTFY_SERVER, NTFY_TOKEN) in Vercel → Project → Settings → Environment Variables.
const PAGES = new Set(['resume', 'blog']);
const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse/i;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const topic = process.env.NTFY_TOPIC;
  if (!topic) return res.status(500).json({ error: 'NTFY_TOPIC is not set' });

  const userAgent = req.headers['user-agent'] || '';
  if (BOT.test(userAgent)) return res.status(204).end();

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body || {};
  const page = PAGES.has(body.page) ? body.page : 'resume';
  const referrer = String(body.referrer || '').slice(0, 120);
  const city = decodeURIComponent(req.headers['x-vercel-ip-city'] || '');
  const country = req.headers['x-vercel-ip-country'] || '';
  const where = [city, country].filter(Boolean).join(', ') || 'unknown location';
  const device = /mobile/i.test(userAgent) ? 'phone' : 'desktop';

  const lines = [`Page: ${page}`, `From: ${where} (${device})`];
  if (referrer) lines.push(`Referrer: ${referrer}`);

  const headers = { Title: 'Someone opened your website', Tags: 'eyes', Priority: 'default' };
  if (process.env.NTFY_TOKEN) headers.Authorization = `Bearer ${process.env.NTFY_TOKEN}`;

  try {
    const server = (process.env.NTFY_SERVER || 'https://ntfy.sh').replace(/\/$/, '');
    const response = await fetch(`${server}/${encodeURIComponent(topic)}`, { method: 'POST', headers, body: lines.join('\n') });
    return res.status(response.ok ? 204 : 502).end();
  } catch {
    return res.status(502).end();
  }
}

function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}
