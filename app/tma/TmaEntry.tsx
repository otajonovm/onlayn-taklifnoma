'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';
import { Loader2 } from 'lucide-react';
import { parseStartParam } from '@lib/telegram/initData';

export function TmaEntry() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        let initData = '';
        let startParam = searchParams.get('startapp') || searchParams.get('tgWebAppStartParam') || '';

        try {
          const launch = retrieveLaunchParams();
          initData = typeof launch.initDataRaw === 'string' ? launch.initDataRaw : '';
          startParam =
            startParam ||
            (typeof launch.startParam === 'string' ? launch.startParam : '') ||
            '';
        } catch {
          /* not in TMA */
        }

        if (initData) {
          const res = await fetch('/api/tma/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ initData }),
          });
          const data = await res.json();
          if (!res.ok) {
            setError(data.message || 'TMA autentifikatsiya xatosi');
            return;
          }
        }

        const parsed = parseStartParam(startParam);
        if (parsed.invitationId) {
          const qs = new URLSearchParams();
          if (parsed.guestName) qs.set('guest', parsed.guestName);
          const suffix = qs.toString() ? `?${qs.toString()}` : '';
          router.replace(`/v/${parsed.invitationId}${suffix}`);
          return;
        }

        router.replace('/builder');
      } catch {
        setError('Telegram Mini App ochilmadi');
      }
    })();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-[#0F5132]" />
      <p className="text-sm">Telegram orqali ochilmoqda…</p>
    </div>
  );
}
