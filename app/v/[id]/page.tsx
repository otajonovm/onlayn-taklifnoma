import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { GuestInvitationView } from '@/components/invitation/GuestInvitationView';
import { getInvitationDTO } from '@lib/services/invitationService';
import { invitationShareDescription, invitationShareTitle } from '@lib/share/invitationShare';
import { publicAppBaseUrl } from '@lib/telegram/notify';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const invitation = await getInvitationDTO(id);
  if (!invitation) return { title: 'Taklifnoma' };
  const title = invitationShareTitle(invitation);
  const description = invitationShareDescription(invitation);
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${publicAppBaseUrl()}/s/${invitation.id}`,
      siteName: 'Onlayn Taklifnoma',
      type: 'website',
    },
  };
}

export default async function GuestPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ guest?: string; mehmon?: string; role?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const invitation = await getInvitationDTO(id);

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <p>Taklifnoma topilmadi.</p>
      </div>
    );
  }

  if (invitation.status === 'PENDING') {
    redirect(`/preview/${invitation.id}`);
  }

  const guestName = sp.guest || sp.mehmon || undefined;

  return (
    <GuestInvitationView
      invitation={invitation}
      guestName={guestName}
      role={sp.role}
    />
  );
}
