import { NextResponse } from 'next/server';
import { prisma } from '@lib/prisma';
import { activateInvitation } from '@lib/services/invitationService';

/** Click / Payme webhook stub — transactionId va invitationId bilan aktivlash */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const provider = (body.provider as string) || 'unknown';
  const transactionId = (body.transaction_id || body.transactionId) as string | undefined;
  const invitationId = (body.invitation_id || body.invitationId) as string | undefined;
  const status = (body.status as string) || 'PENDING';

  if (!transactionId) {
    return NextResponse.json({ success: false, message: 'transactionId majburiy' }, { status: 400 });
  }

  await prisma.payment.upsert({
    where: { transactionId },
    create: {
      provider,
      transactionId,
      invitationId: invitationId || 'UNKNOWN',
      status,
      rawPayload: body as object,
    },
    update: {
      status,
      rawPayload: body as object,
    },
  });

  if (invitationId && (status === 'PAID' || status === 'COMPLETED' || status === 'success')) {
    await activateInvitation(invitationId);
    await prisma.invitation.update({
      where: { id: invitationId.toUpperCase() },
      data: { paymentId: transactionId, paidAt: new Date() },
    }).catch(() => {});
  }

  return NextResponse.json({ success: true, received: true });
}
