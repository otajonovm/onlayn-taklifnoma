import { NextResponse } from 'next/server';
import { requireAdmin } from '@lib/auth/admin';
import {
  activateInvitation,
} from '@lib/services/invitationService';
import {
  notifyAdminActivated,
  botStartLink,
  guestPublicUrl,
} from '@lib/telegram/notify';

export async function POST(req: Request) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => ({}));
  const invitationId = typeof body.invitationId === 'string' ? body.invitationId : '';
  if (!invitationId.trim()) {
    return NextResponse.json({ success: false, message: 'invitationId majburiy' }, { status: 400 });
  }

  const result = await activateInvitation(invitationId);
  if (!result.ok) {
    return NextResponse.json({ success: false, message: result.message }, { status: result.status });
  }

  const telegram = await notifyAdminActivated({
    invitationId: result.invitation.id,
    hostName: result.invitation.hostName,
    eventTitle: result.invitation.eventTitle,
  });

  return NextResponse.json({
    success: true,
    message: `Taklifnoma #${result.invitation.id} muvaffaqiyatli faollashtirildi!`,
    data: result.invitation,
    guestLink: `/v/${result.invitation.id}`,
    guestPublicUrl: guestPublicUrl(result.invitation.id),
    botLink: botStartLink(result.invitation.id),
    telegram,
  });
}
