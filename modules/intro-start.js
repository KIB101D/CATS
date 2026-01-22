import { hide, show } from "./hide.js";

const catBox = document.querySelector(".cat-box");
const trollBtn = document.querySelector(".troll-button");
const langSelector = document.querySelector(".lang-selector");
const spaceCanvas = document.getElementById("space");
const introLogo = document.querySelector(".intro-logo");
let audioContextUnlocked = false;

// Space Sound
const spaceWonder = new Audio("./assets/sounds/space.mp3");
spaceWonder.preload = "auto";
spaceWonder.volume = 0.7;
spaceWonder.loop = false;

// Hide elements
export function HideBeforeIntro() {
  // спочатку ховаємо основний контент
  if (catBox) hide(catBox);
  if (trollBtn) hide(trollBtn);
  if (langSelector) hide(langSelector);

  // також ховаємо .meow-container на початку
  const meow = document.querySelector(".meow-container");
  if (meow) hide(meow);
}

function initSpaceWarp() {
  if (!spaceCanvas) return;

  const ctx = spaceCanvas.getContext("2d");

  let w, h;
  function resize() {
    w = spaceCanvas.width = window.innerWidth;
    h = spaceCanvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  const stars = Array.from({ length: 900 }, () => ({
    x: (Math.random() - 0.5) * w,
    y: (Math.random() - 0.5) * h,
    z: Math.random() * w * 1.5,
  }));

  let speed = 70;
  let zoom = 1;
  let drift = 1.4;

  const stopTime = performance.now() + 3400;
  const driftTime = stopTime + 1100;

  function draw(now) {
    ctx.fillStyle = "rgba(0,0,0,0.38)";
    ctx.fillRect(0, 0, w, h);

    if (now > stopTime) {
      speed *= 0.925;
      drift *= 0.982;
      zoom += (1.015 - zoom) * 0.045;

      if (speed < 0.3) speed = 0;
      if (now > driftTime && drift < 0.015) drift = 0;
    }

    const effectiveSpeed = speed + drift;

    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.scale(zoom, zoom);

    for (const s of stars) {
      s.z -= effectiveSpeed;
      if (s.z <= 0.8) s.z = w * 1.5;

      const k = 180 / s.z;
      const px = s.x * k;
      const py = s.y * k;
      const size = (1 - s.z / (w * 1.5)) * 2.8;

      ctx.fillStyle = "white";
      ctx.fillRect(px, py, size, size);
    }

    ctx.restore();
    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}

export function introStart() {
  if (!spaceCanvas) {
    console.warn("Canvas #space не знайдено");
    showContentImmediately();
    return;
  }

  initSpaceWarp();
  spaceWonder.currentTime = 0;
  spaceWonder.play().catch((err) => {
    console.log("Space sound autoplay blocked:", err);
  });

  setTimeout(() => {
    document.body.classList.add("intro-finished");

    setTimeout(() => {
      if (spaceCanvas) spaceCanvas.style.display = "none";
      if (introLogo) introLogo.style.display = "none";

      spaceWonder.pause();
      spaceWonder.currentTime = 0;

      if (catBox) show(catBox);
      if (trollBtn) show(trollBtn);
      if (langSelector) show(langSelector);

      const meow = document.querySelector(".meow-container");
      if (meow) show(meow);
    }, 1400); // затримка після згасання космосу
  }, 5200);
}

function showContentImmediately() {
  if (catBox) show(catBox);
  if (trollBtn) show(trollBtn);
  if (langSelector) show(langSelector);
  const meow = document.querySelector(".meow-container");
  if (meow) show(meow);
}

// Intro sound unlock
document.addEventListener(
  "click",
  function unlockAudio() {
    if (!audioContextUnlocked && spaceWonder.paused) {
      spaceWonder
        .play()
        .then(() => {
          spaceWonder.pause();
          spaceWonder.currentTime = 0;
          audioContextUnlocked = true;
          console.log("Аудіо-контекст розблоковано");
        })
        .catch((e) => console.log("Не вдалося розблокувати:", e));
    }
  },
  { once: true },
);
