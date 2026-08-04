import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export const SapphireFloralFrame: React.FC = () => {
  const { scrollY } = useScroll();

  // Gentle parallax drift on scroll
  const yTopLeft = useTransform(scrollY, [0, 400], [0, -20]);
  const yTopRight = useTransform(scrollY, [0, 400], [0, -15]);
  const yBottomLeft = useTransform(scrollY, [0, 400], [0, 20]);
  const yBottomRight = useTransform(scrollY, [0, 400], [0, 25]);

  // High-resolution 2D Sapphire Blue Watercolor Flower & Gold Leaf Vector
  const SapphireFlowerSvg = ({ rotate = 0 }: { rotate?: number }) => (
    <svg
      viewBox="0 0 140 140"
      className="w-28 h-28 sm:w-36 sm:h-36 drop-shadow-lg select-none pointer-events-none"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <defs>
        <radialGradient id="bluePetalGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#1E3A8A" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#D4A373" stopOpacity="0.35" />
        </radialGradient>

        <linearGradient id="goldLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE89C" />
          <stop offset="50%" stopColor="#D4A373" />
          <stop offset="100%" stopColor="#C5A059" />
        </linearGradient>

        <linearGradient id="softWhiteCore" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>
      </defs>

      {/* Gold Leaf Accents */}
      <path
        d="M 35,55 C 10,25 45,15 55,35 C 65,15 100,25 75,55 C 100,80 75,110 55,85 C 35,110 10,80 35,55 Z"
        fill="none"
        stroke="url(#goldLeafGrad)"
        strokeWidth="2"
        opacity="0.85"
      />
      <path
        d="M 20,40 Q 40,35 50,50"
        fill="none"
        stroke="url(#goldLeafGrad)"
        strokeWidth="1.5"
      />
      <path
        d="M 90,40 Q 70,35 60,50"
        fill="none"
        stroke="url(#goldLeafGrad)"
        strokeWidth="1.5"
      />

      {/* Sapphire Blue Watercolor Petals Layer 1 */}
      <circle cx="70" cy="70" r="38" fill="url(#bluePetalGrad)" stroke="url(#goldLeafGrad)" strokeWidth="0.8" />

      {/* Layer 2 Petals */}
      <path
        d="M 45,65 C 45,42 95,42 95,65 C 95,88 45,88 45,65 Z"
        fill="#1E3A8A"
        opacity="0.85"
        stroke="url(#goldLeafGrad)"
        strokeWidth="0.8"
      />
      <path
        d="M 52,70 C 52,50 88,50 88,70 C 88,90 52,90 52,70 Z"
        fill="#2563EB"
        opacity="0.9"
        stroke="#93C5FD"
        strokeWidth="0.6"
      />

      {/* Rose/Floral Center Core */}
      <circle cx="70" cy="70" r="14" fill="url(#softWhiteCore)" stroke="url(#goldLeafGrad)" strokeWidth="1" />
      <path
        d="M 64,68 C 64,62 76,62 76,68 C 76,74 66,76 68,70"
        fill="none"
        stroke="#D4A373"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {/* Top Left Corner */}
      <motion.div
        style={{ y: yTopLeft }}
        initial={{ scale: 0.2, opacity: 0, rotate: -20 }}
        animate={{ scale: 1, opacity: 0.95, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -top-3 -left-3 sm:-top-5 sm:-left-5"
      >
        <SapphireFlowerSvg rotate={0} />
      </motion.div>

      {/* Top Right Corner */}
      <motion.div
        style={{ y: yTopRight }}
        initial={{ scale: 0.2, opacity: 0, rotate: 20 }}
        animate={{ scale: 1, opacity: 0.95, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -top-3 -right-3 sm:-top-5 sm:-right-5"
      >
        <SapphireFlowerSvg rotate={90} />
      </motion.div>

      {/* Bottom Left Corner */}
      <motion.div
        style={{ y: yBottomLeft }}
        initial={{ scale: 0.2, opacity: 0, rotate: -15 }}
        animate={{ scale: 1, opacity: 0.95, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -bottom-3 -left-3 sm:-bottom-5 sm:-left-5"
      >
        <SapphireFlowerSvg rotate={270} />
      </motion.div>

      {/* Bottom Right Corner */}
      <motion.div
        style={{ y: yBottomRight }}
        initial={{ scale: 0.2, opacity: 0, rotate: 15 }}
        animate={{ scale: 1, opacity: 0.95, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -bottom-3 -right-3 sm:-bottom-5 sm:-right-5"
      >
        <SapphireFlowerSvg rotate={180} />
      </motion.div>
    </div>
  );
};
