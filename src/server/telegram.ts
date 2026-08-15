/** Telegram Bot API helpers (server-only). */

export function getTelegramBotToken(): string | undefined {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  return token || undefined;
}

export function getTelegramAdminChatId(): string | undefined {
  const id = process.env.TELEGRAM_ADMIN_CHAT_ID?.trim();
  return id || undefined;
}

/** Bot username without @ — Next/Vite naming both supported */
export function getBotUsername(): string {
  return (
    process.env.NEXT_PUBLIC_BOT_USERNAME?.trim() ||
    process.env.VITE_BOT_USERNAME?.trim() ||
    process.env.TELEGRAM_BOT_USERNAME?.trim() ||
    'onlayntaklifnomabot'
  );
}

/** Env qiymatidan toza URL chiqaradi (noto‘g‘ri qo‘shilgan APP_URL= / qo‘shtirnoqlarni tozalaydi). */
function sanitizeAppUrl(raw?: string | null): string | undefined {
  if (!raw) return undefined;
  let v = raw.trim();
  // ""APP_URL=https://..." yoki "APP_URL=https://..." kabi xatolarni tuzatish
  v = v.replace(/^["']+|["']+$/g, '');
  v = v.replace(/^APP_URL\s*=\s*/i, '');
  v = v.replace(/^["']+|["']+$/g, '');
  const httpsMatch = v.match(/https?:\/\/[^\s"'\\]+/i);
  if (httpsMatch) v = httpsMatch[0];
  v = v.replace(/\/$/, '');
  if (!/^https?:\/\//i.test(v)) return undefined;
  return v;
}

export function publicAppBaseUrl(): string {
  const candidates = [
    process.env.APP_URL,
    process.env.PUBLIC_APP_URL,
    process.env.DIGITALOCEAN_APP_URL,
  ];
  for (const raw of candidates) {
    const v = sanitizeAppUrl(raw);
    if (!v) continue;
    // Production’da localhost webhook ishlamaydi — o‘tkazib yuboramiz
    if (/localhost|127\.0\.0\.1/i.test(v)) continue;
    return v;
  }
  const fallback = sanitizeAppUrl(process.env.APP_URL) || 'http://localhost:3000';
  return fallback;
}

export function guestPublicUrl(invitationId: string): string {
  return `${publicAppBaseUrl()}/v/${normalizeInvitationId(invitationId)}`;
}

/**
 * Telegram deep-link va turli yozuvlarni yagona ID ga keltirish.
 * OT_31707 / ot-31707 / #OT-31707 / OT31707 → OT-31707
 */
export function normalizeInvitationId(raw: string): string {
  let s = (raw || '').trim().replace(/^#/, '').toUpperCase();
  s = s.replace(/[\s_]+/g, '-');
  const compact = s.match(/^OT-?(\d{4,})$/);
  if (compact) return `OT-${compact[1]}`;
  return s;
}

/**
 * Deep-link payload: Telegram ba’zan `-` ni noqulay deb hisoblaydi —
 * underscore bilan yuboramiz, serverda qayta `-` ga aylantiramiz.
 */
export function botStartPayload(invitationId: string): string {
  return normalizeInvitationId(invitationId).replace(/-/g, '_');
}

export function botStartLink(invitationId: string, botUsername = getBotUsername()): string {
  const user = botUsername.replace(/^@/, '');
  return `https://t.me/${user}?start=${botStartPayload(invitationId)}`;
}

/** True when host linked via /start (numeric chat id). */
export function isNumericTelegramChatId(chatId?: string | null): boolean {
  if (!chatId) return false;
  return /^-?\d+$/.test(chatId.trim());
}

export interface TelegramSendResult {
  ok: boolean;
  skipped?: boolean;
  reason?: string;
  description?: string;
}

export type TelegramInlineButton =
  | { text: string; url: string }
  | { text: string; web_app: { url: string } };

export async function sendTelegramMessage(
  chatId: string,
  text: string,
  options?: {
    parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';
    buttons?: TelegramInlineButton[][];
  }
): Promise<TelegramSendResult> {
  const token = getTelegramBotToken();
  if (!token) {
    return { ok: false, skipped: true, reason: 'TELEGRAM_BOT_TOKEN topilmadi' };
  }
  if (!chatId?.trim()) {
    return { ok: false, skipped: true, reason: 'Chat ID bo‘sh' };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId.trim(),
        text,
        disable_web_page_preview: false,
        parse_mode: options?.parseMode,
        reply_markup: options?.buttons
          ? { inline_keyboard: options.buttons }
          : undefined,
      }),
    });

    const data = (await res.json()) as {
      ok?: boolean;
      description?: string;
    };

    if (!res.ok || !data.ok) {
      return {
        ok: false,
        reason: 'Telegram API xatosi',
        description: data.description || `HTTP ${res.status}`,
      };
    }

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Noma’lum xato';
    return { ok: false, reason: message };
  }
}

/** Production’da Telegram webhookni APP_URL ga bog‘lash */
export async function ensureTelegramWebhook(): Promise<void> {
  const token = getTelegramBotToken();
  const base = publicAppBaseUrl();
  if (!token) {
    console.warn('[telegram] TELEGRAM_BOT_TOKEN yo‘q — webhook o‘rnatilmadi');
    return;
  }
  if (process.env.TELEGRAM_SKIP_WEBHOOK === '1') {
    console.log('[telegram] TELEGRAM_SKIP_WEBHOOK=1 — o‘tkazib yuborildi');
    return;
  }
  if (!/^https:\/\//i.test(base) || /localhost|127\.0\.0\.1/i.test(base)) {
    console.error(
      `[telegram] WEBHOOK O‘RNATILMADI — APP_URL noto‘g‘ri: ${base}\n` +
        `  DigitalOcean → Settings → Env Variables ga qo‘ying:\n` +
        `  APP_URL=https://SIZNING-APP.ondigitalocean.app\n` +
        `  (localhost emas, https bilan). Keyin Redeploy qiling.`
    );
    return;
  }

  const hookUrl = `${base}/api/telegram/webhook`;
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: hookUrl,
        allowed_updates: ['message'],
        drop_pending_updates: false,
      }),
    });
    const data = (await res.json()) as { ok?: boolean; description?: string };
    if (data.ok) {
      console.log(`[telegram] webhook OK → ${hookUrl}`);
    } else {
      console.warn(`[telegram] setWebhook xato: ${data.description || res.status}`);
    }
  } catch (err) {
    console.warn('[telegram] setWebhook failed:', err instanceof Error ? err.message : err);
  }
}

