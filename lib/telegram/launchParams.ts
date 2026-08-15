'use client';

import { retrieveLaunchParams } from '@telegram-apps/sdk-react';

function fromRecord(value: unknown): string {
  return typeof value === 'string' && value.trim() ? value.trim() : '';
}

function fromQuery(source: string, keys: string[]): string {
  if (!source) return '';
  const params = new URLSearchParams(source.startsWith('#') ? source.slice(1) : source);
  for (const key of keys) {
    const v = params.get(key);
    if (v?.trim()) return v.trim();
  }
  return '';
}

const START_KEYS = ['tgWebAppStartParam', 'start_param', 'startapp', 'startParam'];

/** Telegram Mini App start_param — query, hash, WebApp, SDK */
export function extractTelegramStartParam(): string {
  if (typeof window === 'undefined') return '';

  const search = window.location.search.replace(/^\?/, '');
  const hash = window.location.hash.replace(/^#/, '');

  const candidates: string[] = [
    fromQuery(search, START_KEYS),
    fromQuery(hash, START_KEYS),
  ];

  try {
    const tg = (
      window as unknown as {
        Telegram?: {
          WebApp?: {
            initData?: string;
            initDataUnsafe?: { start_param?: string };
          };
        };
      }
    ).Telegram?.WebApp;
    if (tg?.initDataUnsafe?.start_param) candidates.push(tg.initDataUnsafe.start_param);
    if (tg?.initData) candidates.push(fromQuery(tg.initData, ['start_param']));
  } catch {
    /* ignore */
  }

  try {
    const launch = retrieveLaunchParams() as Record<string, unknown>;
    candidates.push(fromRecord(launch.startParam));
    candidates.push(fromRecord(launch.tgWebAppStartParam));
    const initDataObj = launch.initData as { startParam?: string } | undefined;
    candidates.push(fromRecord(initDataObj?.startParam));
    const raw =
      fromRecord(launch.initDataRaw) || fromRecord(launch.tgWebAppData);
    if (raw) candidates.push(fromQuery(raw, ['start_param']));
  } catch {
    /* not in TMA SDK */
  }

  try {
    const stored = sessionStorage.getItem('ot_tma_startapp');
    if (stored) candidates.push(stored);
  } catch {
    /* ignore */
  }

  const found = candidates.find((c) => c.trim());
  if (found) {
    try {
      sessionStorage.setItem('ot_tma_startapp', found);
    } catch {
      /* ignore */
    }
    return found.trim();
  }

  return '';
}

export function extractTelegramInitData(): string {
  if (typeof window === 'undefined') return '';
  try {
    const launch = retrieveLaunchParams() as Record<string, unknown>;
    const raw = fromRecord(launch.initDataRaw) || fromRecord(launch.tgWebAppData);
    if (raw) return raw;
  } catch {
    /* ignore */
  }
  try {
    return (
      (window as unknown as { Telegram?: { WebApp?: { initData?: string } } }).Telegram
        ?.WebApp?.initData || ''
    );
  } catch {
    return '';
  }
}
