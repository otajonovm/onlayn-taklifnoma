/**
 * Telegram bot + Mini App bir martalik sozlash.
 *
 * Usage:
 *   APP_URL=https://octopus-app-ecfvb.ondigitalocean.app npm run bot:setup
 *
 * Nima qiladi:
 *  - webhook o‘rnatadi
 *  - /start /id /activate buyruqlarini yozadi
 *  - Menu Button → Mini App (/tma)
 *  - bot tavsifini yangilaydi
 *  - BotFather Main App uchun nusxa olish uchun URL chiqaradi
 */
import { config as loadEnv } from 'dotenv';

loadEnv({ path: '.env.local', quiet: true });
loadEnv({ quiet: true });

async function main() {
  const { setupTelegramBot } = await import('../lib/telegram/setup');
  const result = await setupTelegramBot();

  console.log('\n=== Telegram bot sozlash ===\n');
  for (const step of result.steps) {
    console.log(`${step.ok ? '✅' : '❌'} ${step.name}: ${step.detail || ''}`);
  }

  console.log('\n=== Nusxa oling (BotFather / ulashish) ===\n');
  console.log(`Bot chat:     ${result.links.botChat}`);
  console.log(`Mini App URL: ${result.links.tmaUrl}`);
  console.log(`Ochish:       ${result.links.miniAppOpen}`);
  console.log(`Webhook:      ${result.links.webhook}`);
  console.log('\nBotFather → Mini Apps → Main App (qo‘lda, bir marta):');
  for (const line of result.links.botFatherHints) {
    console.log(`  • ${line}`);
  }

  if (!result.configured.adminChat) {
    console.log('\n⚠ TELEGRAM_ADMIN_CHAT_ID yo‘q — botga /id yuboring va env ga qo‘ying.');
  }

  if (!result.success) {
    console.error('\n❌ Ba’zi qadamlar muvaffaqiyatsiz. Env va APP_URL ni tekshiring.');
    process.exit(1);
  }

  console.log('\n✅ Tayyor. Telegram’da botni oching → pastdagi «Taklifnoma» Menu tugmasi.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
