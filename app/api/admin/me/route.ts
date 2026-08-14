import { NextResponse } from 'next/server';
import { requireAdmin, getAdminCredentials } from '@lib/auth/admin';
import { getBotUsername, getTelegramBotToken, getTelegramAdminChatId } from '@lib/telegram/notify';

export async function GET(req: Request) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;
  return NextResponse.json({
    success: true,
    username: getAdminCredentials().username,
    botUsername: getBotUsername(),
    telegramConfigured: Boolean(getTelegramBotToken() && getTelegramAdminChatId()),
  });
}
