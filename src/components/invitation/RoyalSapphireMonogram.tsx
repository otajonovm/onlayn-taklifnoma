import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface RoyalSapphireMonogramProps {
  groomName?: string;
  brideName?: string;
  accentColor?: string;
}

export const RoyalSapphireMonogram: React.FC<RoyalSapphireMonogramProps> = ({
  groomName,
  brideName,
  accentColor = '#D4AF37'
}) => {
  const [drawingDone, setDrawingDone] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Extract initials (e.g., "Sardor" -> "S", "Asal" -> "A")
  const groomInitial = groomName ? groomName.trim().charAt(0).toUpperCase() : 'S';
  const brideInitial = brideName ? brideName.trim().charAt(0).toUpperCase() : 'A';

  // Device orientation / Mouse move parallax handling
  useEffect(() => {
    let handleOrientation: ((e: DeviceOrientationEvent) => void) | null = null;
    let handleMouseMove: ((e: MouseEvent) => void) | null = null;

    if (window.DeviceOrientationEvent && 'ontouchstart' in window) {
      handleOrientation = (e: DeviceOrientationEvent) => {
        const gamma = e.gamma || 0; // -90 to 90 (left to right tilt)
        const beta = e.beta || 0;   // -180 to 180 (front to back tilt)
        const normX = Math.max(-1, Math.min(1, gamma / 30));
        const normY = Math.max(-1, Math.min(1, (beta - 45) / 30));
        setTilt({ x: normX, y: normY });
      };
      window.addEventListener('deviceorientation', handleOrientation);
    } else {
      handleMouseMove = (e: MouseEvent) => {
        const normX = (e.clientX / window.innerWidth) * 2 - 1;
        const normY = (e.clientY / window.innerHeight) * 2 - 1;
        setTilt({ x: normX * 0.8, y: normY * 0.8 });
      };
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (handleOrientation) window.removeEventListener('deviceorientation', handleOrientation);
      if (handleMouseMove) window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative w-full py-8 flex flex-col items-center justify-center overflow-visible select-none">
      {/* SAPPHIRE BLUE WATERCOLOR FLORAL ACCENTS (Expands behind monogram upon path completion) */}
      <motion.div
        animate={{
          x: tilt.x * -22,
          y: tilt.y * -22,
          scale: drawingDone ? 1 : 0.4,
          opacity: drawingDone ? 0.95 : 0
        }}
        transition={{
          scale: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
          opacity: { duration: 0.8 },
          x: { duration: 0.2, ease: 'easeOut' },
          y: { duration: 0.2, ease: 'easeOut' }
        }}
        className="absolute w-64 h-64 sm:w-80 sm:h-80 pointer-events-none z-0"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full filter drop-shadow-xl">
          <defs>
            <radialGradient id="sapphireGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#D4A373" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="sapphirePetal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Sapphire Watercolor Aura */}
          <circle cx="100" cy="100" r="90" fill="url(#sapphireGrad)" />

          {/* Sapphire Watercolor Petal Flourishes */}
          <path
            d="M 100,20 C 130,50 160,20 180,60 C 150,90 180,130 140,160 C 100,140 70,180 30,150 C 50,110 20,70 60,40 Z"
            fill="url(#sapphirePetal)"
            stroke="#3B82F6"
            strokeWidth="0.5"
            strokeOpacity="0.4"
          />
        </svg>
      </motion.div>

      {/* GOLD METALLIC MONOGRAM SVG WITH STROKE-DASHARRAY DRAWING ANIMATION */}
      <motion.div
        animate={{ x: tilt.x * 8, y: tilt.y * 8 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative z-10 w-48 h-48 sm:w-60 sm:h-60 flex items-center justify-center"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
          <defs>
            <linearGradient id="goldBrushGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE89C" />
              <stop offset="40%" stopColor="#D4AF37" />
              <stop offset="70%" stopColor="#AA7C11" />
              <stop offset="100%" stopColor="#FCF6BA" />
            </linearGradient>
          </defs>

          {/* Outer Decorative Crest Circle */}
          <motion.circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke="url(#goldBrushGradient)"
            strokeWidth="2.5"
            strokeDasharray="560"
            initial={{ strokeDashoffset: 560 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
          />

          {/* Inner Dotted Ring */}
          <motion.circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke={accentColor}
            strokeWidth="1"
            strokeDasharray="4 4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          />

          {/* Groom & Bride Initials Monogram Path Drawing */}
          <g transform="translate(10, 5)">
            {/* Groom Initial Text Path */}
            <motion.text
              x="50"
              y="115"
              fontFamily="Georgia, serif"
              fontSize="68"
              fontWeight="bold"
              fontStyle="italic"
              fill="none"
              stroke="url(#goldBrushGradient)"
              strokeWidth="2.5"
              strokeDasharray="200"
              initial={{ strokeDashoffset: 200, fillOpacity: 0 }}
              animate={{ strokeDashoffset: 0, fillOpacity: 1 }}
              transition={{
                strokeDashoffset: { duration: 1.6, ease: "easeInOut" },
                fillOpacity: { delay: 1.4, duration: 0.6 }
              }}
              onAnimationComplete={() => setDrawingDone(true)}
            >
              {groomInitial}
            </motion.text>

            {/* Ampersand symbol */}
            <motion.text
              x="88"
              y="105"
              fontFamily="Georgia, serif"
              fontSize="34"
              fontStyle="italic"
              fill="url(#goldBrushGradient)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.9 }}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              &
            </motion.text>

            {/* Bride Initial Text Path */}
            <motion.text
              x="115"
              y="125"
              fontFamily="Georgia, serif"
              fontSize="68"
              fontWeight="bold"
              fontStyle="italic"
              fill="none"
              stroke="url(#goldBrushGradient)"
              strokeWidth="2.5"
              strokeDasharray="200"
              initial={{ strokeDashoffset: 200, fillOpacity: 0 }}
              animate={{ strokeDashoffset: 0, fillOpacity: 1 }}
              transition={{
                strokeDashoffset: { duration: 1.6, delay: 0.4, ease: "easeInOut" },
                fillOpacity: { delay: 1.6, duration: 0.6 }
              }}
            >
              {brideInitial}
            </motion.text>
          </g>
        </svg>
      </motion.div>

      {/* Subtle Caption underneath */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: drawingDone ? 1 : 0, y: drawingDone ? 0 : 10 }}
        transition={{ duration: 0.6 }}
        className="mt-2 text-xs uppercase tracking-widest font-mono text-amber-200/90 font-semibold"
      >
        — ROYAL SAPPHIRE MONOGRAM —
      </motion.p>
    </div>
  );
};
