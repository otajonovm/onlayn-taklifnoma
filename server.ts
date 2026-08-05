import express from 'express';
import http from 'http';
import path from 'path';
import { config as loadEnv } from 'dotenv';
import { createApiApp } from './src/server/apiApp';
import { describePersistence } from './src/server/invitationStore';

// Local only — App Platform / Vercel inject env vars into process.env directly
loadEnv({ path: '.env.local', quiet: true });
loadEnv({ quiet: true });

const PORT = Number(process.env.PORT) || 3000;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
// App Platform may leave NODE_ENV empty; `npm start` runs dist/server.cjs
const isProduction =
  process.env.NODE_ENV === 'production' ||
  Boolean(process.env.APP_URL) ||
  Boolean(process.env.DIGITALOCEAN_APP_LIFECYCLE) ||
  (process.argv[1] || '').includes('server.cjs');

async function startServer() {
  const app = createApiApp();
  const httpServer = http.createServer(app);

  if (isProduction) {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false }));
    // SPA fallback — must stay AFTER /api routes from createApiApp()
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(
      `[Onlayn Taklifnoma] ${isProduction ? 'production' : 'development'} on http://0.0.0.0:${PORT}`
    );
    console.log(`[Storage] ${describePersistence()}`);
    console.log(`[Admin] username=${ADMIN_USERNAME}`);
  });
}

process.on('unhandledRejection', (err) => {
  console.error('[unhandledRejection]', err);
});

process.on('uncaughtException', (err) => {
  console.error('[uncaughtException]', err);
});

startServer().catch((err) => {
  console.error('[startup failed]', err);
  process.exit(1);
});
