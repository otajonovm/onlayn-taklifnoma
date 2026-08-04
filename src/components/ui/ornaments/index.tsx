import React from 'react';

export interface OrnamentProps {
  className?: string;
  color?: string;
  opacity?: number;
}

/** Top-left floral corner — mirrors for other corners via CSS */
export const FloralCorner: React.FC<OrnamentProps> = ({
  className = '',
  color = '#D4A373',
  opacity = 1,
}) => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity }}
    aria-hidden="true"
  >
    <path
      d="M8 112C8 56 56 8 112 8"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
    />
    <path
      d="M22 112C22 64 64 22 112 22"
      stroke={color}
      strokeWidth="0.75"
      opacity="0.55"
      strokeLinecap="round"
    />
    <path
      d="M36 108C40 88 52 72 72 60C88 50 100 36 108 22"
      stroke={color}
      strokeWidth="0.9"
      opacity="0.7"
    />
    <circle cx="28" cy="36" r="3.5" fill={color} opacity="0.35" />
    <path
      d="M22 42C26 34 34 28 42 26C34 32 28 40 26 48C24 42 22 42 22 42Z"
      fill={color}
      opacity="0.5"
    />
    <path
      d="M48 24C54 18 62 16 70 18C60 22 52 30 50 40C48 32 48 24 48 24Z"
      fill={color}
      opacity="0.35"
    />
  </svg>
);

export const OrnamentDivider: React.FC<OrnamentProps> = ({
  className = '',
  color = '#D4A373',
  opacity = 1,
}) => (
  <svg
    viewBox="0 0 120 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity }}
    aria-hidden="true"
  >
    <path d="M4 20H46" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.7" />
    <path d="M74 20H116" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.7" />
    <path d="M60 8C64 14 64 26 60 32C56 26 56 14 60 8Z" fill={color} opacity="0.55" />
    <circle cx="60" cy="20" r="2.5" fill={color} />
  </svg>
);

export const WatercolorPetal: React.FC<OrnamentProps> = ({
  className = '',
  color = '#D4A373',
  opacity = 1,
}) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity }}
    aria-hidden="true"
  >
    <ellipse cx="32" cy="38" rx="10" ry="16" fill={color} opacity="0.35" transform="rotate(-18 32 38)" />
    <ellipse cx="32" cy="38" rx="10" ry="16" fill={color} opacity="0.45" transform="rotate(18 32 38)" />
    <ellipse cx="32" cy="36" rx="7" ry="14" fill={color} opacity="0.25" />
    <path d="M32 50V58" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
  </svg>
);

export const WaxSealMark: React.FC<OrnamentProps> = ({
  className = '',
  color = '#D4A373',
  opacity = 1,
}) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity }}
    aria-hidden="true"
  >
    <circle cx="24" cy="24" r="20" fill={color} opacity="0.15" />
    <circle cx="24" cy="24" r="16" fill={color} opacity="0.35" />
    <circle cx="24" cy="24" r="11" fill={color} />
    <circle cx="24" cy="24" r="6" fill="#FDFBF7" />
    <path d="M24 18V30M18 24H30" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

export { CornerOrnament } from './CornerOrnament';
export type { CornerOrnamentProps, CornerPosition } from './CornerOrnament';
