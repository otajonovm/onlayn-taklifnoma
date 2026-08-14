'use client';

import { Suspense } from 'react';
import { TmaEntry } from './TmaEntry';
import { Loader2 } from 'lucide-react';

function TmaFallback() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-[#0F5132]" />
      <p className="text-sm">Telegram orqali ochilmoqda…</p>
    </div>
  );
}

export default function TmaPage() {
  return (
    <Suspense fallback={<TmaFallback />}>
      <TmaEntry />
    </Suspense>
  );
}
