import { fetchTheCat } from "./api/random-cat.js";
import { updateInterface } from "./modules/ui-updater.js";
import {
  catFacts,
  errorMessages,
  greetingsScreen,
} from "./modules/facts/facts.js";
import { spawnConfetti } from "./modules/confetti.js";
import { hide, show } from "./modules/hide.js";
import { renderFactCard, moveNext } from "./modules/facts-card.js";
import { initCurtain, curtainTransition } from "./modules/dojo-curtain.js";
import { HideBeforeIntro, introStart } from "./modules/intro-start.js";
import { initPawBackground } from "./modules/pawBackground.js";

// ────────────────────────────────────────────────
//  DOM (error states)
// ────────────────────────────────────────────────
const errorScreen = document.querySelector("#screen-error");
const errorCodeEl = document.querySelector(".error-code");
const errorMessageEl = document.querySelector(".error-message");
const factScreen = document.querySelector(".fact-card");

// ────────────────────────────────────────────────
// State function error / success
// ────────────────────────────────────────────────
function renderErrorState(error = null, lang = "en") {
  if (!errorScreen || !errorCodeEl || !errorMessageEl) {
    console.warn("Елементи помилки не знайдено в DOM");
    return;
  }

  hide(factScreen);
  show(errorScreen);

  const usedLang = lang || "en";
  let msgSet;

  if (!navigator.onLine) {
    msgSet = errorMessages.offline[usedLang] || errorMessages.offline.en;
  } else if (error) {
    msgSet = errorMessages.api[usedLang] || errorMessages.api.en;
  } else {
    msgSet = errorMessages.generic[usedLang] || errorMessages.generic.en;
  }

  if (error?.message && usedLang === "en") {
    msgSet = { ...msgSet };
    msgSet.message += ` (${error.message})`;
  }

  errorCodeEl.textContent = msgSet.code;
  errorMessageEl.textContent = msgSet.message;
}

function renderSuccessState() {
  if (errorScreen) hide(errorScreen);
  if (factScreen) show(factScreen);
}

function updateErrorText(currentLang) {
  if (errorScreen && !errorScreen.classList.contains("hidden")) {
    renderErrorState(null, currentLang);
  }
}

// ────────────────────────────────────────────────
// Main logic
// ────────────────────────────────────────────────

// DOM elements
const catBox = document.querySelector(".cat-box");
const mainBtn = document.querySelector(".troll-button");
const langItems = document.querySelectorAll(".lang-list li");
const meowContainer = document.querySelector(".meow-container");
const tryAgainBtn = document.querySelector(".retry-btn");
const nextFactBtn = document.querySelector(".next-fact-btn");
const thankYouScreen = document.querySelector("#thank-you-screen");
const restartBtn = document.querySelector("#restart-btn");

document.addEventListener("DOMContentLoaded", () => {
  HideBeforeIntro();
  initCurtain();

  let userInteracted = false;
  const audio = new Audio("./assets/sounds/space.mp3");
  audio.preload = "auto";
  audio.volume = 0.7;
  audio.loop = false;

  function handleFirstInteraction() {
    if (!userInteracted) {
      userInteracted = true;
      audio.play().catch((e) => console.log("Автозапуск заблоковано", e));
      introStart();
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    }
  }

  window.addEventListener("click", handleFirstInteraction);
  window.addEventListener("keydown", handleFirstInteraction);
  window.addEventListener("touchstart", handleFirstInteraction);
});

// ─── Sounds (meow like) ────────────────────────────────────────
const meowCozy = new Audio("./assets/sounds/meow-cozy.mp3");
const meowStandard = new Audio("./assets/sounds/meow-standard.mp3");

meowCozy.preload = "auto";
meowStandard.preload = "auto";
meowCozy.volume = 0.65;
meowStandard.volume = 0.65;

// Сozy Meow
function playCozyMeow() {
  meowCozy.currentTime = 0;
  meowCozy.play().catch((err) => {
    console.log("Cozy meow not loading:", err);
  });
}

// Standard Meow
function playStandardMeow() {
  meowStandard.currentTime = 0;
  meowStandard.play().catch((err) => {
    console.log("Standard meow not loading:", err);
  });
}

// Global state
let currentLang = "en";
let clicks = 0;
let currentFactIndex = 0;
let localCatQueue = [];

