import { createApiApp } from '../src/server/apiApp';

/** Vercel catch-all: /api/* → Express app */
const app = createApiApp();
export default app;
