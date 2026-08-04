import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export const BloomingWhiteRoseDecor: React.FC = () => {
  const { scrollY } = useScroll();

  // Subtle parallax transform values for scrolling
  const yTopLeft = useTransform(scrollY, [0, 500], [0, -35]);
  const yTopRight = useTransform(scrollY, [0, 500], [0, -25]);
  const yBottomLeft = useTransform(scrollY, [0, 500], [0, 30]);
  const yBottomRight = useTransform(scrollY, [0, 500], [0, 40]);

  // SVG White Rose vector template with gold accents
  const RoseSvg = ({ rotate = 0 }: { rotate?: number }) => (
    <svg
      viewBox="0 0 120 120"
      className="w-24 h-24 sm:w-32 sm:h-32 drop-shadow-md select-none pointer-events-none"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <defs>
        <linearGradient id="roseWhiteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#FAF5EF" />
          <stop offset="100%" stopColor="#EAE0D5" />
        </linearGradient>
        <linearGradient id="leafGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#B38B21" />
        </linearGradient>
      </defs>

      {/* Gold Leaves Background */}
      <path
        d="M 30,50 C 10,20 40,10 50,30 C 60,10 90,20 70,50 C 90,70 70,100 50,80 C 30,100 10,70 30,50 Z"
        fill="none"
        stroke="url(#leafGoldGrad)"
        strokeWidth="1.8"
        opacity="0.85"
      />
      <path
        d="M 15,35 Q 35,30 45,45"
        fill="none"
        stroke="url(#leafGoldGrad)"
        strokeWidth="1.2"
        opacity="0.7"
      />
      <path
        d="M 85,35 Q 65,30 55,45"
        fill="none"
        stroke="url(#leafGoldGrad)"
        strokeWidth="1.2"
        opacity="0.7"
      />

      {/* Blooming White Rose Petals Layer 1 */}
      <circle cx="60" cy="60" r="32" fill="url(#roseWhiteGrad)" stroke="#D4AF37" strokeWidth="0.8" />
      <path
        d="M 40,55 C 40,38 80,38 80,55 C 80,72 40,72 40,55 Z"
        fill="#FFFFFF"
        stroke="#E2D4C5"
        strokeWidth="1"
      />
      <path
        d="M 46,60 C 46,45 74,45 74,60 C 74,75 46,75 46,60 Z"
        fill="#FAF6F0"
        stroke="#D4AF37"
        strokeWidth="0.8"
      />

      {/* Rose Center Petal Spiral */}
      <path
        d="M 54,58 C 54,52 66,52 66,58 C 66,64 56,66 58,60"
        fill="none"
        stroke="#C6A12E"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {/* Top Left Corner Floral Accent */}
      <motion.div
        style={{ y: yTopLeft }}
        initial={{ scale: 0, opacity: 0, rotate: -25 }}
        animate={{ scale: 1, opacity: 0.9, rotate: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
        className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6"
      >
        <RoseSvg rotate={0} />
      </motion.div>

      {/* Top Right Corner Floral Accent */}
      <motion.div
        style={{ y: yTopRight }}
        initial={{ scale: 0, opacity: 0, rotate: 25 }}
        animate={{ scale: 1, opacity: 0.9, rotate: 0 }}
        transition={{ duration: 0.9, delay: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6"
      >
        <RoseSvg rotate={90} />
      </motion.div>

      {/* Bottom Left Corner Floral Accent */}
      <motion.div
        style={{ y: yBottomLeft }}
        initial={{ scale: 0, opacity: 0, rotate: -15 }}
        animate={{ scale: 1, opacity: 0.9, rotate: 0 }}
        transition={{ duration: 0.9, delay: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
        className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6"
      >
        <RoseSvg rotate={270} />
      </motion.div>

      {/* Bottom Right Corner Floral Accent */}
      <motion.div
        style={{ y: yBottomRight }}
        initial={{ scale: 0, opacity: 0, rotate: 15 }}
        animate={{ scale: 1, opacity: 0.9, rotate: 0 }}
        transition={{ duration: 0.9, delay: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
        className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6"
      >
        <RoseSvg rotate={180} />
      </motion.div>
    </div>
  );
};
