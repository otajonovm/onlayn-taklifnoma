import React from 'react';
import { motion } from 'motion/react';
import { BRAND } from '@/config/themes';

interface InvitationFrameProps {
  accentColor?: string;
}

const GeometricCorner: React.FC<{
  accentColor: string;
  className?: string;
  flipX?: boolean;
  flipY?: boolean;
  delay?: number;
}> = ({ accentColor, className = '', flipX, flipY, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.88 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    className={`pointer-events-none ${className}`}
    aria-hidden="true"
  >
    <div
      className="w-full h-auto"
      style={{
        transform: `scaleX(${flipX ? -1 : 1}) scaleY(${flipY ? -1 : 1})`,
      }}
    >
      <svg viewBox="0 0 80 80" fill="none" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M4 52 V10 C4 5 5 4 10 4 H52"
          stroke={accentColor}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M11 46 V16 C11 13 13 11 16 11 H46"
          stroke={accentColor}
          strokeWidth="0.75"
          opacity="0.5"
          strokeLinecap="round"
        />
        <path
          d="M8 8 L14 2 L20 8 L14 14 Z"
          fill="none"
          stroke={accentColor}
          strokeWidth="1.1"
        />
        <circle cx="14" cy="8" r="1.8" fill={accentColor} opacity="0.75" />
        <circle cx="34" cy="7" r="1.1" fill={accentColor} opacity="0.4" />
        <circle cx="7" cy="34" r="1.1" fill={accentColor} opacity="0.4" />
        <path
          d="M24 6 H30 M6 24 V30"
          stroke={accentColor}
          strokeWidth="0.6"
          opacity="0.45"
          strokeLinecap="round"
        />
      </svg>
    </div>
  </motion.div>
);

/**
 * Creative non-floral frame: double L-corners, diamond accents, hairline rules.
 */
export const InvitationFrame: React.FC<InvitationFrameProps> = ({
  accentColor = BRAND.accent,
}) => {
  return (
    <div className="pointer-events-none absolute inset-0 z-5 overflow-hidden" aria-hidden="true">
      <GeometricCorner
        accentColor={accentColor}
        className="absolute top-3 left-3 w-12 sm:w-16 md:w-18"
        delay={0.05}
      />
      <GeometricCorner
        accentColor={accentColor}
        className="absolute top-3 right-3 w-12 sm:w-16 md:w-18"
        flipX
        delay={0.1}
      />
      <GeometricCorner
        accentColor={accentColor}
        className="absolute bottom-3 left-3 w-12 sm:w-16 md:w-18"
        flipY
        delay={0.15}
      />
      <GeometricCorner
        accentColor={accentColor}
        className="absolute bottom-3 right-3 w-12 sm:w-16 md:w-18"
        flipX
        flipY
        delay={0.2}
      />

      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 0.4 }}
        transition={{ duration: 0.65, delay: 0.28 }}
        className="absolute top-5 left-1/2 -translate-x-1/2 w-14 h-px origin-center"
        style={{ backgroundColor: accentColor }}
      />
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 0.4 }}
        transition={{ duration: 0.65, delay: 0.32 }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 w-14 h-px origin-center"
        style={{ backgroundColor: accentColor }}
      />
    </div>
  );
};
