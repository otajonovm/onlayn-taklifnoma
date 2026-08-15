'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';
import { Loader2 } from 'lucide-react';
import { parseStartParam } from '@lib/telegram/initData';

function readStartParamFromLaunch(): { initData: string; startParam: string } {
  let initData = '';
  let startParam = '';
  try {
    const launch = retrieveLaunchParams() as Record<string, unknown>;
    if (typeof launch.initDataRaw === 'string') initData = launch.initDataRaw;
    if (typeof launch.startParam === 'string') startParam = launch.startParam;

    const initDataObj = launch.initData as { startParam?: string } | undefined;
    if (!startParam && typeof initDataObj?.startParam === 'string') {
      startParam = initDataObj.startParam;
    }

    // Ba’zi klientlar start_param ni initData query ichida beradi
    if (!startParam && initData) {
      const fromInit = new URLSearchParams(initData).get('start_param');
      if (fromInit) startParam = fromInit;
    }
  } catch {
    /* not in TMA */
  }
  return { initData, startParam };
}

export function TmaEntry() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        let startParam =
          searchParams.get('startapp') ||
          searchParams.get('tgWebAppStartParam') ||
          searchParams.get('start_param') ||
          '';

        const launch = readStartParamFromLaunch();
        const initData = launch.initData;
        startParam = startParam || launch.startParam || '';

        // Auth xato bo‘lsa ham startapp bo‘lsa mehmon sahifasiga o‘tamiz
        if (initData) {
          try {
            await fetch('/api/tma/auth', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ initData }),
            });
          } catch {
            /* ignore auth network errors for guest open */
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
