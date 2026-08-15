import type { Metadata } from 'next';
import { getInvitationDTO } from '@lib/services/invitationService';
import { ShareLandingClient } from '@/components/invitation/ShareLandingClient';
import {
  invitationPeopleLine,
  invitationShareDescription,
  invitationShareTitle,
} from '@lib/share/invitationShare';
import { getBotUsername, publicAppBaseUrl } from '@lib/telegram/notify';

function miniAppUrl(id: string) {
  const user = getBotUsername().replace(/^@/, '');
  const startapp = id.replace(/^#/, '').toUpperCase().replace(/-/g, '_');
  const short = process.env.NEXT_PUBLIC_TMA_SHORT_NAME?.trim().replace(/^\//, '');
  if (short) return `https://t.me/${user}/${short}?startapp=${encodeURIComponent(startapp)}`;
  return `https://t.me/${user}?startapp=${encodeURIComponent(startapp)}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const invitation = await getInvitationDTO(id);
  if (!invitation) {
    return { title: 'Taklifnoma', description: 'Onlayn taklifnoma' };
  }

  const title = invitationShareTitle(invitation);
  const description = invitationShareDescription(invitation);
  const url = `${publicAppBaseUrl()}/s/${invitation.id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Onlayn Taklifnoma',
      locale: 'uz_UZ',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function SharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invitation = await getInvitationDTO(id);

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <p>Taklifnoma topilmadi.</p>
      </div>
    );
  }

  const people = invitationPeopleLine(invitation);
  const webUrl = `${publicAppBaseUrl()}/v/${invitation.id}`;

  return (
    <ShareLandingClient
      miniAppUrl={miniAppUrl(invitation.id)}
      webUrl={webUrl}
      people={people}
      eventTitle={invitation.eventTitle}
    />
  );
}
