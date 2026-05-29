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

  const duration = isFirstTime ? 3200 : 1500;
  const animationEnd = Date.now() + duration;

  // 📱 Визначаємо мобільний пристрій
  const isMobile = window.innerWidth < 768;

  const chaosColors = [
    "#ff0044",
    "#00ff99",
    "#aa00ff",
    "#ffff33",
    "#ff66cc",
    "#33ccff",
    "#ff5500",
    "#ffffff",
  ];

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
      // ─── РЕЖИМ ПИШНИХ НЕВАГОМИХ ВИБУХІВ ЗВЕРХУ ───

      // 🚀 Корекція для мобільних: зменшуємо кількість частинок удвічі та обмежуємо максимальний розмір
      const mainCount = isMobile
        ? Math.floor(30 * intensity) + 10
        : Math.floor(65 * intensity) + 20;
      const mainScalar = isMobile ? random(0.8, 1.4) : random(1.0, 2.2);

      // На мобільних тримаємо центри вибухів ближче до середини, щоб конфеті не летіло за краї екрана
      const mainOriginX = isMobile ? random(0.3, 0.7) : random(0.2, 0.8);

      // Головний супер-вибух
      confetti({
        particleCount: mainCount,
        spread: 360,
        startVelocity: isMobile ? 18 + random(0, 15) : 30 + random(0, 25), // Трохи менша швидкість на мобілці, щоб не розліталися миттєво
        decay: 0.965,
        gravity: 0.02,
        scalar: mainScalar,
        colors: chaosColors,
        origin: { x: mainOriginX, y: random(0.05, 0.25) },
      });

      // Допоміжний бічний вибух зліва (на мобілці знижуємо шанс появи, щоб не спамити)
      if (Math.random() < (isMobile ? 0.4 : 0.75)) {
        const sideCount = isMobile
          ? Math.floor(20 * intensity) + 5
          : Math.floor(45 * intensity) + 10;
        const sideScalar = isMobile ? random(0.7, 1.2) : random(0.8, 1.8);

        confetti({
          particleCount: sideCount,
          spread: 360,
          startVelocity: isMobile ? 15 + random(0, 12) : 25 + random(0, 20),
          decay: 0.96,
          gravity: 0.2,
          scalar: sideScalar,
          colors: chaosColors,
          origin: {
            x: isMobile ? random(0.15, 0.4) : random(0.05, 0.35),
            y: random(0.1, 0.4),
          },
        });
      }

      // Допоміжний бічний вибух справа
      if (Math.random() < (isMobile ? 0.4 : 0.75)) {
        const sideCount = isMobile
          ? Math.floor(20 * intensity) + 5
          : Math.floor(45 * intensity) + 10;
        const sideScalar = isMobile ? random(0.7, 1.2) : random(0.8, 1.8);

        confetti({
          particleCount: sideCount,
          spread: 360,
          startVelocity: isMobile ? 15 + random(0, 12) : 25 + random(0, 20),
          decay: 0.96,
          gravity: 0.2,
          scalar: sideScalar,
          colors: chaosColors,
          origin: {
            x: isMobile ? random(0.6, 0.85) : random(0.65, 0.95),
            y: random(0.1, 0.4),
          },
        });
      }
    } else {
      // Повторні кліки — акуратна пишна хмаринка під стелею
      const repeatCount = isMobile
        ? Math.floor(12 * intensity) + 3
        : Math.floor(25 * intensity) + 5;

      confetti({
        particleCount: repeatCount,
        spread: 360,
        startVelocity: isMobile ? 12 : 20,
        decay: 0.96,
        gravity: 0.2,
        scalar: isMobile ? 1.0 : 1.3,
        colors: chaosColors,
        origin: { x: random(0.3, 0.7), y: 0.15 },
      });
    }
  }, 20);
}
