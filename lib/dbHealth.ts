import { prisma } from '@lib/prisma';

export function hasDatabaseUrl(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export async function checkDatabaseConnection(): Promise<{
  configured: boolean;
  connected: boolean;
  invitationCount?: number;
  error?: string;
}> {
  if (!hasDatabaseUrl()) {
    return {
      configured: false,
      connected: false,
      error: 'DATABASE_URL muhit o‘zgaruvchisi sozlanmagan',
    };
  }

  try {
    const invitationCount = await prisma.invitation.count();
    return { configured: true, connected: true, invitationCount };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Database ulanish xatosi';
    return { configured: true, connected: false, error: message };
  }
}

export async function requireDatabase(): Promise<{ ok: true } | { ok: false; message: string }> {
  const status = await checkDatabaseConnection();
  if (!status.configured) {
    return {
      ok: false,
      message:
        'DATABASE_URL sozlanmagan. DigitalOcean → Settings → Environment Variables ga PostgreSQL connection string qo‘shing.',
    };
  }
  if (!status.connected) {
    return {
      ok: false,
      message: status.error || 'PostgreSQL bazasiga ulanib bo‘lmadi. prisma db push ishga tushiring.',
    };
  }
  return { ok: true };
}
