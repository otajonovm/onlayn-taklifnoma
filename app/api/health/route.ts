import { NextResponse } from 'next/server';
import { publicAppBaseUrl, getBotUsername, getTelegramBotToken, getTelegramAdminChatId } from '@lib/telegram/notify';
import { prisma } from '@lib/prisma';

export async function GET() {
  const count = await prisma.invitation.count().catch(() => 0);
  return NextResponse.json({
    success: true,
    invitations: count,
    persistence: 'prisma/postgresql',
    appUrl: publicAppBaseUrl(),
    telegram: {
      tokenSet: Boolean(getTelegramBotToken()),
      adminChatSet: Boolean(getTelegramAdminChatId()),
      botUsername: getBotUsername(),
      webhookPath: '/api/telegram/webhook',
    },
  });
}
