import express from 'express';
import path from 'path';
import { config as loadEnv } from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { createApiApp } from './src/server/apiApp';

loadEnv({ path: '.env.local' });
loadEnv();

const PORT = Number(process.env.PORT) || 3000;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';

async function startServer() {
  const app = createApiApp();

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Onlayn Taklifnoma Server] Running on http://0.0.0.0:${PORT}`);
    console.log(`[Admin] login: ${ADMIN_USERNAME} (parol .env.local da)`);
  });
}

startServer();
