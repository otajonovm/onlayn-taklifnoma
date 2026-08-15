import { NextResponse } from 'next/server';
import { publicAppBaseUrl, getBotUsername, getTelegramBotToken, getTelegramAdminChatId } from '@lib/telegram/notify';
import { checkDatabaseConnection } from '@lib/dbHealth';

export async function GET() {
  const db = await checkDatabaseConnection();

  return NextResponse.json({
    success: db.connected,
    invitations: db.invitationCount ?? 0,
    persistence: 'prisma/postgresql',
    database: {
      configured: db.configured,
      connected: db.connected,
      error: db.error,
    },
    appUrl: publicAppBaseUrl(),
    telegram: {
      tokenSet: Boolean(getTelegramBotToken()),
      adminChatSet: Boolean(getTelegramAdminChatId()),
      botUsername: getBotUsername(),
      webhookPath: '/api/telegram/webhook',
      tmaUrl: `${publicAppBaseUrl().replace(/\/$/, '')}/tma`,
      miniAppOpen: `https://t.me/${getBotUsername().replace(/^@/, '')}/app`,
    },
  });
}
