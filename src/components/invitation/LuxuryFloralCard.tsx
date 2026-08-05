import React from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { BRAND } from '@/config/themes';
import { WEDDING_IMAGES } from '@/data/weddingImagery';
import { DrawLine, RevealLine } from './RevealText';

export interface LuxuryFloralCardProps {
  title: string;
  groomName?: string;
  brideName?: string;
  monogram?: string;
  eventDate: string;
  venueName: string;
  accentColor?: string;

  // Config-driven typography
  preambleText?: string;
  primaryBodyTemplate?: string; // ${title} placeholder
  secondaryBodyText?: string;
  closingLineText?: string;
  coverImage?: string;

  textColor?: string;
  secondaryTextColor?: string;
}

const MiniCorner: React.FC<{
  accent: string;
  flipX?: boolean;
  flipY?: boolean;
  className?: string;
}> = ({ accent, flipX, flipY, className = '' }) => (
  <div
    className={`pointer-events-none absolute w-12 md:w-14 z-10 ${className}`}
    style={{ transform: `scaleX(${flipX ? -1 : 1}) scaleY(${flipY ? -1 : 1})` }}
    aria-hidden="true"
  >
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-auto">
      <path d="M4 48 V12 C4 6 6 4 12 4 H48" stroke={accent} strokeWidth="1.4" strokeLinecap="round" />
      <path
        d="M12 42 V18 C12 14 14 12 18 12 H42"
        stroke={accent}
        strokeWidth="0.7"
        opacity="0.5"
        strokeLinecap="round"
      />
      <path d="M10 10 L15 5 L20 10 L15 15 Z" fill="none" stroke={accent} strokeWidth="1" />
    </svg>
  </div>
);

const EASE = [0.22, 1, 0.36, 1] as const;

export const LuxuryFloralCard: React.FC<LuxuryFloralCardProps> = ({
  title,
  groomName,
  brideName,
  monogram,
  accentColor = BRAND.accent,
  preambleText = 'Hurmat bilan taklif etamiz',
  primaryBodyTemplate = 'Bizning hayotimizdagi eng baxtli kun — ${title} ga sizni mehmon qilib taklif etamiz.',
  secondaryBodyText = 'Sizning ishtirokingiz, ezgu tilaklaringiz va duolaringiz biz uchun beqiyos qadrli. Shu quvonchini birga nishonlashni istaymiz.',
  closingLineText = "Kutib olishimizdan mamnun bo‘lamiz",
  coverImage = WEDDING_IMAGES.ringsClose,
  textColor = BRAND.text,
  secondaryTextColor = BRAND.muted,
}) => {
  const primaryParts = primaryBodyTemplate.split('${title}');

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: EASE }}
      className="relative my-6 overflow-hidden rounded-2xl border w-full max-w-md mx-auto"
      style={{
        borderColor: 'rgba(212, 163, 115, 0.25)',
        background:
          'linear-gradient(165deg, #FDFBF7 0%, #FFFFFF 45%, rgba(245,230,211,0.65) 100%)',
        boxShadow: '0 18px 40px rgba(30, 41, 59, 0.05)',
      }}
    >
      <MiniCorner accent={accentColor} className="top-2 left-2" />
      <MiniCorner accent={accentColor} className="bottom-2 right-2" flipX flipY />

      <motion.div
        initial={{ opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.08, ease: EASE }}
        className="relative mx-auto mt-8 mb-1 w-32 h-40 sm:w-36 sm:h-44 rounded-xl overflow-hidden border shadow-sm"
        style={{ borderColor: 'rgba(212, 163, 115, 0.35)' }}
      >
        <img
          src={coverImage}
          alt="Nikoh uzuklari"
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, transparent 50%, rgba(253,251,247,0.45) 100%)',
          }}
        />
      </motion.div>

      <div className="relative z-2 px-5 sm:px-8 pt-5 pb-10 text-center">
        {monogram && (
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.4em' }}
            animate={{ opacity: 1, letterSpacing: '0.22em' }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="text-[10px] uppercase tracking-[0.25em] font-medium mb-2"
            style={{ color: accentColor }}
          >
            {monogram}
          </motion.p>
        )}
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.35em' }}
          animate={{ opacity: 1, letterSpacing: '0.22em' }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          className="text-[10px] uppercase font-medium mb-4"
          style={{ color: accentColor }}
        >
          {preambleText}
        </motion.p>

        {/* Couple names — focal */}
        <div className="flex items-center justify-center gap-2.5 flex-wrap">
          {groomName && (
            <RevealLine delay={0.25}>
              <span
                className="text-2xl sm:text-3xl font-serif italic tracking-tight"
                style={{ color: accentColor }}
              >
                {groomName}
              </span>
            </RevealLine>
          )}
          {(groomName || brideName) && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4, type: 'spring', stiffness: 220 }}
              className="inline-flex"
            >
              <Heart className="w-4 h-4 shrink-0" style={{ color: accentColor }} fill={accentColor} />
            </motion.span>
          )}
          {brideName && (
            <RevealLine delay={0.38}>
              <span
                className="text-2xl sm:text-3xl font-serif italic tracking-tight"
                style={{ color: accentColor }}
              >
                {brideName}
              </span>
            </RevealLine>
          )}
        </div>

        <DrawLine color={accentColor} className="mx-auto mt-4 w-12" delay={0.55} />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease: EASE }}
          className="mt-5 text-sm sm:text-[15px] leading-relaxed font-serif px-1"
          style={{ color: textColor }}
        >
          {primaryParts.map((part, idx) => (
            <React.Fragment key={idx}>
              {part}
              {idx < primaryParts.length - 1 && (
                <span className="italic" style={{ color: accentColor }}>
                  {title}
                </span>
              )}
            </React.Fragment>
          ))}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.7, ease: EASE }}
          className="mt-3 text-xs sm:text-sm leading-relaxed px-2"
          style={{ color: secondaryTextColor }}
        >
          {secondaryBodyText}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-6 text-[11px] italic"
          style={{ color: secondaryTextColor }}
        >
          {closingLineText}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default LuxuryFloralCard;
