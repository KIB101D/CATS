import { fetchTheCat } from "./api/random-cat.js";
import { updateInterface } from "./modules/ui-updater.js";
import {
  catFacts,
  errorMessages,
  greetingsScreen,
  achievementsText,
} from "./modules/translation/translations.js";
import { spawnConfetti } from "./modules/confetti.js";
import { hide, show } from "./modules/hide.js";
import { renderFactCard, moveNext } from "./modules/facts-card.js";
import { initCurtain, curtainTransition } from "./modules/dojo-curtain.js";
import { HideBeforeIntro, introStart } from "./modules/intro-start.js";
import { playRandomMeow, playStandardMeow } from "./modules/meow.js";
import { showToast } from "./modules/achievements.js";
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

  const retryBtn = document.querySelector(".retry-btn");
  if (retryBtn) {
    retryBtn.textContent = msgSet.retryBtn || "Try again";
  }
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
  audio.volume = 0.2;
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

// Global state
let currentLang = "en";
let clicks = 0;
let currentFactIndex = 0;
let localCatQueue = [];
let errorToastShown = false;
let achievementShown = false;

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

    if (!errorToastShown) {
      showToast("rare", {
        title: achievementsText.error.title[currentLang],
        desc: achievementsText.error.desc[currentLang],
        icon: "😬",
      });
      errorToastShown = true;
    }
    return false;
  }
}

// ────────────────────────────────────────────────
// Event Listeners
// ────────────────────────────────────────────────

tryAgainBtn?.addEventListener("click", async () => {
  tryAgainBtn.disabled = true; // Захист від спаму при помилці мережі
  const success = await loadNewFact();
  if (success) {
    console.log("Успішно перепідключено!");
  }
  tryAgainBtn.disabled = false;
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

    showToast("standard", {
      title: achievementsText.first.title[currentLang],
      desc: achievementsText.first.desc[currentLang],
      icon: "🎆",
    });
  }

  if (clicks >= 3) {
    mainBtn.disabled = true; // Блокуємо, щоб під час анімації шторки не наклікали знову
    playStandardMeow();
    await curtainTransition(async () => {
      currentFactIndex = 0;
      const success = await loadNewFact();
      if (success) {
        hide(meowContainer);
        const card = document.querySelector(".fact-card");
        if (card) show(card);
        initPawBackground({
          emoji: "🐾",
          onClick: (count) => {
            if (count === 5 && !achievementShown) {
              achievementShown = true;

              showToast("legendary", {
                title: achievementsText.secretPawClicks.title[currentLang],
                desc: achievementsText.secretPawClicks.desc[currentLang],
                icon: "🌿",
              });
            }
          },
        });
      } else {
        mainBtn.disabled = false; // Якщо раптом помилка, повертаємо кнопку в робочий стан
      }
    });
  }
});

if (nextFactBtn) {
  nextFactBtn.addEventListener("click", async () => {
    nextFactBtn.disabled = true;

    if (currentFactIndex >= catFacts.length - 1) {
      showToast("legendary", {
        title: achievementsText.third.title[currentLang],
        desc: achievementsText.third.desc[currentLang],
        icon: "💌",
      });

      await curtainTransition(async () => {
        showThankYou();
      });
      return;
    }

    playRandomMeow();
    currentFactIndex = moveNext(currentFactIndex);
    await loadNewFact();
    nextFactBtn.disabled = false;
  });
}

restartBtn?.addEventListener("click", async () => {
  restartBtn.disabled = true;

  await curtainTransition(async () => {
    // 1. Повністю скидаємо стан до 0 кліків
    clicks = 0;
    currentFactIndex = 0;
    localCatQueue = [];
    errorToastShown = false;
    achievementShown = false;

    // 2. Налаштовуємо видимість екранів для старту
    hide(thankYouScreen); // Ховаємо фінал
    hide(factScreen); // Ховаємо картку (вона з'явиться тільки після 3-го кліку)
    show(meowContainer); // Показуємо плашку нявкання, яка потрібна на початку

    if (mainBtn) {
      mainBtn.disabled = false; // Вмикаємо троль-кнопку
    }

    // 3. Повертаємо інтерфейс та кнопку в центр екрана
    updateInterface(currentLang, clicks, currentFactIndex);

    // 4. Тихо готуємо та прелоадимо перший факт у бекграунді
    await loadNewFact();

    // 🔥 РАТУВАЛЬНИЙ РЯДОК: Оскільки loadNewFact примусово викликає show(factScreen),
    // ми ховаємо картку НАЗАД відразу після завантаження, щоб користувач її не побачив.
    hide(factScreen);

    restartBtn.disabled = false;
  });
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
}

// Interface initialization
updateInterface(currentLang, clicks, currentFactIndex);
