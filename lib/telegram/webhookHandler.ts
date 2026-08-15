import {
  activateInvitation,
  linkTelegramChat,
} from '@lib/services/invitationService';
import {
  getTelegramAdminChatId,
  getBotUsername,
  normalizeInvitationId,
  notifyHostLinked,
  publicAppBaseUrl,
  sendTelegramMessage,
} from '@lib/telegram/notify';
import { tmaDeepLink, tmaEntryUrl } from '@lib/telegram/setup';

function miniAppButtons() {
  const tma = tmaEntryUrl();
  return [[{ text: '📱 Taklifnoma ochish', web_app: { url: tma } }]];
}

export async function handleTelegramUpdate(body: Record<string, unknown>) {
  const message = body.message as Record<string, unknown> | undefined;
  const text = typeof message?.text === 'string' ? message.text.trim() : '';
  const chatId = message?.chat as { id?: number } | undefined;
  const chatIdStr = chatId?.id != null ? String(chatId.id) : '';

  if (!text || !chatIdStr) {
    return { ok: true };
  }

  const adminChatId = getTelegramAdminChatId();
  const botUser = getBotUsername().replace(/^@/, '');
  const tmaOpen = tmaDeepLink();

  if (/^\/(id|myid)(?:@\w+)?$/i.test(text)) {
    await sendTelegramMessage(
      chatIdStr,
      `🆔 Sizning Telegram Chat ID:\n\n\`${chatIdStr}\`\n\n` +
        `DigitalOcean / .env ga yozing:\nTELEGRAM_ADMIN_CHAT_ID=${chatIdStr}`,
      { buttons: miniAppButtons() }
    );
    return { ok: true, action: 'id' };
  }

  const activateMatch = text.match(/^\/activate(?:@\w+)?\s+#?([A-Za-z0-9_-]+)$/i);
  if (activateMatch) {
    if (!adminChatId || chatIdStr !== adminChatId) {
      await sendTelegramMessage(chatIdStr, '⛔ Bu buyruq faqat admin uchun.', {
        buttons: miniAppButtons(),
      });
      return { ok: true, action: 'activate_denied' };
    }
    const result = await activateInvitation(activateMatch[1]);
    if (!result.ok) {
      await sendTelegramMessage(chatIdStr, `❌ ${result.message}`);
      return { ok: true, action: 'activate_fail' };
    }
    const { botStartLink, notifyAdminActivated } = await import('@lib/telegram/notify');
    await notifyAdminActivated({
      invitationId: result.invitation.id,
      hostName: result.invitation.hostName,
      eventTitle: result.invitation.eventTitle,
    });
    const hostLink = botStartLink(result.invitation.id);
    const guestTma = tmaDeepLink(result.invitation.id);
    const tmaWeb = `${tmaEntryUrl()}?startapp=${encodeURIComponent(
      result.invitation.id.replace(/-/g, '_')
    )}`;
    await sendTelegramMessage(
      chatIdStr,
      `✅ #${result.invitation.id} faollashtirildi.\n\n` +
        `👤 Mezbon ulash (yuboring):\n${hostLink}\n\n` +
        `📱 Mehmon Mini App:\n${guestTma}`,
      {
        buttons: [
          [
            { text: '👤 Mezbon ulash', url: hostLink },
            { text: '📱 Mini App', url: guestTma },
          ],
          [{ text: '📲 Ilova ichida', web_app: { url: tmaWeb } }],
        ],
      }
    );
    return { ok: true, action: 'activate' };
  }

  const startMatch = text.match(/^\/start(?:@\w+)?(?:\s+|_)?(.+)?$/i);
  if (!startMatch) {
    await sendTelegramMessage(
      chatIdStr,
      `Onlayn Taklifnoma botiga xush kelibsiz.\n\n` +
        `📱 Mini App: pastdagi «Taklifnoma» tugmasi yoki ${tmaOpen}\n` +
        `🔗 Mezbon ulash: admin yuborgan /start havolasini oching\n` +
        `🆔 Chat ID: /id\n` +
        `⚡ Admin: /activate OT-XXXXX`,
      { buttons: miniAppButtons() }
    );
    return { ok: true, action: 'help' };
  }

  const payload = (startMatch[1] || '').trim().replace(/^#/, '');
  if (!payload) {
    await sendTelegramMessage(
      chatIdStr,
      `Assalomu alaykum! 👋\n\n` +
        `1️⃣ Taklifnoma yaratish — «Taklifnoma» tugmasi yoki Mini App\n` +
        `2️⃣ Mezbon sifatida ulash — admin yuborgan havola:\n` +
        `https://t.me/${botUser}?start=OT_XXXXX\n\n` +
        `Chat ID kerak bo‘lsa: /id\n` +
        `Sayt: ${publicAppBaseUrl()}`,
      { buttons: miniAppButtons() }
    );
    return { ok: true, action: 'start' };
  }

  const invitationId = normalizeInvitationId(payload);
  const linked = await linkTelegramChat(invitationId, chatIdStr);
  if (!linked) {
    await sendTelegramMessage(
      chatIdStr,
      `❌ #${invitationId} bazada topilmadi.\n\nSayt: ${publicAppBaseUrl()}`,
      { buttons: miniAppButtons() }
    );
    return { ok: true, linked: false, invitationId };
  }

  await notifyHostLinked({ hostChatId: chatIdStr, invitationId: linked.id });
  return { ok: true, linked: true, invitationId: linked.id };
}
