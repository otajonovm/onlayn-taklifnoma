/** Sana + ixtiyoriy vaqt (HH:mm) — vaqt bo‘sh bo‘lsa taklifnomada ko‘rinmaydi */

export function splitDateTimeLocal(value?: string): { date: string; time: string } {
  if (!value?.trim()) return { date: '', time: '' };
  const raw = value.trim();
  if (raw.includes('T')) {
    const [d, rest = ''] = raw.split('T');
    return { date: d.slice(0, 10), time: rest.slice(0, 5) };
  }
  // ISO yoki faqat sana
  const d = new Date(raw);
  if (!Number.isNaN(d.getTime()) && raw.includes('Z')) {
    const pad = (n: number) => String(n).padStart(2, '0');
    return {
      date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
      time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
    };
  }
  return { date: raw.slice(0, 10), time: '' };
}

export function combineDateTimeLocal(date: string, time: string): string {
  if (!date) return '';
  if (time?.trim()) return `${date}T${time.trim().slice(0, 5)}`;
  return date;
}

/** Saqlash uchun ISO — vaqt yo‘q bo‘lsa tush (12:00) qo‘yiladi (countdown uchun) */
export function toStoredIso(date: string, time: string): string {
  if (!date) return new Date().toISOString();
  const t = time?.trim() ? time.trim().slice(0, 5) : '12:00';
  const d = new Date(`${date}T${t}`);
  if (Number.isNaN(d.getTime())) return new Date().toISOString();
  return d.toISOString();
}

export function formatTimeHm(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
