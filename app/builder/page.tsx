'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LiveBuilder } from '@/components/builder/LiveBuilder';

function BuilderInner() {
  const router = useRouter();
  const params = useSearchParams();
  const initialTemplateId = params.get('template') || undefined;

  return (
    <LiveBuilder
      initialTemplateId={initialTemplateId}
      onInvitationCreated={(id) => router.push(`/preview/${id}`)}
      onCancel={() => router.push('/')}
    />
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Yuklanmoqda…</div>}>
      <BuilderInner />
    </Suspense>
  );
}
