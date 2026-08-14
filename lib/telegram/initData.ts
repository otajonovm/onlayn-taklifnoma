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

export function parseStartParam(startParam?: string | null): {
  invitationId?: string;
  guestName?: string;
} {
  if (!startParam?.trim()) return {};
  const raw = startParam.trim().replace(/^#/, '');
  const parts = raw.split('_');
  const idPart = parts[0]?.replace(/-/g, '_');
  if (!idPart) return {};

  let invitationId = idPart.toUpperCase().replace(/_/g, '-');
  if (/^OT-?\d+$/.test(invitationId.replace(/-/g, ''))) {
    invitationId = invitationId.replace(/^OT-?/, 'OT-');
    if (!invitationId.includes('-')) {
      invitationId = `OT-${invitationId.replace('OT', '')}`;
    }
  }

  const guestName = parts.slice(1).join(' ').trim() || undefined;
  return { invitationId, guestName };
}
