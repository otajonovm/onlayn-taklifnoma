import { ImageResponse } from 'next/og';
import { getInvitationDTO } from '@lib/services/invitationService';
import { invitationPeopleLine } from '@lib/share/invitationShare';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invitation = await getInvitationDTO(id);
  const people = invitation ? invitationPeopleLine(invitation) : 'Onlayn Taklifnoma';
  const event = invitation?.eventTitle || 'Taklifnoma';
  const host = invitation?.hostName || '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0F5132 0%, #1A1A1A 100%)',
          color: '#FAFAFA',
          fontFamily: 'serif',
          padding: 56,
        }}
      >
        <div style={{ fontSize: 22, color: '#D4AF37', letterSpacing: 6, marginBottom: 20 }}>
          TAKLIFNOMA
        </div>
        <div style={{ fontSize: 52, textAlign: 'center', marginBottom: 14 }}>{people}</div>
        <div style={{ fontSize: 28, opacity: 0.9, textAlign: 'center' }}>{event}</div>
        {host ? (
          <div style={{ fontSize: 20, marginTop: 18, color: '#D4AF37' }}>Mezbon: {host}</div>
        ) : null}
        <div style={{ fontSize: 16, marginTop: 28, opacity: 0.7 }}>Rasmiy onlayn taklifnoma</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
