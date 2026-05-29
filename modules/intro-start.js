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
spaceWonder.volume = 0.2;
spaceWonder.loop = false;

export function HideBeforeIntro() {
  if (catBox) hide(catBox);
  if (trollBtn) hide(trollBtn);
  if (langSelector) hide(langSelector);

  const meow = document.querySelector(".meow-container");
  if (meow) hide(meow);
}

function initSpaceWarp() {
  if (!spaceCanvas) return;

  const ctx = spaceCanvas.getContext("2d");
  let w, h;
  const isMobile = window.innerWidth < 768;

  function resize() {
    w = spaceCanvas.width = window.innerWidth;
    h = spaceCanvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  const starCount = isMobile ? 350 : 900;

  const stars = Array.from({ length: starCount }, () => ({
    x: (Math.random() - 0.5) * w,
    y: (Math.random() - 0.5) * h,
    z: Math.random() * w * 1.5,
  }));

  let speed = isMobile ? 16 : 70;
  let drift = isMobile ? 0.35 : 1.4;
  let zoom = 1;

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

      const sizeFactor = isMobile ? 2.2 : 2.8;
      const size = (1 - s.z / (w * 1.5)) * sizeFactor;

      ctx.fillStyle = "white";
      ctx.fillRect(px, py, size, size);
    }

    ctx.restore();
    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}

// Головна функція старту
export function introStart() {
  if (!spaceCanvas) {
    console.warn("Canvas #space не знайдено");
    showContentImmediately();
    return;
  }

  initSpaceWarp();

  // Запускаємо звук. Якщо активовано через тач/клік, мобільний його пропустить
  spaceWonder.currentTime = 0;
  spaceWonder
    .play()
    .then(() => {
      audioContextUnlocked = true;
    })
    .catch((err) => {
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
    }, 1400);
  }, 5200);
}

function showContentImmediately() {
  if (catBox) show(catBox);
  if (trollBtn) show(trollBtn);
  if (langSelector) show(langSelector);
  const meow = document.querySelector(".meow-container");
  if (meow) show(meow);
}

// Mobile (click context unlock)
const unlockEvents = ["click", "touchstart", "touchend", "keydown"];

function unlockAudio() {
  if (!audioContextUnlocked) {
    spaceWonder
      .play()
      .then(() => {
        spaceWonder.pause();
        spaceWonder.currentTime = 0;
        audioContextUnlocked = true;
        console.log("Мобільний AudioContext успішно розблоковано!");
        removeUnlockListeners();
      })
      .catch((e) => console.log("Спроба прогріву аудіо...", e));
  }
}

function removeUnlockListeners() {
  unlockEvents.forEach((evt) => {
    document.removeEventListener(evt, unlockAudio);
  });
}

unlockEvents.forEach((evt) => {
  document.addEventListener(evt, unlockAudio, { passive: true });
});
