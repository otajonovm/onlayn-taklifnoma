import React from 'react';
import { WEDDING_IMAGES } from '@/data/weddingImagery';
import { BRAND } from '@/config/themes';

interface RingsAccentProps {
  className?: string;
  size?: 'sm' | 'md';
}

/** Circular wedding-rings photo used between sections */
export const RingsAccent: React.FC<RingsAccentProps> = ({ className = '', size = 'md' }) => {
  const dim = size === 'sm' ? 'w-16 h-16' : 'w-24 h-24 sm:w-28 sm:h-28';

  return (
    <div className={`flex justify-center my-5 ${className}`}>
      <div
        className={`relative ${dim} rounded-full overflow-hidden border-2 shadow-md`}
        style={{ borderColor: 'rgba(212, 163, 115, 0.45)' }}
      >
        <img
          src={WEDDING_IMAGES.ringsClose}
          alt="Nikoh uzuklari"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle, transparent 40%, ${BRAND.bg}55 100%)`,
          }}
        />
      </div>
    </div>
  );
};

export default RingsAccent;
