import { NextResponse } from 'next/server';
import { getTelegramBotToken } from '@lib/telegram/bot';
import { validateTelegramInitData, parseInitDataUser } from '@lib/telegram/initData';

export async function POST(req: Request) {
  const token = getTelegramBotToken();
  if (!token) {
    return NextResponse.json({ success: false, message: 'Bot token sozlanmagan' }, { status: 503 });
  }

  const body = await req.json().catch(() => ({}));
  const initData = typeof body.initData === 'string' ? body.initData : '';
  if (!initData || !validateTelegramInitData(initData, token)) {
    return NextResponse.json({ success: false, message: 'initData noto‘g‘ri' }, { status: 401 });
  }

  const user = parseInitDataUser(initData);
  return NextResponse.json({
    success: true,
    user,
    telegramUserId: user?.id ? String(user.id) : undefined,
  });
}
