import { NextResponse } from 'next/server';
import { getTelegramBotToken } from '@lib/telegram/bot';
import { handleTelegramUpdate } from '@lib/telegram/webhookHandler';

export async function POST(req: Request) {
  if (!getTelegramBotToken()) {
    return NextResponse.json({ success: false, message: 'TELEGRAM_BOT_TOKEN sozlanmagan' }, { status: 503 });
  }

  try {
    const body = await req.json();
    const result = await handleTelegramUpdate(body);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook xatosi';
    console.error('[telegram/webhook]', message);
    return NextResponse.json({ ok: false, error: message });
  }
}
