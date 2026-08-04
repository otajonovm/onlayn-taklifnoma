import React, { useState, useEffect } from 'react';
import { Invitation, Template } from '@/types';
import { TEMPLATES } from '@/data/templates';
import { BRAND } from '@/config/themes';
import { EnvelopeUnfolding } from './EnvelopeUnfolding';
import { AudioPlayer } from './AudioPlayer';
import { UzbekCountdown } from './UzbekCountdown';
import { LocationNavigator } from './LocationNavigator';
import { AgendaTimeline } from './AgendaTimeline';
import { RsvpSection } from './RsvpSection';
import { LuxuryFloralCard } from './LuxuryFloralCard';
import { ActivationModal } from '../modals/ActivationModal';
import { CalendarGlowSync } from './CalendarGlowSync';
import { GoldParticlesBackground } from '@/components/ui/GoldParticlesBackground';
import { InvitationFrame } from '@/components/ui/ornaments/InvitationFrame';
import { OrnamentDivider } from '@/components/ui/ornaments';
import { SoftSection } from './SoftSection';
import { RevealWords, RevealLine, DrawLine } from './RevealText';
import { WEDDING_IMAGES } from '@/data/weddingImagery';
import { guestShareUrl } from '@/lib/adminAuth';
import { Sparkles, Share2, CheckCircle2, Lock } from 'lucide-react';
import { motion } from 'motion/react';

interface InvitationCardProps {
  invitation: Invitation;
  onStatusUpdated?: () => void;
  accessMode?: 'preview' | 'guest';
}

export const InvitationCard: React.FC<InvitationCardProps> = ({
  invitation,
  onStatusUpdated,
}) => {
  const [guestName, setGuestName] = useState<string>('');
  const [roleParam, setRoleParam] = useState<string>('');
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [shareBlockedHint, setShareBlockedHint] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const guest = params.get('guest') || params.get('mehmon');
    const role = params.get('role');
    if (guest) setGuestName(guest);
    if (role) setRoleParam(role);
  }, []);

  const template: Template =
    TEMPLATES.find((t) => t.id === invitation.templateId) || TEMPLATES[0];

  const theme = {
    ...template.defaultTheme,
    backgroundColor: BRAND.bg,
    cardBgColor: BRAND.white,
    textColor: BRAND.text,
    accentColor: template.defaultTheme.accentColor || BRAND.accent,
    primaryColor: BRAND.white,
  };

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
        audioUrl={invitation.audioUrl || template.sampleMusicUrl}
        audioTitle={invitation.audioTitle || template.sampleMusicTitle}
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

      <div className="relative z-20 max-w-xl mx-auto px-4 pt-12 sm:pt-16 pb-12 w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border p-6 sm:p-10 text-center relative overflow-hidden"
          style={{
            backgroundColor: theme.cardBgColor,
            color: theme.textColor,
            borderColor: BRAND.borderAccent,
            boxShadow: '0 20px 40px rgba(30, 41, 59, 0.04)',
          }}
        >
          <InvitationFrame accentColor={theme.accentColor} />

          <div
            className="absolute top-0 inset-x-0 h-px z-10"
            style={{ backgroundColor: BRAND.accent }}
          />

          <div className="absolute top-4 left-4 z-20">
            <button
              onClick={handleShareLink}
              className="p-2 rounded-full border transition-colors cursor-pointer bg-white/80 relative"
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
                className="absolute left-0 top-11 w-48 text-[10px] leading-snug rounded-lg border px-2.5 py-2 bg-white shadow-sm"
                style={{ borderColor: BRAND.borderAccent, color: BRAND.muted }}
              >
                Aktivlanmaguncha mehmon havolasini saqlab bo‘lmaydi
              </div>
            )}
          </div>

          <div className="mb-4 pt-2 relative z-10">
            <motion.span
              initial={{ opacity: 0, y: 10, letterSpacing: '0.4em' }}
              animate={{ opacity: 1, y: 0, letterSpacing: '0.2em' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block px-3.5 py-1 rounded-full text-xs font-medium uppercase"
              style={{ backgroundColor: `${BRAND.accent}15`, color: BRAND.accent }}
            >
              {roleParam ? `[${roleParam}]` : '— Taklifnoma —'}
            </motion.span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-serif px-2" style={{ color: BRAND.text }}>
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

          <div className="relative z-10">
            <LuxuryFloralCard
              title={invitation.eventTitle}
              groomName={invitation.groomName}
              brideName={invitation.brideName}
              eventDate={invitation.eventDate}
              venueName={invitation.venueName}
              accentColor={theme.accentColor}
            />
          </div>

          <div className="my-4 relative z-10">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-xs uppercase tracking-widest"
              style={{ color: theme.accentColor }}
            >
              <RevealLine delay={0.05}>{invitation.eventType}</RevealLine>
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.1 }}
            >
              <OrnamentDivider className="w-32 h-auto mx-auto my-3" color={theme.accentColor} />
            </motion.div>
          </div>

          <SoftSection className="max-w-md mx-auto" delay={0.05} enter="clip">
            <RevealWords
              text={`"Ikki ayro ko'ngil birlashgan ushbu muqaddas damlarda, muhabbat va sadoqat qasrini birga barpo etmoqdamiz. Sizning tashrifingiz va ezgu duolaringiz qalbimizga quvonch bag'ishlaydi."`}
              className="italic text-sm sm:text-base leading-relaxed font-serif"
              style={{ color: theme.textColor }}
              delay={0.15}
            />
            <DrawLine color={theme.accentColor} className="mx-auto mt-4 w-10" delay={0.55} />
          </SoftSection>

          <div className="relative z-10 space-y-1">
            <SoftSection className="my-4!" delay={0.04} enter="rise">
              <CalendarGlowSync
                eventDate={invitation.eventDate}
                eventTitle={invitation.eventTitle}
                venueName={invitation.venueName}
                locationAddress={invitation.locationAddress}
                accentColor={theme.accentColor}
              />
            </SoftSection>

            <SoftSection className="my-4!" delay={0.06} enter="soft">
              <UzbekCountdown
                targetDate={invitation.eventDate}
                primaryColor={BRAND.text}
                accentColor={theme.accentColor}
                cardBgColor="transparent"
              />
            </SoftSection>

            <SoftSection className="my-4!" delay={0.06} enter="slideLeft">
              <AgendaTimeline
                agenda={invitation.agenda}
                accentColor={theme.accentColor}
                primaryColor={theme.primaryColor}
                textColor={theme.textColor}
              />
            </SoftSection>

            <SoftSection
              className="my-4!"
              delay={0.06}
              enter="clip"
              imageSrc={WEDDING_IMAGES.venue}
              imageAlt="Marosim joyi"
            >
              <LocationNavigator
                venueName={invitation.venueName}
                locationAddress={invitation.locationAddress}
                yandexUrl={invitation.yandexUrl}
                googleUrl={invitation.googleUrl}
                twoGisUrl={invitation.twoGisUrl}
                accentColor={theme.accentColor}
                textColor={theme.textColor}
                cardBgColor="transparent"
              />
            </SoftSection>

            <SoftSection className="my-4!" delay={0.08} enter="rise">
              <RsvpSection
                invitationId={invitation.id}
                hostName={invitation.hostName}
                eventTitle={invitation.eventTitle}
                telegramChatId={invitation.telegramChatId}
                onRsvpSuccess={onStatusUpdated}
              />
            </SoftSection>
          </div>

          <div
            className="mt-12 pt-6 border-t text-center space-y-2 relative z-10"
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
        </motion.div>
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
