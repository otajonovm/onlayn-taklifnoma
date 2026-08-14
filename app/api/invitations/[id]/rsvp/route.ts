import { NextResponse } from 'next/server';
import { prisma } from '@lib/prisma';
import { findInvitationById } from '@lib/services/invitationService';
import { mapRsvpToDTO, toPrismaRsvpStatus } from '@lib/mappers/invitation';
import {
  formatRsvpTelegramMessage,
  isNumericTelegramChatId,
  notifyHostRsvp,
} from '@lib/telegram/notify';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params;
  const invitation = await findInvitationById(rawId);
  if (!invitation) {
    return NextResponse.json({ success: false, message: 'Taklifnoma topilmadi' }, { status: 404 });
  }

  if (invitation.status !== 'ACTIVE') {
    return NextResponse.json(
      {
        success: false,
        code: 'NOT_ACTIVATED',
        message: 'Taklifnoma hali aktiv emas. RSVP qabul qilinmaydi.',
      },
      { status: 403 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const { guestName, role, status, plusOne, wishes } = body as Record<string, unknown>;

  const newRsvp = await prisma.rsvp.create({
    data: {
      invitationId: invitation.id,
      guestName: (guestName as string) || 'Mehmon',
      role: (role as string) || 'Mehmon',
      status: toPrismaRsvpStatus((status as string) || 'ATTENDING'),
      plusOne: Number(plusOne) || 0,
      wishes: (wishes as string) || '',
    },
  });

  const allRsvps = await prisma.rsvp.findMany({ where: { invitationId: invitation.id } });
  const attendingCount = allRsvps.filter((r) => r.status === 'ATTENDING').length;
  const declinedCount = allRsvps.filter((r) => r.status === 'DECLINED').length;

  const logLine = formatRsvpTelegramMessage({
    invitationId: invitation.id,
    eventTitle: invitation.eventTitle,
    hostName: invitation.hostName,
    guestName: newRsvp.guestName,
    role: newRsvp.role || undefined,
    status: newRsvp.status,
    plusOne: newRsvp.plusOne,
    wishes: newRsvp.wishes || undefined,
    createdAt: newRsvp.createdAt.toISOString(),
    totalRsvps: allRsvps.length,
    attendingCount,
    declinedCount,
  });

  const telegramResult = isNumericTelegramChatId(invitation.telegramChatId)
    ? await notifyHostRsvp({
        hostChatId: invitation.telegramChatId!,
        message: logLine,
      })
    : { ok: false, skipped: true, reason: 'Chat ulanmagan' };

  return NextResponse.json({
    success: true,
    message: 'Tashrifingiz muvaffaqiyatli qabul qilindi!',
    data: mapRsvpToDTO(newRsvp),
    telegramSimulatedLog: logLine,
    telegram: telegramResult,
  });
}
