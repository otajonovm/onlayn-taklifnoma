import { redirect } from 'next/navigation';
import { GuestInvitationView } from '@/components/invitation/GuestInvitationView';
import { getInvitationDTO } from '@lib/services/invitationService';

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
