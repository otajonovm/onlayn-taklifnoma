import { cpSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const standaloneDir = join(root, '.next/standalone');

if (!existsSync(join(standaloneDir, 'server.js'))) {
  console.log('[standalone] server.js topilmadi — asset copy o‘tkazib yuborildi');
  process.exit(0);
}

cpSync(join(root, '.next/static'), join(standaloneDir, '.next/static'), { recursive: true });
cpSync(join(root, 'public'), join(standaloneDir, 'public'), { recursive: true });

console.log('[standalone] static va public nusxalandi');
