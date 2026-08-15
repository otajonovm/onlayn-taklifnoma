'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { parseStartParam } from '@lib/telegram/initData';
import { extractTelegramInitData, extractTelegramStartParam } from '@lib/telegram/launchParams';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function TmaEntry() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        let startParam = '';
        let initData = '';

        // Telegram hash/WebApp ba’zan bir zumda keladi — qayta urinish
        for (const wait of [0, 80, 200, 400]) {
          if (wait) await sleep(wait);
          if (cancelled) return;

          startParam =
            searchParams.get('startapp') ||
            searchParams.get('tgWebAppStartParam') ||
            searchParams.get('start_param') ||
            extractTelegramStartParam();

          initData = extractTelegramInitData();
          if (startParam || initData) break;
        }

        if (initData) {
          try {
            await fetch('/api/tma/auth', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ initData }),
            });
          } catch {
            /* ignore */
          }
        }

        const parsed = parseStartParam(startParam);
        if (cancelled) return;

        if (parsed.invitationId) {
          try {
            sessionStorage.removeItem('ot_tma_startapp');
          } catch {
            /* ignore */
          }
          const qs = new URLSearchParams();
          if (parsed.guestName) qs.set('guest', parsed.guestName);
          const suffix = qs.toString() ? `?${qs.toString()}` : '';
          router.replace(`/v/${parsed.invitationId}${suffix}`);
          return;
        }

        router.replace('/builder');
      } catch {
        if (!cancelled) setError('Telegram Mini App ochilmadi');
      }
    })();

    return () => {
      cancelled = true;
    };
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
