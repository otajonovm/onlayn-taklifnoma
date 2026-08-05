import type { VercelRequest, VercelResponse } from '@vercel/node';

/** Minimal canary — if this 404s, Vercel is not deploying /api at all. */
export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    success: true,
    message: 'API ishlayapti',
    runtime: 'vercel',
  });
}
