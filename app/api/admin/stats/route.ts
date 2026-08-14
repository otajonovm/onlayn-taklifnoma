import { NextResponse } from 'next/server';
import { requireAdmin } from '@lib/auth/admin';
import { getAdminStats } from '@lib/services/invitationService';
import { getBotUsername, getTelegramBotToken, getTelegramAdminChatId } from '@lib/telegram/notify';

export async function GET(req: Request) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;
  const stats = await getAdminStats();
  return NextResponse.json({
    success: true,
    stats,
    botUsername: getBotUsername(),
    telegramConfigured: Boolean(getTelegramBotToken() && getTelegramAdminChatId()),
  });
}
