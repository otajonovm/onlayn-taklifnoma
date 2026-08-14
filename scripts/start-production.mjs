import { execSync, spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const standaloneServer = join(root, '.next/standalone/server.js');

function runSync(command) {
  execSync(command, { stdio: 'inherit', cwd: root, env: process.env });
}

if (!process.env.DATABASE_URL?.trim()) {
  console.error('');
  console.error('❌ DATABASE_URL topilmadi!');
  console.error('   DigitalOcean → App → Resources → Add Database (PostgreSQL)');
  console.error('   yoki Settings → Environment Variables → DATABASE_URL qo‘shing.');
  console.error('   /api/health orqali holatni tekshiring.');
  console.error('');
} else {
  console.log('→ PostgreSQL schema sinxronlanmoqda (prisma db push)...');
  try {
    runSync('npx prisma db push --skip-generate');
    console.log('✓ Database schema tayyor');
  } catch {
    console.error('❌ prisma db push muvaffaqiyatsiz — DATABASE_URL va DB ulanishini tekshiring');
    process.exit(1);
  }
}

const port = process.env.PORT || '3000';

if (existsSync(standaloneServer)) {
  console.log(`→ Next.js standalone server (port ${port})...`);
  const child = spawn(process.execPath, ['server.js'], {
    cwd: join(root, '.next/standalone'),
    stdio: 'inherit',
    env: { ...process.env, PORT: port, HOSTNAME: '0.0.0.0' },
  });
  child.on('exit', (code) => process.exit(code ?? 1));
} else {
  console.log(`→ next start (port ${port})...`);
  runSync(`npx next start -p ${port}`);
}
