import React from 'react';
import { motion } from 'motion/react';
import { BRAND } from '@/config/themes';
import { sectionVariants } from './RevealText';

type SectionMotion = 'rise' | 'soft' | 'clip' | 'slideLeft' | 'slideRight';

interface SoftSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  imageSrc?: string;
  imageAlt?: string;
  /** Enter animation style */
  enter?: SectionMotion;
}

/** Cream section with creative enter motion */
export const SoftSection: React.FC<SoftSectionProps> = ({
  children,
  className = '',
  delay = 0,
  imageSrc,
  imageAlt = '',
  enter = 'soft',
}) => {
  const variants = sectionVariants[enter] ?? sectionVariants.soft;

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-50px' }}
      variants={variants}
      transition={{ delay }}
      className={`relative my-6 overflow-hidden border rounded-2xl ${className}`}
      style={{
        borderColor: BRAND.borderAccent,
        background:
          'linear-gradient(165deg, #FFFFFF 0%, #FDFBF7 55%, rgba(245,230,211,0.45) 100%)',
        boxShadow: '0 12px 32px rgba(30, 41, 59, 0.04)',
      }}
    >
      {/* Soft accent sweep on enter */}
      <motion.div
        aria-hidden="true"
        initial={{ x: '-120%', opacity: 0 }}
        whileInView={{ x: '120%', opacity: [0, 0.5, 0] }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, delay: delay + 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute inset-y-0 w-1/3 z-3"
        style={{
          background: `linear-gradient(90deg, transparent, ${BRAND.accent}18, transparent)`,
        }}
      />

      {imageSrc && (
        <motion.div
          initial={{ scale: 1.08, opacity: 0.6 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: delay + 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-28 sm:h-32 w-full overflow-hidden"
        >
          <img
            src={imageSrc}
            alt={imageAlt}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(253,251,247,0.15) 0%, rgba(253,251,247,0.92) 100%)',
            }}
          />
        </motion.div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: delay + 0.18, ease: [0.22, 1, 0.36, 1] }}
        className={`relative z-2 p-5 sm:p-6 ${imageSrc ? 'pt-3' : ''}`}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default SoftSection;