function initAudio() {
  const audio = new Audio("sound.mp3");
  audio.play().catch((e) => {
    console.log("Автозапуск заблоковано", e);
  });
}

function preloadImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    img.onload = resolve;
    img.onerror = resolve;
  });
}

async function loadNewFact() {
  try {
    if (!navigator.onLine) {
      throw new Error("Offline");
    }

    if (localCatQueue.length === 0) {
      const data = await fetchTheCat();
      if (!data || data.length === 0) {
        throw new Error("No data from API");
      }

      const preloadPromises = data
        .slice(0, 6)
        .map((cat) => preloadImage(cat.imageUrl));

      await Promise.allSettled(preloadPromises);
      localCatQueue = data;
    }

    const currentCat = localCatQueue.shift();
    if (currentCat) {
      const catUrl = currentCat.imageUrl;
      renderFactCard(currentLang, catUrl, currentFactIndex);
      renderSuccessState();
      return true;
    }
    return false;
  } catch (error) {
    hide(meowContainer);
    console.error("Cat Fetch Error:", error.message);
    renderErrorState(error, currentLang);
    return false;
  }
}

// ────────────────────────────────────────────────
// Event Listeners
// ────────────────────────────────────────────────

tryAgainBtn?.addEventListener("click", async () => {
  const success = await loadNewFact();
  if (success) {
    console.log("Успішно перепідключено!");
  }
});

langItems.forEach((item) => {
  item.addEventListener("click", () => {
    currentLang = item.getAttribute("data-lang");
    updateInterface(currentLang, clicks, currentFactIndex);

    const textElement = document.querySelector(".cat-fact-text");
    if (
      textElement &&
      currentFactIndex >= 0 &&
      currentFactIndex < catFacts.length
    ) {
      const newText =
        catFacts[currentFactIndex][currentLang] ||
        catFacts[currentFactIndex].en ||
        "No fact available";
      textElement.textContent = newText;
    }

    updateThankYou();

    updateErrorText(currentLang);
  });
});

mainBtn?.addEventListener("click", async () => {
  if (clicks >= 3) return;

  clicks++;
  updateInterface(currentLang, clicks, currentFactIndex);

  if (clicks === 1) {
    spawnConfetti();
  }

  if (clicks >= 3) {
    playStandardMeow();
    await curtainTransition(async () => {
      currentFactIndex = 0;
      const success = await loadNewFact();
      if (success) {
        hide(meowContainer);
        const card = document.querySelector(".fact-card");
        if (card) show(card);
        initPawBackground({ count: 14, emoji: "🐾" });
      }
    });
  }
});

if (nextFactBtn) {
  nextFactBtn.addEventListener("click", async () => {
    if (currentFactIndex >= catFacts.length - 1) {
      await curtainTransition(async () => {
        showThankYou();
      });
      return;
    }
    playCozyMeow();
    currentFactIndex = moveNext(currentFactIndex);

    await loadNewFact();
  });
}

restartBtn.addEventListener("click", () => {
  window.location.reload();
});

//===============================
//=== Cute pawn-icon
//===============================
document.addEventListener("DOMContentLoaded", () => {
  const details = document.querySelector("details.lang-selector");
  const langList = details.querySelector(".lang-list");

  langList.addEventListener("click", (e) => {
    const item = e.target.closest("li[data-lang]");
    if (!item) return;

    langList.querySelectorAll("li[aria-current]").forEach((el) => {
      el.removeAttribute("aria-current");
    });

    item.setAttribute("aria-current", "true");
  });

  document.addEventListener("click", (e) => {
    if (!details.contains(e.target)) {
      details.removeAttribute("open");
    }
  });
});

// Greetings screen
function updateThankYou() {
  const texts = greetingsScreen[currentLang] || greetingsScreen.en; 

  thankYouScreen.querySelector("h1").textContent = texts.h1;

  const githubP = thankYouScreen.querySelector(".github-link p");
  if (githubP) githubP.textContent = texts.p;

  thankYouScreen.querySelector("#restart-btn").textContent = texts.tryAgainBtn;
}

function showThankYou() {
  hide(factScreen);
  hide(meowContainer);
  show(thankYouScreen);

  updateThankYou();

  spawnConfetti();
}

// Interface initialization
updateInterface(currentLang, clicks, currentFactIndex);
