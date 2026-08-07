/**
 * Local Telegram long-polling — webhook o‘rniga (localhost uchun).
 * Usage: npm run bot
 * Server (`npm run dev`) ham ishlashi kerak.
 */
import { config as loadEnv } from 'dotenv';

loadEnv({ path: '.env.local', quiet: true });
loadEnv({ quiet: true });

const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
const appUrl = (process.env.APP_URL || 'http://localhost:3000').replace(/\/$/, '');
const webhookUrl = `${appUrl}/api/telegram/webhook`;

if (!token) {
  console.error('❌ TELEGRAM_BOT_TOKEN .env.local da topilmadi');
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

  // Local polling uchun webhookni o‘chirish shart
  await tg('deleteWebhook', { drop_pending_updates: false });
  console.log('✅ Webhook o‘chirildi — long-polling yoqildi');
  console.log('👉 Botni oching: https://t.me/onlayntaklifnomabot');
  console.log('👉 Chat ID olish: botga /id yuboring\n');

  let offset = 0;
  for (;;) {
    try {
      const data = await tg<{
        result: Array<{ update_id: number } & Record<string, unknown>>;
      }>('getUpdates', {
        offset,
        timeout: 25,
        allowed_updates: ['message'],
      });

      for (const update of data.result || []) {
        offset = update.update_id + 1;
        const text =
          typeof (update as { message?: { text?: string } }).message?.text === 'string'
            ? (update as { message: { text: string } }).message.text
            : '';
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
