/** Safe JSON fetch — avoids "Unexpected token T" when API returns HTML 404 */
export async function fetchJson<T = unknown>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<{ ok: boolean; status: number; data: T }> {
  const res = await fetch(input, init);
  const text = await res.text();

  let data: T;
  try {
    data = text ? (JSON.parse(text) as T) : ({} as T);
  } catch {
    throw new Error(
      res.status === 404
        ? 'API topilmadi (404). Vercel’da /api deploy qilinganligini tekshiring.'
        : `Server JSON emas javob qaytardi (HTTP ${res.status}).`
    );
  }

  return { ok: res.ok, status: res.status, data };
}
