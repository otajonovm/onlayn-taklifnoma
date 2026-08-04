import confetti from 'canvas-confetti';

/** Celebratory burst for successful "Boraman" RSVP */
export const triggerRsvpConfetti = (): void => {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.7 },
    colors: ['#D4AF37', '#F59E0B', '#FFFFFF', '#10B981'],
    disableForReducedMotion: true,
  });

  window.setTimeout(() => {
    confetti({
      particleCount: 40,
      spread: 100,
      startVelocity: 25,
      origin: { y: 0.65, x: 0.5 },
      colors: ['#D4AF37', '#F59E0B', '#FFFFFF', '#10B981'],
      disableForReducedMotion: true,
    });
  }, 180);
};
