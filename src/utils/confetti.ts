import confetti from 'canvas-confetti';

export const triggerChoreConfetti = () => {
  try {
    // Joyful bursts from left and right
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0.1, y: 0.7 },
      colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6'],
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 0.9, y: 0.7 },
      colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6'],
    });
  } catch {
    // fallback gracefully if canvas is blocked
  }
};

export const triggerRewardConfetti = () => {
  try {
    const end = Date.now() + 1000;
    const colors = ['#f59e0b', '#fbbf24', '#f43f5e', '#a855f7'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch {
    // fallback gracefully
  }
};
