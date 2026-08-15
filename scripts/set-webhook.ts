/**
 * @deprecated Prefer: npm run bot:setup
 * Production webhook o‘rnatish (bir marta yoki deploydan keyin).
 * Usage:
 *   APP_URL=https://your-app.ondigitalocean.app npm run bot:webhook
 */
import { config as loadEnv } from 'dotenv';

loadEnv({ path: '.env.local', quiet: true });
loadEnv({ quiet: true });

console.log('ℹ To‘liq sozlash uchun: npm run bot:setup\n');

const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
const appUrl = (process.env.APP_URL || '').replace(/\/$/, '');

if (!token) {
  console.error('❌ TELEGRAM_BOT_TOKEN yo‘q');
  process.exit(1);
}
if (!/^https:\/\//i.test(appUrl) || /localhost|127\.0\.0\.1/i.test(appUrl)) {
  console.error('❌ APP_URL https production manzil bo‘lishi kerak');
  console.error(`   Hozirgi: ${appUrl || '(bo‘sh)'}`);
  console.error('   Misole: APP_URL=https://octopus-app-ecfvb.ondigitalocean.app npm run bot:setup');
  process.exit(1);
}

const hookUrl = `${appUrl}/api/telegram/webhook`;

async function main() {
  const setRes = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: hookUrl,
      allowed_updates: ['message'],
      drop_pending_updates: true,
    }),
  });
  const setData = (await setRes.json()) as { ok?: boolean; description?: string };
  console.log('setWebhook:', setData);

  const infoRes = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`);
  const infoData = await infoRes.json();
  console.log('getWebhookInfo:', JSON.stringify(infoData, null, 2));

  if (setData.ok) {
    console.log(`\n✅ Bot serverga ulandi → ${hookUrl}`);
    console.log('👉 Keyingi qadam: npm run bot:setup (Menu Button + buyruqlar)');
  } else {
    console.error('\n❌ Webhook o‘rnatilmadi:', setData.description);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
