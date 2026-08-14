'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { InvitationCard } from '@/components/invitation/InvitationCard';
import { adminAuthHeaders } from '@/lib/adminAuth';
import { seedBuilderDraftFromInvitation } from '@/lib/builderDraft';
import type { Invitation } from '@/types';
import { Loader2 } from 'lucide-react';

export default function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`/api/invitations/${id}?preview=1`, {
          headers: adminAuthHeaders(),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setInvitation(data.data);
        } else {
          setError(data.message || 'Taklifnoma topilmadi');
        }
      } catch {
        setError('Tarmoq xatosi');
      }
    })();
  }, [id]);

  if (!id || (!invitation && !error)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4A373]" />
        <p className="font-serif">Taklifnoma yuklanmoqda…</p>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <p>{error || 'Topilmadi'}</p>
      </div>
    );
  }

  return (
    <InvitationCard
      invitation={invitation}
      accessMode="preview"
      onStatusUpdated={() => {
        fetch(`/api/invitations/${id}?preview=1`, { headers: adminAuthHeaders() })
          .then((r) => r.json())
          .then((d) => d.success && setInvitation(d.data));
      }}
      onEdit={() => {
        seedBuilderDraftFromInvitation(invitation);
        router.push(`/builder?template=${encodeURIComponent(invitation.templateId)}`);
      }}
    />
  );
}
