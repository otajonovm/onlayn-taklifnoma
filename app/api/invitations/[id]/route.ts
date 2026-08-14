import { NextResponse } from 'next/server';
import { requireAdmin, validateAdminToken, extractBearer } from '@lib/auth/admin';
import { requireDatabase } from '@lib/dbHealth';
import { getInvitationDTO, updateInvitation } from '@lib/services/invitationService';
import type { CreateInvitationInput } from '@app-types/invitation';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const db = await requireDatabase();
  if (!db.ok) {
    return NextResponse.json({ success: false, message: db.message }, { status: 503 });
  }

  const { id } = await params;
  const invitation = await getInvitationDTO(id);
  if (!invitation) {
    return NextResponse.json({ success: false, message: 'Taklifnoma topilmadi' }, { status: 404 });
  }

  const url = new URL(req.url);
  const isPreview = url.searchParams.get('preview') === '1' || url.searchParams.get('preview') === 'true';
  const token = extractBearer(req);
  const isAdmin = await validateAdminToken(token);

  if (invitation.status === 'PENDING' && !isPreview && !isAdmin) {
    return NextResponse.json(
      {
        success: false,
        code: 'NOT_ACTIVATED',
        message: 'Bu taklifnoma hali aktivlashtirilmagan. Mehmon havolasi ishlamaydi.',
      },
      { status: 403 }
    );
  }

  return NextResponse.json({ success: true, data: invitation });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await requireDatabase();
    if (!db.ok) {
      return NextResponse.json({ success: false, message: db.message }, { status: 503 });
    }

    const { id } = await params;
    const token = extractBearer(req);
    const isAdmin = await validateAdminToken(token);
    const body = (await req.json()) as Partial<CreateInvitationInput>;
    const result = await updateInvitation(id, body, isAdmin);
    if (!result.ok) {
      return NextResponse.json({ success: false, message: result.message }, { status: result.status });
    }
    return NextResponse.json({ success: true, data: result.data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server xatosi';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
