import { NextResponse } from 'next/server';
import { createAdminSession, getAdminCredentials } from '@lib/auth/admin';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { username, password } = body as { username?: string; password?: string };
  const creds = getAdminCredentials();

  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    username.trim() !== creds.username ||
    password !== creds.password
  ) {
    return NextResponse.json({ success: false, message: 'Login yoki parol noto‘g‘ri' }, { status: 401 });
  }

  const token = await createAdminSession();
  return NextResponse.json({ success: true, token });
}
