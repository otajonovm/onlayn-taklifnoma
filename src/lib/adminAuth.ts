const TOKEN_KEY = 'ot_admin_token';

export function getAdminToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAdminToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

export function adminAuthHeaders(): HeadersInit {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function publicBotUsername(): string {
  return (
    process.env.NEXT_PUBLIC_BOT_USERNAME ||
    process.env.VITE_BOT_USERNAME ||
    'onlayntaklifnomabot'
  ).replace(/^@/, '');
}

/** Brauzer zaxira havolasi */
export function guestWebUrl(invitationId: string, origin = window.location.origin): string {
  return `${origin}/v/${invitationId}`;
}

/** Mehmonlarga yuboriladigan asosiy havola — Telegram Mini App (konvert) */
export function guestShareUrl(invitationId: string, _origin = window.location.origin): string {
  return tmaGuestUrl(invitationId, publicBotUsername());
}

/** Deep-link so host can /start and link their Telegram chat */
export function botStartUrl(invitationId: string, botUsername: string): string {
  const user = botUsername.replace(/^@/, '') || 'onlayntaklifnomabot';
  const payload = invitationId.replace(/^#/, '').toUpperCase().replace(/-/g, '_');
  return `https://t.me/${user}?start=${payload}`;
}

/** Mini App entry (Menu Button / Main App URL) */
export function tmaEntryUrl(origin = window.location.origin): string {
  return `${origin.replace(/\/$/, '')}/tma`;
}

/** Telegram Main Mini App deep link (requires BotFather Main App enabled) */
export function tmaGuestUrl(
  invitationId: string,
  botUsername: string,
  guestName?: string
): string {
  const user = botUsername.replace(/^@/, '') || 'onlayntaklifnomabot';
  const id = invitationId.replace(/^#/, '').toUpperCase().replace(/-/g, '_');
  const guest = guestName?.trim().replace(/\s+/g, '_') || '';
  const startapp = guest ? `${id}_${guest}` : id;
  const short = process.env.NEXT_PUBLIC_TMA_SHORT_NAME?.trim().replace(/^\//, '');
  if (short) {
    return `https://t.me/${user}/${short}?startapp=${encodeURIComponent(startapp)}`;
  }
  return `https://t.me/${user}?startapp=${encodeURIComponent(startapp)}`;
}

/** Host linked bot if telegramChatId is a numeric chat id */
export function isTelegramLinked(chatId?: string | null): boolean {
  if (!chatId) return false;
  return /^-?\d+$/.test(chatId.trim());
}
