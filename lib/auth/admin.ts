import crypto from 'crypto';
import { prisma } from '@lib/prisma';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'taklifnoma2026';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function getAdminCredentials() {
  return { username: ADMIN_USERNAME, password: ADMIN_PASSWORD };
}

export async function createAdminSession(): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await prisma.adminSession.create({ data: { token, expiresAt } });
  return token;
}

export async function validateAdminToken(token: string | null): Promise<boolean> {
  if (!token) return false;
  const session = await prisma.adminSession.findUnique({ where: { token } });
  if (!session) return false;
  if (session.expiresAt < new Date()) {
    await prisma.adminSession.delete({ where: { token } }).catch(() => {});
    return false;
  }
  return true;
}

export async function revokeAdminToken(token: string): Promise<void> {
  await prisma.adminSession.deleteMany({ where: { token } });
}

export function extractBearer(req: Request): string | null {
  const h = req.headers.get('authorization');
  if (!h?.startsWith('Bearer ')) return null;
  return h.slice(7).trim() || null;
}

export async function requireAdmin(req: Request): Promise<{ ok: true; token: string } | { ok: false; response: Response }> {
  const token = extractBearer(req);
  const valid = await validateAdminToken(token);
  if (!valid || !token) {
    return {
      ok: false,
      response: Response.json(
        { success: false, message: 'Admin avtorizatsiyasi talab qilinadi' },
        { status: 401 }
      ),
    };
  }
  return { ok: true, token };
}
