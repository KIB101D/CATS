const DEFAULTS = {
  count: 14,
  emoji: "🐾",
};

export function initPawBackground(options = {}) {
  const settings = { ...DEFAULTS, ...options };
  const pawLayer = document.getElementById("paw-layer");

  if (!pawLayer) {
    console.warn("[pawBackground] #paw-layer not found");
    return;
  }

  const paws = [];

  function randomPosition(el) {
    const padding = 40;
    el.style.left = Math.random() * (window.innerWidth - padding) + "px";
    el.style.top = Math.random() * (window.innerHeight - padding) + "px";
    el.style.animationDelay = Math.random() * 6 + "s";
  }

  function createPaw() {
    const paw = document.createElement("div");
    paw.className = "paw";
    paw.textContent = settings.emoji;

    randomPosition(paw);

    paw.addEventListener("click", () => {
      paw.style.opacity = "0";
      setTimeout(() => randomPosition(paw), 300);
    });

    pawLayer.appendChild(paw);
    paws.push(paw);
  }

  for (let i = 0; i < settings.count; i++) {
    createPaw();
  }

  window.addEventListener("resize", () => {
    paws.forEach(randomPosition);
  });

  return {
    destroy() {
      paws.forEach((p) => p.remove());
      paws.length = 0;
    },
  };
}
