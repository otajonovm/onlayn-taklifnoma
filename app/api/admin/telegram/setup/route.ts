import { NextResponse } from 'next/server';
import { requireAdmin } from '@lib/auth/admin';
import { getTelegramSetupStatus, setupTelegramBot } from '@lib/telegram/setup';

/** GET — holat + nusxa olish uchun havolalar */
export async function GET(req: Request) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const status = await getTelegramSetupStatus();
  return NextResponse.json({ success: true, ...status });
}

/** POST — webhook, buyruqlar, Menu Button (Mini App) ni bir marta sozlash */
export async function POST(req: Request) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const result = await setupTelegramBot();
  return NextResponse.json({
    ...result,
    message: result.success
      ? 'Bot sozlandi. Telegram’da «Taklifnoma» Menu tugmasini tekshiring.'
      : 'Ba’zi qadamlar xato. Qadamlarni ko‘ring.',
  });
}