export async function notifyAdminActivated(params: {
  invitationId: string;
  hostName: string;
  eventTitle: string;
}): Promise<TelegramSendResult> {
  const adminChatId = getTelegramAdminChatId();
  if (!adminChatId) {
    return { ok: false, skipped: true, reason: 'TELEGRAM_ADMIN_CHAT_ID topilmadi' };
  }

  const link = botStartLink(params.invitationId);
  const text =
    `✅ TAKLIFNOMA FAOLLASHTIRILDI!\n\n` +
    `🆔 ID: #${params.invitationId}\n` +
    `👤 Mezbon: ${params.hostName}\n` +
    `💌 Tadbir: ${params.eventTitle}\n\n` +
    `🔗 Bot Ulanish Linki (Mijozga yuborish uchun):\n` +
    `${link}`;

  return sendTelegramMessage(adminChatId, text);
}

export async function notifyHostLinked(params: {
  hostChatId: string;
  invitationId: string;
}): Promise<TelegramSendResult> {
  const liveUrl = guestPublicUrl(params.invitationId);
  const tmaUrl = `${publicAppBaseUrl()}/tma`;
  const botUser = getBotUsername().replace(/^@/, '');
  const startapp = botStartPayload(params.invitationId);
  const tmaDeep = `https://t.me/${botUser}?startapp=${startapp}`;
  const text =
    `🎉 Taklifnomangiz Telegramga ulandi!\n\n` +
    `🆔 #${params.invitationId}\n\n` +
    `🌐 Jonli havola (mehmonlarga yuboring):\n` +
    `${liveUrl}\n\n` +
    `📱 Mini App havola:\n${tmaDeep}\n\n` +
    `RSVP xabarlari shu chatga keladi.`;

  return sendTelegramMessage(params.hostChatId, text, {
    buttons: [
      [
        { text: '🌐 Mehmon sahifasi', url: liveUrl },
        { text: '📱 Mini App', web_app: { url: tmaUrl } },
      ],
    ],
  });
}

function formatUzDateTime(iso: string): string {
  try {
    return new Intl.DateTimeFormat('uz-UZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/** Tartibli, chiroyli RSVP xabari (Telegram) */
export function formatRsvpTelegramMessage(params: {
  invitationId: string;
  eventTitle: string;
  hostName?: string;
  guestName: string;
  role?: string;
  status: 'ATTENDING' | 'DECLINED' | string;
  plusOne?: number;
  wishes?: string;
  createdAt?: string;
  totalRsvps?: number;
  attendingCount?: number;
  declinedCount?: number;
}): string {
  const attending = params.status === 'ATTENDING';
  const header = attending
    ? '✅  YANGI RSVP — TASHRIF TASDIQLANDI'
    : '❌  YANGI RSVP — KELA OLMAYDI';
  const statusLine = attending ? '🟢 Holat: Boraman' : '🔴 Holat: Bora olmayman';
  const plus = Math.max(0, Number(params.plusOne) || 0);
  const guestsTotal = attending ? 1 + plus : 0;
  const wishes = (params.wishes || '').trim();
  const when = formatUzDateTime(params.createdAt || new Date().toISOString());

  const lines = [
    header,
    '────────────────────',
    `💌 Tadbir: ${params.eventTitle}`,
    `🆔 ID: #${params.invitationId}`,
  ];

  if (params.hostName?.trim()) {
    lines.push(`🏠 Mezbon: ${params.hostName.trim()}`);
  }

  lines.push(
    '',
    '👤 Mehmon ma’lumoti',
    `   • Ism: ${params.guestName || 'Mehmon'}`,
    `   • Yaqinlik: ${params.role || 'Mehmon'}`,
    `   ${statusLine}`,
  );

  if (attending) {
    lines.push(`   • Keladiganlar: ${guestsTotal} kishi` + (plus > 0 ? ` (+${plus})` : ''));
  }

  if (wishes) {
    lines.push('', '💬 Tilak / izoh', `   «${wishes}»`);
  }

  lines.push('', '📊 Statistika');
  if (typeof params.totalRsvps === 'number') {
    lines.push(`   • Jami javoblar: ${params.totalRsvps}`);
  }
  if (typeof params.attendingCount === 'number') {
    lines.push(`   • Boraman: ${params.attendingCount}`);
  }
  if (typeof params.declinedCount === 'number') {
    lines.push(`   • Kelmaydi: ${params.declinedCount}`);
  }

  lines.push('', `🕐 ${when}`, '────────────────────', 'Onlayn Taklifnoma');

  return lines.join('\n');
}

export async function notifyHostRsvp(params: {
  hostChatId: string;
  message: string;
}): Promise<TelegramSendResult> {
  return sendTelegramMessage(params.hostChatId, params.message);
}
