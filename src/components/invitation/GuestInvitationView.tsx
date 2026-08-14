'use client';

import { InvitationCard } from '@/components/invitation/InvitationCard';
import type { InvitationDTO } from '@app-types/invitation';
import type { Invitation } from '@/types';

export function GuestInvitationView({
  invitation,
  guestName,
  role,
}: {
  invitation: InvitationDTO;
  guestName?: string;
  role?: string;
}) {
  const inv = invitation as unknown as Invitation;

  return (
    <InvitationCard
      invitation={inv}
      accessMode="guest"
      initialGuestName={guestName}
      initialRole={role}
    />
  );
}
