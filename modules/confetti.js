export function spawnConfetti() {
  if (typeof confetti !== "function") {
    console.warn("Confetti.js not found");
    return;
  }

  const STORAGE_KEY = "confetti_chaos_seen";
  const isFirstTime = sessionStorage.getItem(STORAGE_KEY) !== "true";

  if (isFirstTime) {
    sessionStorage.setItem(STORAGE_KEY, "true");
  }

  const duration = isFirstTime ? 10000 : 5000;
  const animationEnd = Date.now() + duration;
  const intervalMs = isFirstTime ? 160 : 300;

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    const intensity = timeLeft / duration;

    if (isFirstTime) {
      // ─── Trolling On ───
      confetti({
        particleCount: Math.floor(220 * intensity),
        spread: 360,
        startVelocity: 20 + random(0, 25),
        decay: 0.925,
        gravity: 0.5,
        ticks: 300,
        scalar: random(0.6, 1.7),
        origin: { x: random(0.05, 0.95), y: random(0.1, 0.8) },
        colors: [
          "#ff0044",
          "#00ff99",
          "#aa00ff",
          "#ffff33",
          "#ff66cc",
          "#33ccff",
          "#ffffff",
        ],
      });

      confetti({
        particleCount: Math.floor(90 * intensity),
        angle: 30 + random(-20, 20),
        spread: 80,
        startVelocity: 35,
        decay: 0.9,
        origin: { x: -0.1, y: random(0.1, 0.9) },
      });

      confetti({
        particleCount: Math.floor(90 * intensity),
        angle: 150 + random(-20, 20),
        spread: 80,
        startVelocity: 35,
        decay: 0.9,
        origin: { x: 1.1, y: random(0.1, 0.9) },
      });

      if (Math.random() < 0.4) {
        confetti({
          particleCount: Math.floor(70 * intensity),
          angle: 90,
          spread: 140,
          startVelocity: 12,
          decay: 0.94,
          gravity: 0.35,
          origin: { x: random(0.1, 0.9), y: -0.1 },
        });
      }
    } else {
      // ─── Trolling Off ───
      confetti({
        particleCount: Math.floor(8 * intensity) + 2,
        spread: 200,
        startVelocity: 5 + random(0, 7),
        decay: 0.97,
        gravity: 0.2,
        ticks: 400,
        scalar: 0.8 + random(-0.2, 0.5),
        origin: { x: random(0.2, 0.8), y: random(-0.05, 0.15) },
        colors: ["#e0e0e0", "#f0f0f0", "#ffffff", "#d0d0d0"],
      });

      // Single one "hi" (rarely)
      if (Math.random() < 0.08) {
        confetti({
          particleCount: 6,
          angle: random(20, 160),
          spread: 50,
          startVelocity: 10,
          decay: 0.95,
          origin: { x: random(-0.1, 1.1), y: random(0, 0.4) },
        });
      }
    }
  }, intervalMs);
}
