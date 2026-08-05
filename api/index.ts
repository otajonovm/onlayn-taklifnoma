import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApiApp } from '../src/server/apiApp';

/**
 * Main API gateway for Vite-on-Vercel.
 * vercel.json rewrites /api/* → /api/index (catch-all is Next.js-only).
 */
const app = createApiApp();

export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}
