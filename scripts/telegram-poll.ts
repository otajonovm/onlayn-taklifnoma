/**
 * Local Telegram long-polling — FAQAT localhost uchun.
 * Usage: npm run bot   (APP_URL=http://localhost:3000)
 *
 * DIQQAT: Production (DigitalOcean) da `npm run bot` ISHLATMANG —
 * u webhookni o‘chirib, production ID larni lokal bazadan qidiradi.
 * Production: server startida setWebhook avtomatik.
 */
import { config as loadEnv } from 'dotenv';

loadEnv({ path: '.env.local', quiet: true });
loadEnv({ quiet: true });

const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
const appUrl = (process.env.APP_URL || 'http://localhost:3000').replace(/\/$/, '');
const webhookUrl = `${appUrl}/api/telegram/webhook`;
const isLocal = /localhost|127\.0\.0\.1/i.test(appUrl);

if (!token) {
  console.error('❌ TELEGRAM_BOT_TOKEN .env.local da topilmadi');
  process.exit(1);
}

if (!isLocal) {
  console.error('❌ npm run bot faqat lokal APP_URL uchun.');
  console.error(`   Hozirgi APP_URL=${appUrl}`);
  console.error('   Production’da webhook server o‘zi o‘rnatadi. Lokal pollingni to‘xtating.');
  process.exit(1);
}

async function tg<T>(method: string, body?: Record<string, unknown>): Promise<T> {
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = (await res.json()) as T & { ok?: boolean; description?: string };
  if (!(data as { ok?: boolean }).ok) {
    throw new Error((data as { description?: string }).description || method);
  }
  return data;
}

async function forwardUpdate(update: unknown) {
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(update),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Webhook ${res.status}: ${text.slice(0, 200)}`);
  }
}

async function main() {
  const me = await tg<{ result: { username?: string; first_name?: string } }>('getMe');
  console.log(`🤖 Bot: @${me.result.username || '?'} (${me.result.first_name || ''})`);
  console.log(`📡 Updates → ${webhookUrl}`);
  console.log('⚠️  Lokal rejim: production webhook vaqtincha o‘chiriladi.');
  console.log('    DO da ishlash uchun bu skriptni TO‘XTATING va deploy qiling.\n');

  await tg('deleteWebhook', { drop_pending_updates: false });
  console.log('✅ Long-polling yoqildi');
  console.log('👉 https://t.me/onlayntaklifnomabot  |  /id\n');

  let offset = 0;
  for (;;) {
    try {
      const data = await tg<{
        result: Array<{
          update_id: number;
          message?: { text?: string };
        }>;
      }>('getUpdates', {
        offset,
        timeout: 25,
        allowed_updates: ['message'],
      });

      for (const update of data.result || []) {
        offset = update.update_id + 1;
        const text = typeof update.message?.text === 'string' ? update.message.text : '';
        console.log(`← update #${update.update_id}${text ? `: ${text}` : ''}`);
        try {
          await forwardUpdate(update);
        } catch (err) {
          console.error('  forward xato:', err instanceof Error ? err.message : err);
          console.error('  Avval `npm run dev` ishlayotganiga ishonch hosil qiling.');
        }
      }
    } catch (err) {
      console.error('getUpdates xato:', err instanceof Error ? err.message : err);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
