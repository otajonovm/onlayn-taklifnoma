import React from 'react';
import { WEDDING_IMAGES, type WeddingImageKey } from '@/data/weddingImagery';
import { BRAND } from '@/config/themes';

interface RomanticSectionProps {
  children: React.ReactNode;
  image?: WeddingImageKey | string;
  className?: string;
  overlayOpacity?: number;
  showRingsAccent?: boolean;
  rounded?: string;
}

/**
 * Rounded section with soft wedding photo background + cream overlay for readability.
 * Optional floating rings accent for romantic entrance sections.
 */
export const RomanticSection: React.FC<RomanticSectionProps> = ({
  children,
  image = 'ceremony',
  className = '',
  overlayOpacity = 0.88,
  showRingsAccent = false,
  rounded = 'rounded-2xl',
}) => {
  const src =
    typeof image === 'string' && image.startsWith('http')
      ? image
      : WEDDING_IMAGES[(image as WeddingImageKey) || 'ceremony'];

  return (
    <div
      className={`relative my-6 overflow-hidden border ${rounded} ${className}`}
      style={{ borderColor: BRAND.borderAccent }}
    >
      <img
        src={src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover scale-105"
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, rgba(253,251,247,${overlayOpacity}) 0%, rgba(255,255,255,${Math.min(overlayOpacity + 0.05, 0.95)}) 55%, rgba(245,230,211,${overlayOpacity - 0.05}) 100%)`,
        }}
      />

      {showRingsAccent && (
        <div className="pointer-events-none absolute -right-2 top-3 w-20 sm:w-24 opacity-90 z-1">
          <img
            src={WEDDING_IMAGES.ringsClose}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="w-full h-20 sm:h-24 object-cover rounded-full border-2 shadow-md rotate-6"
            style={{ borderColor: 'rgba(212, 163, 115, 0.45)' }}
          />
        </div>
      )}

      {showRingsAccent && (
        <div className="pointer-events-none absolute -left-1 bottom-4 w-16 sm:w-20 opacity-80 z-1">
          <img
            src={WEDDING_IMAGES.rings}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="w-full h-16 sm:h-20 object-cover rounded-full border-2 shadow-sm -rotate-12"
            style={{ borderColor: 'rgba(212, 163, 115, 0.4)' }}
          />
        </div>
      )}

      <div className="relative z-2 p-5 sm:p-6">{children}</div>
    </div>
  );
};

export default RomanticSection;
