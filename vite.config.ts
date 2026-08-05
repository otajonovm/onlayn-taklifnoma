import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  const disableHmr = process.env.DISABLE_HMR === 'true';

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      // HMR websocket is attached to Express in server.ts (hmr.server).
      // Only disable here for AI Studio / agent edit sessions.
      ...(disableHmr ? { hmr: false as const, watch: null } : {}),
    },
  };
});
