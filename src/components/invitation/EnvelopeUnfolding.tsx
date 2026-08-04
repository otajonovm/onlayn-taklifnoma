import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart } from 'lucide-react';
import { ThemeConfig } from '../../types';
import { BRAND } from '../../config/themes';
import { playEnvelopeOpenSound } from '../../utils/audioUtils';

interface EnvelopeUnfoldingProps {
  guestName?: string;
  hostName: string;
  eventTitle: string;
  theme: ThemeConfig;
  onOpen: () => void;
  groomName?: string;
  brideName?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Flap uses 2D lift (not rotateX) so it never goes edge-on / invisible.
 * Closed: tip down. Open: tip up, parked above the hinge.
 */
export const EnvelopeUnfolding: React.FC<EnvelopeUnfoldingProps> = ({
  hostName,
  theme,
  onOpen,
  groomName,
  brideName,
}) => {
  const [phase, setPhase] = useState<'idle' | 'opening' | 'done'>('idle');
  const accent = theme.accentColor || BRAND.accent;
  const paper = theme.envelopeColor || '#FAF6F0';
  const paperDeep = '#E6D4BE';
  const paperMid = '#F2E5D5';
  const isOpening = phase === 'opening';

  const coupleLabel =
    groomName && brideName ? `${groomName} & ${brideName}` : hostName;

  const handleOpenClick = () => {
    if (phase !== 'idle') return;
    playEnvelopeOpenSound();
    setPhase('opening');
    setTimeout(() => {
      setPhase('done');
      onOpen();
    }, 2200);
  };

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.55, ease: EASE }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 overflow-hidden cursor-pointer"
          style={{
            background:
              'radial-gradient(ellipse 90% 70% at 50% 40%, #FFFCF8 0%, #FDFBF7 48%, #F0E4D4 100%)',
          }}
          onClick={handleOpenClick}
        >
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute rounded-full blur-3xl"
            style={{
              width: 280,
              height: 280,
              backgroundColor: `${accent}24`,
              top: '18%',
              left: '50%',
              marginLeft: -140,
            }}
            animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.06, 1] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={
              isOpening
                ? { opacity: 0, y: -28, scale: 0.97 }
                : { opacity: 1, y: 0, scale: 1 }
            }
            transition={{
              duration: isOpening ? 0.5 : 0.75,
              ease: EASE,
              delay: isOpening ? 1.55 : 0,
            }}
            className="relative w-[min(92vw,380px)]"
            style={{ height: 360 }}
          >
            <div
              aria-hidden="true"
              className="absolute left-1/2 -translate-x-1/2 rounded-[100%] blur-xl pointer-events-none"
              style={{
                bottom: 8,
                width: '72%',
                height: 20,
                backgroundColor: 'rgba(30, 41, 59, 0.16)',
              }}
            />

            {/* Envelope body */}
            <div className="absolute left-0 right-0 bottom-8" style={{ height: 236 }}>
              {/* Back */}
              <div
                className="absolute inset-0 rounded-xl"
                style={{
                  background: `linear-gradient(165deg, #FFF9F2 0%, ${paper} 50%, ${paperDeep} 100%)`,
                  border: `1px solid ${accent}38`,
                  boxShadow: '0 24px 48px rgba(30,41,59,0.12)',
                }}
              />
              <div
                className="absolute inset-[1px] rounded-[11px] pointer-events-none"
                style={{
                  background: `linear-gradient(180deg, ${paperMid} 0%, ${paper} 50%, ${paperDeep} 100%)`,
                }}
                aria-hidden="true"
              />

              {/* Letter — behind pocket; when rising, above open flap */}
              <motion.div
                initial={false}
                animate={isOpening ? { y: -158 } : { y: 58 }}
                transition={{
                  duration: 1.05,
                  ease: EASE,
                  delay: isOpening ? 0.65 : 0,
                }}
                className="absolute left-[8%] right-[8%] rounded-lg flex flex-col items-center justify-center px-5"
                style={{
                  top: 0,
                  height: 168,
                  zIndex: isOpening ? 8 : 4,
                  background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFCFA 100%)',
                  border: `1px solid ${accent}28`,
                  boxShadow: '0 10px 24px rgba(30,41,59,0.08)',
                }}
              >
                <p
                  className="font-serif text-xl sm:text-2xl text-center leading-snug"
                  style={{ color: BRAND.text }}
                >
                  {coupleLabel}
                </p>
                <div className="mt-3 w-10 h-px" style={{ backgroundColor: accent }} />
              </motion.div>

              {/* Front V pocket */}
              <div
                className="absolute inset-0 rounded-b-xl pointer-events-none"
                style={{
                  zIndex: 10,
                  background: `linear-gradient(180deg, ${paperMid} 0%, ${paper} 30%, ${paperDeep} 100%)`,
                  clipPath: 'polygon(0 18%, 50% 58%, 100% 18%, 100% 100%, 0 100%)',
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(125deg, ${paperDeep}cc 0%, transparent 45%)`,
                    clipPath: 'polygon(0 18%, 50% 58%, 0 100%)',
                  }}
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(-125deg, ${paperDeep}cc 0%, transparent 45%)`,
                    clipPath: 'polygon(100% 18%, 50% 58%, 100% 100%)',
                  }}
                  aria-hidden="true"
                />
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M0 18 L50 58 L100 18"
                    fill="none"
                    stroke={accent}
                    strokeWidth="0.4"
                    opacity="0.45"
                  />
                </svg>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isOpening ? 0 : 1 }}
                  transition={{ duration: 0.25, delay: isOpening ? 0 : 0.35 }}
                  className="absolute inset-x-0 text-center px-5"
                  style={{ top: '68%' }}
                >
                  <p
                    className="font-serif text-lg sm:text-xl leading-tight"
                    style={{ color: BRAND.text }}
                  >
                    {coupleLabel}
                  </p>
                  <div
                    className="mx-auto mt-2 w-8 h-px"
                    style={{ backgroundColor: accent }}
                  />
                </motion.div>
              </div>

              {/*
                Top flap — 2D fold:
                closed = tip down over mouth
                open   = lifts above hinge, tip points up (always fully visible)
              */}
              <motion.div
                initial={false}
                animate={
                  isOpening
                    ? { y: '-96%' }
                    : { y: '0%' }
                }
                transition={{ duration: 0.85, ease: EASE }}
                className="absolute left-0 right-0 top-0"
                style={{
                  height: '56%',
                  /* Open flap stays behind the rising letter */
                  zIndex: isOpening ? 5 : 20,
                }}
              >
                <motion.div
                  className="absolute inset-0"
                  initial={false}
                  animate={{
                    clipPath: isOpening
                      ? 'polygon(50% 0%, 100% 100%, 0% 100%)'
                      : 'polygon(0% 0%, 100% 0%, 50% 100%)',
                  }}
                  transition={{ duration: 0.85, ease: EASE }}
                  style={{
                    background: isOpening
                      ? `linear-gradient(180deg, ${paperDeep} 0%, ${paper} 55%, #FFFBF7 100%)`
                      : `linear-gradient(170deg, #FFFBF7 0%, ${paper} 45%, ${paperDeep} 100%)`,
                    boxShadow: isOpening
                      ? `0 8px 18px ${accent}28`
                      : `0 10px 20px ${accent}22`,
                  }}
                />
                <motion.svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  initial={false}
                  animate={{ opacity: 0.4 }}
                >
                  {isOpening ? (
                    <path
                      d="M50 1 L99 99 L1 99 Z"
                      fill="none"
                      stroke={accent}
                      strokeWidth="0.5"
                    />
                  ) : (
                    <path
                      d="M1 1 L99 1 L50 99 Z"
                      fill="none"
                      stroke={accent}
                      strokeWidth="0.5"
                    />
                  )}
                </motion.svg>
              </motion.div>

              {/* Wax seal */}
              <motion.button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenClick();
                }}
                whileHover={phase === 'idle' ? { scale: 1.08 } : undefined}
                whileTap={phase === 'idle' ? { scale: 0.93 } : undefined}
                animate={
                  isOpening
                    ? { scale: 0.4, opacity: 0, y: 12 }
                    : {
                        scale: 1,
                        opacity: 1,
                        y: 0,
                        boxShadow: [
                          `0 6px 18px ${accent}50, 0 0 0 0 ${accent}00`,
                          `0 6px 18px ${accent}50, 0 0 0 12px ${accent}1f`,
                          `0 6px 18px ${accent}50, 0 0 0 0 ${accent}00`,
                        ],
                      }
                }
                transition={{
                  boxShadow: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
                  default: { duration: 0.35 },
                }}
                className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2
                  w-[4.5rem] h-[4.5rem] rounded-full border-[2.5px]
                  flex items-center justify-center select-none cursor-pointer"
                style={{
                  zIndex: 30,
                  background: `radial-gradient(circle at 30% 26%, #F8E8D0 0%, ${accent} 50%, #8B5E34 100%)`,
                  borderColor: 'rgba(255,255,255,0.75)',
                }}
                aria-label="Ochish"
              >
                <span
                  className="absolute inset-1.5 rounded-full border pointer-events-none"
                  style={{ borderColor: 'rgba(255,255,255,0.4)' }}
                  aria-hidden="true"
                />
                <Heart
                  className="relative w-7 h-7"
                  style={{ color: '#FFF8F0' }}
                  fill="#FFF8F0"
                  strokeWidth={1.2}
                  aria-hidden="true"
                />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
