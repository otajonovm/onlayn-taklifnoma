import express from 'express';
import http from 'http';
import path from 'path';
import { config as loadEnv } from 'dotenv';
import { createApiApp } from './src/server/apiApp';
import { describePersistence } from './src/server/invitationStore';

loadEnv({ path: '.env.local' });
loadEnv();

const PORT = Number(process.env.PORT) || 3000;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  const app = createApiApp();
  const httpServer = http.createServer(app);

  if (isProduction) {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // Imported lazily so production never loads Vite (a devDependency-sized module)
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        // Share Express HTTP server so HMR doesn't bind fixed :24678
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
    console.log(`[Admin] login: ${ADMIN_USERNAME} (parol .env da)`);
  });
}

// Keep the process alive on unexpected errors; a crash turns every in-flight
// request into an opaque platform 500 page.
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
