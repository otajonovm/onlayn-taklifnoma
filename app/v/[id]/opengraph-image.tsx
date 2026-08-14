import { ImageResponse } from 'next/og';
import { getInvitationDTO } from '@lib/services/invitationService';

export const runtime = 'nodejs';

export default async function OpenGraphImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invitation = await getInvitationDTO(id);

  const title = invitation?.eventTitle || 'Onlayn Taklifnoma';
  const host = invitation?.hostName || '';
  const date = invitation?.eventDate
    ? new Date(invitation.eventDate).toLocaleDateString('uz-UZ')
    : '';

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
          padding: 48,
        }}
      >
        <div style={{ fontSize: 28, color: '#D4AF37', marginBottom: 16 }}>Onlayn Taklifnoma</div>
        <div style={{ fontSize: 48, textAlign: 'center', marginBottom: 12 }}>{title}</div>
        {host ? <div style={{ fontSize: 28, opacity: 0.9 }}>{host}</div> : null}
        {date ? <div style={{ fontSize: 22, marginTop: 16, color: '#D4AF37' }}>{date}</div> : null}
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
