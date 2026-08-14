import { NextResponse } from 'next/server';
import { requireAdmin } from '@lib/auth/admin';
import { requireDatabase } from '@lib/dbHealth';
import { listInvitations, createInvitation } from '@lib/services/invitationService';
import type { CreateInvitationInput } from '@app-types/invitation';

export async function GET(req: Request) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;
  const db = await requireDatabase();
  if (!db.ok) {
    return NextResponse.json({ success: false, message: db.message }, { status: 503 });
  }
  const data = await listInvitations();
  return NextResponse.json({ success: true, data });
}

export async function POST(req: Request) {
  try {
    const db = await requireDatabase();
    if (!db.ok) {
      return NextResponse.json({ success: false, message: db.message }, { status: 503 });
    }

    const body = (await req.json()) as CreateInvitationInput;
    const data = await createInvitation(body);
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server xatosi';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
