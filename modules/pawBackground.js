const DEFAULTS = {
  maxCount: 5,
  boxEmoji: "📦",
  pawEmoji: "🐾",
  onClick: null,
};

export function initPawBackground(options = {}) {
  const settings = { ...DEFAULTS, ...options };
  const pawLayer = document.getElementById("paw-layer");

  if (!pawLayer) {
    console.warn("[pawBackground] #paw-layer not found");
    return;
  }

  const spawnedElements = [];
  let clickCount = 0;
  let currentStep = 0;

  function randomPosition(el) {
    const padding = 70;
    const x = Math.random() * (window.innerWidth - padding * 2) + padding;
    const y = Math.random() * (window.innerHeight - padding * 2) + padding;

    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
  }

  function resetQuest() {
    spawnedElements.forEach((el) => {
      el.style.transform = "scale(0)";
      el.style.opacity = "0";
      setTimeout(() => el.remove(), 300);
    });

    spawnedElements.length = 0;
    clickCount = 0;
    currentStep = 0;

    setTimeout(() => {
      spawnNextBox();
    }, 600);
  }

  function spawnNextBox() {
    if (currentStep >= settings.maxCount) return;

    const item = document.createElement("div");
    item.className = "paw";
    item.textContent = settings.boxEmoji;
    item.style.position = "absolute";
    item.style.cursor = "pointer";
    item.style.transition = "transform 0.25s ease, opacity 0.25s ease";
    item.style.userSelect = "none";

    randomPosition(item);

    item.style.transform = "scale(0)";
    pawLayer.appendChild(item);
    spawnedElements.push(item);

    setTimeout(() => {
      item.style.transform = "scale(1)";
    }, 50);

    const handleBoxClick = () => {
      item.removeEventListener("click", handleBoxClick);

      // 🚀 МАГІЯ ТУТ: перетворюємо лапку на "привид", вона пропускає кліки крізь себе
      item.style.pointerEvents = "none";
      item.style.cursor = "default";

      item.textContent = settings.pawEmoji;

      item.style.transform = "scale(1.4)";
      setTimeout(() => {
        item.style.transform = "scale(1)";
      }, 200);

      clickCount++;
      currentStep++;

      if (typeof settings.onClick === "function") {
        settings.onClick(clickCount);
      }

      if (currentStep < settings.maxCount) {
        spawnNextBox();
      } else {
        setTimeout(() => {
          resetQuest();
        }, 1500);
      }
    };

    item.addEventListener("click", handleBoxClick);
  }

  spawnNextBox();

  const handleResize = () => {
    spawnedElements.forEach(randomPosition);
  };
  window.addEventListener("resize", handleResize);

  return {
    destroy() {
      window.removeEventListener("resize", handleResize);
      spawnedElements.forEach((p) => p.remove());
      spawnedElements.length = 0;
    },
    getClickCount() {
      return clickCount;
    },
  };
}
