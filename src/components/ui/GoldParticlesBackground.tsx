import React, { useCallback, useMemo } from 'react';
import Particles, { ParticlesProvider } from '@tsparticles/react';
import type { Engine, ISourceOptions } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';
import { BRAND } from '@/config/themes';

export interface GoldParticlesBackgroundProps {
  className?: string;
  particleCount?: number;
  accentColor?: string;
}

const initParticles = async (engine: Engine) => {
  await loadSlim(engine);
};

const GoldParticlesCanvas: React.FC<{
  className?: string;
  particleCount?: number;
  accentColor?: string;
}> = ({
  className = '',
  particleCount = 22,
  accentColor = BRAND.accent,
}) => {
  const options = useMemo<ISourceOptions>(
    () => ({
      fullScreen: false,
      fpsLimit: 45,
      detectRetina: true,
      pauseOnBlur: true,
      pauseOnOutsideViewport: true,
      particles: {
        number: {
          value: Math.min(Math.max(particleCount, 15), 25),
          density: { enable: false },
        },
        color: {
          value: [accentColor, '#D4AF37', '#FFFFFF', '#F5E6D3', '#E8C9A8'],
        },
        shape: { type: 'circle' },
        opacity: {
          value: { min: 0.12, max: 0.5 },
          animation: {
            enable: true,
            speed: 0.35,
            sync: false,
            startValue: 'random',
          },
        },
        size: {
          value: { min: 1, max: 2.6 },
        },
        move: {
          enable: true,
          direction: 'top',
          speed: { min: 0.12, max: 0.45 },
          straight: false,
          random: true,
          outModes: { default: 'out' },
          attract: { enable: false },
        },
        links: { enable: false },
      },
      interactivity: {
        detectsOn: 'canvas',
        events: {
          onHover: { enable: false },
          onClick: { enable: false },
          resize: { enable: true },
        },
      },
      background: { color: { value: 'transparent' } },
    }),
    [accentColor, particleCount]
  );

  return (
    <Particles
      id="gold-particles-background"
      className={`pointer-events-none absolute inset-0 ${className}`}
      options={options}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

/**
 * Slow floating gold/white dust. Fixed behind content (-z-10),
 * pointer-events none — no scroll interference on mobile.
 */
export const GoldParticlesBackground: React.FC<GoldParticlesBackgroundProps> = (props) => {
  const init = useCallback(initParticles, []);

  return (
    <div
      className={`fixed inset-0 -z-10 pointer-events-none overflow-hidden ${props.className ?? ''}`}
      aria-hidden="true"
    >
      <ParticlesProvider init={init}>
        <GoldParticlesCanvas
          particleCount={props.particleCount}
          accentColor={props.accentColor}
        />
      </ParticlesProvider>
    </div>
  );
};

export default GoldParticlesBackground;
