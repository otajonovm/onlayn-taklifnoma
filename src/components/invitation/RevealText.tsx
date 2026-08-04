import React from 'react';
import { motion, type Variants } from 'motion/react';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Split text into words with staggered blur-up reveal */
export const RevealWords: React.FC<{
  text: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'span';
  once?: boolean;
}> = ({ text, className = '', style, delay = 0, as: Tag = 'p', once = true }) => {
  const words = text.split(' ');

  return (
    <Tag className={className} style={style}>
      <motion.span
        initial="hidden"
        whileInView="show"
        viewport={{ once, margin: '-30px' }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.045, delayChildren: delay } },
        }}
        className="inline"
        aria-label={text}
      >
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            variants={{
              hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
              show: {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                transition: { duration: 0.55, ease: EASE },
              },
            }}
            className="inline-block mr-[0.28em]"
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
};

/** Clip-mask line reveal for short headlines */
export const RevealLine: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  once?: boolean;
}> = ({ children, className = '', style, delay = 0, once = true }) => (
  <span className={`relative inline-block overflow-hidden align-bottom ${className}`} style={style}>
    <motion.span
      initial={{ y: '110%', opacity: 0 }}
      whileInView={{ y: '0%', opacity: 1 }}
      viewport={{ once, margin: '-20px' }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className="inline-block"
    >
      {children}
    </motion.span>
  </span>
);

/** Soft gold underline that draws under text */
export const DrawLine: React.FC<{
  color?: string;
  className?: string;
  delay?: number;
}> = ({ color = '#D4A373', className = '', delay = 0.3 }) => (
  <motion.div
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7, delay, ease: EASE }}
    className={`h-px origin-center ${className}`}
    style={{ backgroundColor: color }}
    aria-hidden="true"
  />
);

export const sectionVariants: Record<string, Variants> = {
  rise: {
    hidden: { opacity: 0, y: 36, scale: 0.97 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: EASE },
    },
  },
  soft: {
    hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.75, ease: EASE },
    },
  },
  clip: {
    hidden: { opacity: 0, clipPath: 'inset(12% 8% 12% 8% round 16px)' },
    show: {
      opacity: 1,
      clipPath: 'inset(0% 0% 0% 0% round 16px)',
      transition: { duration: 0.85, ease: EASE },
    },
  },
  slideLeft: {
    hidden: { opacity: 0, x: -28, filter: 'blur(4px)' },
    show: {
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.7, ease: EASE },
    },
  },
  slideRight: {
    hidden: { opacity: 0, x: 28, filter: 'blur(4px)' },
    show: {
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.7, ease: EASE },
    },
  },
};

export const childStagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.12 },
  },
};

export const childFade: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE },
  },
};
