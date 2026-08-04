import React, { useState } from 'react';
import { CheckCircle2, XCircle, Send, Sparkles, UserCheck } from 'lucide-react';
import { BRAND } from '@/config/themes';
import { triggerRsvpConfetti } from '@/utils/confetti';
import { OrnamentDivider } from '@/components/ui/ornaments';

interface SmartRsvpFormProps {
  invitationId: string;
  hostName: string;
  eventTitle: string;
  telegramChatId?: string;
  onRsvpSuccess?: () => void;
}

export const SmartRsvpForm: React.FC<SmartRsvpFormProps> = ({
  invitationId,
  hostName,
  onRsvpSuccess,
}) => {
  const [guestName, setGuestName] = useState('');
  const [role, setRole] = useState("Yaqin Do'st");
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
        setIsSubmitted(true);
        setResponseLog(data.telegramSimulatedLog);
        if (status === 'ATTENDING') {
          triggerRsvpConfetti();
        }
        if (onRsvpSuccess) onRsvpSuccess();
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
    color: BRAND.text,
  } as const;

  return (
    <div
      className="my-10 p-6 sm:p-8 rounded-xl border max-w-lg mx-auto relative bg-white"
      style={{ borderColor: BRAND.borderAccent }}
    >
      <div className="text-center space-y-2 mb-6">
        <p className="text-xs uppercase tracking-widest font-medium" style={{ color: BRAND.accent }}>
          — RSVP —
        </p>
        <OrnamentDivider className="w-28 h-auto mx-auto" color={BRAND.accent} />
        <h3 className="text-2xl font-serif" style={{ color: BRAND.text }}>
          Tashrifingizni Bildiring
        </h3>
        <p className="text-xs max-w-xs mx-auto" style={{ color: BRAND.muted }}>
          {hostName} sizni kutmoqda.
        </p>
      </div>

      {isSubmitted ? (
        <div className="py-8 text-center space-y-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto border"
            style={{ backgroundColor: `${BRAND.accent}15`, color: BRAND.accent, borderColor: BRAND.borderAccent }}
          >
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-serif" style={{ color: BRAND.text }}>
            Rahmat!
          </h4>
          <p className="text-sm" style={{ color: BRAND.muted }}>
            Javobingiz saqlandi.
          </p>
          {responseLog && (
            <div
              className="p-3 rounded-xl border text-left text-xs font-mono flex items-center gap-2"
              style={{ borderColor: BRAND.border, backgroundColor: BRAND.bg, color: BRAND.muted }}
            >
              <Sparkles className="w-4 h-4 shrink-0" style={{ color: BRAND.accent }} />
              <span className="truncate">{responseLog}</span>
            </div>
          )}
          <button
            onClick={() => setIsSubmitted(false)}
            className="text-xs underline cursor-pointer"
            style={{ color: BRAND.accent }}
          >
            Qaytadan to'ldirish
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: BRAND.muted }}>
              Ismingiz *
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
              Yaqinlik
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={fieldClass}
              style={fieldStyle}
            >
              <option value="Yaqin Do'st">Yaqin Do'st</option>
              <option value="Qarindosh">Qarindosh / Oila</option>
              <option value="Hamkasb">Hamkasb</option>
              <option value="Qo'shni">Qo'shni</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: BRAND.muted }}>
              Tashrif *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStatus('ATTENDING')}
                className="py-2.5 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-2 cursor-pointer transition-all"
                style={{
                  backgroundColor: status === 'ATTENDING' ? BRAND.accent : BRAND.white,
                  color: status === 'ATTENDING' ? BRAND.white : BRAND.text,
                  borderColor: status === 'ATTENDING' ? BRAND.accent : BRAND.border,
                }}
              >
                <UserCheck className="w-4 h-4" />
                Boraman
              </button>
              <button
                type="button"
                onClick={() => setStatus('DECLINED')}
                className="py-2.5 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-2 cursor-pointer transition-all"
                style={{
                  backgroundColor: status === 'DECLINED' ? '#FEF2F2' : BRAND.white,
                  color: status === 'DECLINED' ? '#BE123C' : BRAND.text,
                  borderColor: status === 'DECLINED' ? '#FECACA' : BRAND.border,
                }}
              >
                <XCircle className="w-4 h-4" />
                Bora olmayman
              </button>
            </div>
          </div>

          {status === 'ATTENDING' && (
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: BRAND.muted }}>
                Necha kishi?
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
              Tilaklar (ixtiyoriy)
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
            style={{ backgroundColor: BRAND.accent, color: BRAND.white }}
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Yuborilmoqda...' : 'Javobni Yuborish'}</span>
          </button>
        </form>
      )}
    </div>
  );
};
