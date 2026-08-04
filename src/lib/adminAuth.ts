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

/** Guest share link — only valid when invitation is ACTIVE */
export function guestShareUrl(invitationId: string, origin = window.location.origin): string {
  return `${origin}/v/${invitationId}`;
}
