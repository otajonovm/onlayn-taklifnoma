'use client';

import { useEffect } from 'react';

export function ShareLandingClient({
  miniAppUrl,
  webUrl,
  people,
  eventTitle,
}: {
  miniAppUrl: string;
  webUrl: string;
  people: string;
  eventTitle: string;
}) {
  useEffect(() => {
    const ua = navigator.userAgent || '';
    const inTelegram = /Telegram/i.test(ua) || Boolean((window as unknown as { Telegram?: unknown }).Telegram);
    if (inTelegram) {
      const t = window.setTimeout(() => {
        window.location.href = miniAppUrl;
      }, 400);
      return () => window.clearTimeout(t);
    }
  }, [miniAppUrl]);

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-12" style={{ background: '#FDFBF7' }}>
      <div
        className="w-full max-w-md rounded-3xl border bg-white p-8 text-center shadow-sm"
        style={{ borderColor: 'rgba(212,175,55,0.35)' }}
      >
        <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: '#D4AF37' }}>
          Rasmiy onlayn taklifnoma
        </p>
        <h1 className="mt-3 text-3xl font-serif" style={{ color: '#1A1A1A' }}>
          {people}
        </h1>
        <p className="mt-2 text-sm" style={{ color: '#64748B' }}>
          {eventTitle}
        </p>
        <p className="mt-4 text-xs leading-relaxed" style={{ color: '#64748B' }}>
          Bu xabar firibgarlik emas — mezbon tomonidan yuborilgan taklifnoma.
        </p>
        <a
          href={miniAppUrl}
          className="mt-6 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-medium"
          style={{ backgroundColor: '#0F5132', color: '#FAFAFA' }}
        >
          Telegramda ochish
        </a>
        <a
          href={webUrl}
          className="mt-3 inline-flex w-full items-center justify-center rounded-xl border px-4 py-3 text-xs"
          style={{ borderColor: 'rgba(212,175,55,0.4)', color: '#0F5132' }}
        >
          Brauzerda ochish
        </a>
      </div>
    </div>
  );
}
