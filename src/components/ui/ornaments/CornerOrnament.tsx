import React from 'react';
import { motion } from 'motion/react';

export type CornerPosition = 'tl' | 'tr' | 'bl' | 'br';

export interface CornerOrnamentProps {
  className?: string;
  fill?: string;
  stroke?: string;
  opacity?: number;
  corner?: CornerPosition;
}

const CORNER_CLASS: Record<CornerPosition, string> = {
  tl: '',
  tr: 'scale-x-[-1]',
  bl: 'scale-y-[-1]',
  br: 'scale-x-[-1] scale-y-[-1]',
};

/**
 * Reusable oriental/national floral corner SVG.
 * Accepts Tailwind className, fill, stroke; animates on mount + hover.
 */
export const CornerOrnament: React.FC<CornerOrnamentProps> = ({
  className = '',
  fill = '#D4A373',
  stroke = '#D4A373',
  opacity = 1,
  corner = 'tl',
}) => {
  return (
    <motion.div
      className={`inline-block ${className}`}
      style={{ opacity }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ opacity: 1 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden="true"
    >
      <div className={`w-full h-auto ${CORNER_CLASS[corner]}`}>
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M8 112C8 56 56 8 112 8"
            stroke={stroke}
            strokeWidth="1.25"
            strokeLinecap="round"
          />
          <path
            d="M22 112C22 64 64 22 112 22"
            stroke={stroke}
            strokeWidth="0.75"
            opacity="0.55"
            strokeLinecap="round"
          />
          <path
            d="M36 108C40 88 52 72 72 60C88 50 100 36 108 22"
            stroke={stroke}
            strokeWidth="0.9"
            opacity="0.7"
          />
          <path
            d="M18 48 L28 38 L38 48 L28 58 Z"
            fill="none"
            stroke={stroke}
            strokeWidth="0.8"
            opacity="0.5"
          />
          <circle cx="28" cy="36" r="3.5" fill={fill} opacity="0.4" />
          <path
            d="M22 42C26 34 34 28 42 26C34 32 28 40 26 48C24 42 22 42 22 42Z"
            fill={fill}
            opacity="0.55"
          />
          <path
            d="M48 24C54 18 62 16 70 18C60 22 52 30 50 40C48 32 48 24 48 24Z"
            fill={fill}
            opacity="0.4"
          />
          <path
            d="M14 90 Q20 70 40 58"
            stroke={stroke}
            strokeWidth="0.6"
            opacity="0.45"
            fill="none"
          />
        </svg>
      </div>
    </motion.div>
  );
};

export default CornerOrnament;
