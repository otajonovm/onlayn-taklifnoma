import React, { useState, useEffect } from 'react';
import { Invitation } from '@/types';
import { BRAND } from '@/config/themes';
import { EnvelopeUnfolding } from './EnvelopeUnfolding';
import { AudioPlayer } from './AudioPlayer';
import { ActivationModal } from '../modals/ActivationModal';
import { GoldParticlesBackground } from '@/components/ui/GoldParticlesBackground';
import { RevealWords } from './RevealText';
import { guestShareUrl } from '@/lib/adminAuth';
import { Sparkles, Share2, CheckCircle2, Lock, Pencil } from 'lucide-react';
import { motion } from 'motion/react';
import { WEDDING_TEMPLATES } from '@/config/weddingTemplates';
import { WeddingRenderer, resolveWeddingTemplate } from '../templates/WeddingRenderer';

interface InvitationCardProps {
  invitation: Invitation;
  onStatusUpdated?: () => void;
  accessMode?: 'preview' | 'guest';
  onEdit?: () => void;
  initialGuestName?: string;
  initialRole?: string;
}

export const InvitationCard: React.FC<InvitationCardProps> = ({
  invitation,
  onStatusUpdated,
  accessMode = 'preview',
  onEdit,
  initialGuestName,
  initialRole,
}) => {
  const [guestName, setGuestName] = useState<string>(initialGuestName || '');
  const [roleParam, setRoleParam] = useState<string>(initialRole || '');
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [shareBlockedHint, setShareBlockedHint] = useState(false);

  useEffect(() => {
    if (initialGuestName) return;
    const params = new URLSearchParams(window.location.search);
    const guest = params.get('guest') || params.get('mehmon');
    const role = params.get('role');
    if (guest) setGuestName(guest);
    if (role) setRoleParam(role);
  }, [initialGuestName]);

  const template =
    WEDDING_TEMPLATES[invitation.templateId] ||
    WEDDING_TEMPLATES[Object.keys(WEDDING_TEMPLATES)[0]];

  const parsed = invitation.eventDate ? new Date(invitation.eventDate) : null;
  const datePart = parsed && !isNaN(parsed.getTime()) ? parsed.toISOString().slice(0, 10) : template.content.calendar.eventDate;
  const timePart = parsed && !isNaN(parsed.getTime()) ? parsed.toISOString().slice(11, 16) : template.content.calendar.eventTime;

  const coupleNames =
    invitation.groomName && invitation.brideName
      ? `${invitation.groomName} & ${invitation.brideName}`
      : template.content.hero.coupleNames;

  const contentOverrides = {
    hero: {
      ...template.content.hero,
      title: invitation.eventTitle,
      coupleNames,
    },
    calendar: {
      ...template.content.calendar,
      title: invitation.eventTitle,
      eventDate: datePart,
      eventTime: timePart,
    },
    venue: {
      ...template.content.venue,
      name: invitation.venueName,
      address: invitation.locationAddress,
      yandexNavUrl: invitation.yandexUrl || template.content.venue.yandexNavUrl,
    },
    agenda: template.content.agenda
      ? {
          ...template.content.agenda,
          items: Array.isArray(invitation.agenda)
            ? invitation.agenda
            : template.content.agenda.items,
        }
      : undefined,
  } as const;

  const { theme, resolvedMedia } = resolveWeddingTemplate({
    templateId: invitation.templateId,
    customData: { contentOverrides },
    customStyles: invitation.customStyles,
  });

  const isPending = invitation.status === 'PENDING';
  const canShare = invitation.status === 'ACTIVE';

  const handleShareLink = () => {
    if (!canShare) {
      setShareBlockedHint(true);
      setTimeout(() => setShareBlockedHint(false), 2500);
      return;
    }
    navigator.clipboard.writeText(guestShareUrl(invitation.id));
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div
      className="relative min-h-screen w-full pb-20 overflow-x-hidden isolate"
      style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
    >
      {envelopeOpened && (
        <GoldParticlesBackground accentColor={theme.accentColor} particleCount={22} />
      )}

      {!envelopeOpened && (
        <EnvelopeUnfolding
          guestName={guestName}
          hostName={invitation.hostName}
          eventTitle={invitation.eventTitle}
          groomName={invitation.groomName}
          brideName={invitation.brideName}
          theme={theme}
          onOpen={() => setEnvelopeOpened(true)}
        />
      )}

      <AudioPlayer
        audioUrl={invitation.audioUrl || resolvedMedia.audioUrl}
        audioTitle={invitation.audioTitle || resolvedMedia.audioTitle}
        autoPlay={envelopeOpened}
      />

      {isPending && (
        <div className="fixed inset-0 pointer-events-none z-30 watermark-pattern flex items-center justify-center">
          <div
            className="rotate-[-25deg] border px-8 py-4 rounded-2xl text-center backdrop-blur-sm"
            style={{
              borderColor: `${BRAND.accent}40`,
              backgroundColor: 'rgba(253, 251, 247, 0.75)',
            }}
          >
            <span
              className="block text-2xl sm:text-4xl font-serif tracking-widest uppercase"
              style={{ color: `${BRAND.accent}99` }}
            >
              Namuna
            </span>
            <span className="block text-xs uppercase tracking-wider mt-1" style={{ color: BRAND.muted }}>
              Faollashtirilmagan · #{invitation.id}
            </span>
          </div>
        </div>
      )}

      <div className="relative z-20 max-w-xl mx-auto px-3 sm:px-4 pt-10 sm:pt-14 pb-12 w-full">
        <div className="relative mb-4 flex items-start justify-between gap-3">
          <button
            onClick={handleShareLink}
            className="p-2 rounded-full border transition-colors cursor-pointer bg-white/80 relative shrink-0"
            style={{
              borderColor: BRAND.border,
              color: canShare ? BRAND.muted : BRAND.accent,
              opacity: canShare ? 1 : 0.85,
            }}
            title={canShare ? 'Mehmon havolasini nusxalash' : 'Aktivlashdan keyin ochiladi'}
          >
            {copiedShare ? (
              <CheckCircle2 className="w-4 h-4" style={{ color: BRAND.accent }} />
            ) : canShare ? (
              <Share2 className="w-4 h-4" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
          </button>
          {shareBlockedHint && (
            <div
              className="absolute left-0 top-11 w-48 text-[10px] leading-snug rounded-lg border px-2.5 py-2 bg-white shadow-sm z-30"
              style={{ borderColor: BRAND.borderAccent, color: BRAND.muted }}
            >
              Aktivlanmaguncha mehmon havolasini saqlab bo‘lmaydi
            </div>
          )}

          <div className="flex-1 text-center pt-1">
            <motion.span
              initial={{ opacity: 0, y: 10, letterSpacing: '0.4em' }}
              animate={{ opacity: 1, y: 0, letterSpacing: '0.2em' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block px-3.5 py-1 rounded-full text-xs font-medium uppercase"
              style={{ backgroundColor: `${theme.accentColor}15`, color: theme.accentColor }}
            >
              {roleParam ? `[${roleParam}]` : '— Taklifnoma —'}
            </motion.span>
            <h2 className="mt-2 text-xl sm:text-2xl font-serif px-1" style={{ color: theme.textColor }}>
              <RevealWords
                text={
                  guestName
                    ? `Hurmatli ${guestName}, sizni taklif etamiz!`
                    : 'Hurmatli mehmon, sizni taklif etamiz!'
                }
                as="span"
                delay={0.2}
              />
            </h2>
          </div>

          {accessMode === 'preview' && onEdit ? (
            <button
              type="button"
              onClick={onEdit}
              className="p-2 rounded-full border transition-colors cursor-pointer bg-white/80 shrink-0"
              style={{ borderColor: BRAND.border, color: BRAND.accent }}
              title="Tahrirlash"
            >
              <Pencil className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-9 shrink-0" aria-hidden />
          )}
        </div>

        {/* Template-specific layout architecture (WD-101 / WD-102 / WD-103) */}
        <WeddingRenderer
          templateId={invitation.templateId}
          invitation={invitation}
          customData={{ contentOverrides }}
          customStyles={invitation.customStyles}
          onRsvpSuccess={onStatusUpdated}
        />

        <div
          className="mt-10 pt-6 border-t text-center space-y-2"
          style={{ borderColor: BRAND.borderAccent }}
        >
          <div className="inline-flex items-center gap-2 text-sm font-serif" style={{ color: BRAND.text }}>
            <Sparkles className="w-4 h-4" style={{ color: BRAND.accent }} />
            <span>Onlayn Taklifnoma</span>
          </div>
          <p className="text-[11px]" style={{ color: BRAND.muted }}>
            Siz ham shunday taklifnoma yaratmoqchimisiz?{' '}
            <a href="/" className="font-medium underline" style={{ color: BRAND.accent }}>
              Bu yerga bosing
            </a>
          </p>
        </div>
      </div>

      {isPending && (
        <ActivationModal
          invitationId={invitation.id}
          hostName={invitation.hostName}
          eventTitle={invitation.eventTitle}
          onActivatedSuccess={onStatusUpdated}
        />
      )}
    </div>
  );
};
