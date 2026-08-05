import type { IncomingMessage, ServerResponse } from 'http';
import { createApiApp } from './apiApp';

/**
 * Prebundled entry for Vercel serverless.
 * Exporting a plain (req, res) function avoids Express-as-default-export
 * dispatcher crashes (FUNCTION_INVOCATION_FAILED).
 */
const app = createApiApp();

export default function handler(req: IncomingMessage, res: ServerResponse): void {
  app(req as never, res as never);
}
