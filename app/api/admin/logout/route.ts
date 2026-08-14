import { NextResponse } from 'next/server';
import { requireAdmin, revokeAdminToken } from '@lib/auth/admin';

export async function POST(req: Request) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;
  await revokeAdminToken(auth.token);
  return NextResponse.json({ success: true });
}
