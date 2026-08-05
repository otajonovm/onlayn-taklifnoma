import type { IncomingMessage, ServerResponse } from 'http';
import { createApiApp } from './apiApp';

/**
 * Prebundled entry for Vercel serverless (api/index.cjs).
 *
 * Vite projects on Vercel do NOT support Next.js-style [...path] catch-alls.
 * All /api/* traffic is rewritten to /api (this file). Export a plain
 * (req, res) function so the Node runtime dispatcher cannot mis-detect Express.
 */
const app = createApiApp();

function restoreOriginalUrl(req: IncomingMessage): void {
  // Rewrites select this function; keep the browser path so Express routes match.
  const forwarded = req.headers['x-forwarded-uri'] || req.headers['x-invoke-path'];
  if (typeof forwarded === 'string' && forwarded.startsWith('/api')) {
    const queryIndex = req.url?.indexOf('?') ?? -1;
    const query = queryIndex >= 0 ? req.url!.slice(queryIndex) : '';
    const pathOnly = forwarded.split('?')[0];
    req.url = pathOnly + (query && !forwarded.includes('?') ? query : forwarded.includes('?') ? '?' + forwarded.split('?')[1] : '');
  }
}

export default function handler(req: IncomingMessage, res: ServerResponse): void {
  restoreOriginalUrl(req);
  app(req as never, res as never);
}
