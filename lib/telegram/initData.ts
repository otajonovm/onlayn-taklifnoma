import crypto from 'crypto';
import type { TelegramInitDataUser } from '@app-types/invitation';

export function validateTelegramInitData(initData: string, botToken: string): boolean {
  if (!initData?.trim() || !botToken) return false;

  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) return false;

  params.delete('hash');
  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
  const computed = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
  return computed === hash;
}

export function parseInitDataUser(initData: string): TelegramInitDataUser | null {
  try {
    const userJson = new URLSearchParams(initData).get('user');
    if (!userJson) return null;
    return JSON.parse(userJson) as TelegramInitDataUser;
  } catch {
    return null;
  }
}

/**
 * startapp / start_param → invitationId + ixtiyoriy guestName
 * Misollar: OT_47284 | OT-47284 | OT_47284_Sardor | OT-47284_Aziza_Karimova
 */
export function parseStartParam(startParam?: string | null): {
  invitationId?: string;
  guestName?: string;
} {
  if (!startParam?.trim()) return {};
  const raw = decodeURIComponent(startParam.trim().replace(/^#/, ''));

  const match = raw.match(/^OT[-_]?(\d{4,})(?:[_-](.+))?$/i);
  if (match) {
    const guestName = match[2]?.replace(/_/g, ' ').trim() || undefined;
    return {
      invitationId: `OT-${match[1]}`,
      guestName,
    };
  }

  const embedded = raw.match(/OT[-_]?(\d{4,})/i);
  if (embedded) {
    return { invitationId: `OT-${embedded[1]}` };
  }

  return {};
}
