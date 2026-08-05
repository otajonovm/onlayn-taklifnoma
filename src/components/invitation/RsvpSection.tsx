import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, XCircle, Send, Sparkles, UserCheck } from 'lucide-react';
import { BRAND } from '@/config/themes';
import type { WeddingRsvpContent } from '@/config/weddingTemplates';
import { triggerRsvpConfetti } from '@/utils/confetti';
import { OrnamentDivider } from '@/components/ui/ornaments';

export interface RsvpSectionProps {
  invitationId: string;
  hostName: string;
  eventTitle: string;
  telegramChatId?: string;
  content?: WeddingRsvpContent;
  accentColor?: string;
  textColor?: string;
  onRsvpSuccess?: () => void;
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({
  invitationId,
  hostName,
  eventTitle,
  telegramChatId,
  content,
  accentColor = BRAND.accent,
  textColor = BRAND.text,
  onRsvpSuccess,
}) => {
  const [guestName, setGuestName] = useState('');
  const rolesConfig =
    content?.roles ?? [
      { value: "Yaqin Do'st", label: "Yaqin Do'st" },
      { value: 'Qarindosh', label: "Qarindosh / Oila" },
      { value: 'Hamkasb', label: 'Hamkasb' },
      { value: "Qo'shni", label: 'Qo\'shni' },
      { value: 'Tantana sohibi', label: 'Tantana sohibiman' },
    ];

  const [role, setRole] = useState<string>(rolesConfig[0]?.value ?? "Yaqin Do'st");
  const [status, setStatus] = useState<'ATTENDING' | 'DECLINED'>('ATTENDING');
  const [plusOne, setPlusOne] = useState(1);
  const [wishes, setWishes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [responseLog, setResponseLog] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/invitations/${invitationId}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName,
          role,
          status,
          plusOne: status === 'ATTENDING' ? plusOne : 0,
          wishes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (status === 'ATTENDING') {
          triggerRsvpConfetti();
        }
        setIsSubmitted(true);
        setResponseLog(data.telegramSimulatedLog ?? null);
        onRsvpSuccess?.();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClass =
    'w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 bg-white';
  const fieldStyle = {
    borderColor: BRAND.border,
    color: textColor,
  } as const;

  return (
    <div
      className="my-0 p-0 sm:p-1 rounded-none border-0 max-w-lg mx-auto relative bg-transparent overflow-hidden"
    >
      <div className="text-center space-y-2 mb-6">
        <p className="text-xs uppercase tracking-widest font-medium" style={{ color: BRAND.accent }}>
          — {content?.badgeText ?? 'RSVP'} —
        </p>
        <OrnamentDivider className="w-28 h-auto mx-auto" color={accentColor} />
        <h3 className="text-2xl font-serif" style={{ color: textColor }}>
          {content?.sectionTitle ?? 'Tashrifingizni Bildiring'}
        </h3>
        <p className="text-xs max-w-xs mx-auto" style={{ color: BRAND.muted }}>
          {(content?.sectionSubtitleTemplate ?? '${hostName} sizni kutmoqda.').replace(
            '${hostName}',
            hostName
          )}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {isSubmitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="py-10 text-center space-y-4"
          >
            <motion.div
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto border"
              style={{
                backgroundColor: `${BRAND.accent}15`,
                color: BRAND.accent,
                borderColor: BRAND.borderAccent,
              }}
            >
              <CheckCircle2 className="w-9 h-9" />
            </motion.div>
            <h4 className="text-2xl font-serif" style={{ color: textColor }}>
              {content?.successTitle ?? 'Rahmat!'}
            </h4>
            <p className="text-sm max-w-xs mx-auto leading-relaxed" style={{ color: BRAND.muted }}>
              {(content?.successSubtitleTemplate ??
                'Tashrifingiz tasdiqlandi. Mezbonlar tez orada xabar olishadi.').replace(
                '${hostName}',
                hostName
              )}
            </p>
            {responseLog && (
              <div
                className="p-3 rounded-xl border text-left text-xs font-mono flex items-center gap-2 max-w-sm mx-auto"
                style={{ borderColor: BRAND.border, backgroundColor: BRAND.bg, color: BRAND.muted }}
              >
                <Sparkles className="w-4 h-4 shrink-0" style={{ color: BRAND.accent }} />
                <span className="truncate">{responseLog}</span>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.35 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: BRAND.muted }}>
                {content?.guestNameLabel ?? 'Ismingiz *'}
              </label>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Sardor Azimov"
                className={fieldClass}
                style={fieldStyle}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: BRAND.muted }}>
                {content?.proximityLabel ?? 'Yaqinlik'}
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={fieldClass}
                style={fieldStyle}
              >
                {rolesConfig.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: BRAND.muted }}>
                {content?.statusLabel ?? 'Tashrif *'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStatus('ATTENDING')}
                  className="py-2.5 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-2 cursor-pointer transition-all"
                  style={{
                    backgroundColor: status === 'ATTENDING' ? accentColor : BRAND.white,
                    color: status === 'ATTENDING' ? BRAND.white : textColor,
                    borderColor: status === 'ATTENDING' ? accentColor : BRAND.border,
                  }}
                >
                  <UserCheck className="w-4 h-4" />
                  {content?.status?.attendingLabel ?? 'Boraman'}
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('DECLINED')}
                  className="py-2.5 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-2 cursor-pointer transition-all"
                  style={{
                    backgroundColor: status === 'DECLINED' ? '#FEF2F2' : BRAND.white,
                    color: status === 'DECLINED' ? '#BE123C' : textColor,
                    borderColor: status === 'DECLINED' ? '#FECACA' : BRAND.border,
                  }}
                >
                  <XCircle className="w-4 h-4" />
                  {content?.status?.declinedLabel ?? 'Bora olmayman'}
                </button>
              </div>
            </div>

            {status === 'ATTENDING' && (
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: BRAND.muted }}>
                  {content?.plusOneLabel ?? 'Necha kishi?'}
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPlusOne(num)}
                      className="w-10 h-10 rounded-xl text-xs font-medium border cursor-pointer"
                      style={{
                        backgroundColor: plusOne === num ? BRAND.accent : BRAND.white,
                        color: plusOne === num ? BRAND.white : BRAND.text,
                        borderColor: plusOne === num ? BRAND.accent : BRAND.border,
                      }}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: BRAND.muted }}>
                {content?.wishesLabel ?? 'Tilaklar (ixtiyoriy)'}
              </label>
              <textarea
                rows={2}
                value={wishes}
                onChange={(e) => setWishes(e.target.value)}
                className={fieldClass}
                style={fieldStyle}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl font-medium text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              style={{ backgroundColor: accentColor, color: BRAND.white }}
            >
              <Send className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? content?.submitButtonSubmittingLabel ?? 'Yuborilmoqda...'
                  : status === 'ATTENDING'
                    ? content?.submitButtonAttendingLabel ?? 'Boraman — Tasdiqlash'
                    : content?.submitButtonDeclinedLabel ?? 'Javobni Yuborish'}
              </span>
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RsvpSection;
