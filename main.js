import { fetchTheCat } from "./api/random-cat.js";
import { updateInterface } from "./modules/ui-updater.js";
import { catFacts } from "./modules/facts/facts.js";
import { spawnConfetti } from "./modules/confetti.js";
import { hide } from "./modules/hide.js";
import { renderFactCard, moveNext } from "./modules/facts-card.js";
import { show } from "./modules/hide.js";

// DOM
const catBox = document.querySelector(".cat-box");
const mainBtn = document.querySelector(".troll-button");
const langItems = document.querySelectorAll(".lang-list li");
const meowContainer = document.querySelector(".meow-container");

// (Global State)
let currentLang = "en";
let clicks = 0;
let currentFactIndex = Math.floor(Math.random() * catFacts.length);

// Image links
let localCatQueue = [];

async function loadNewFact() {
  if (localCatQueue.length === 0) {
    const data = await fetchTheCat();
    localCatQueue = data;
  }

  const currentCat = localCatQueue.shift();

  if (currentCat) {
    const catUrl = `https://cataas.com/cat/${currentCat.id}`;
    renderFactCard(currentLang, catUrl);
  }
}

// Language select
langItems.forEach((item) => {
  item.addEventListener("click", () => {
    currentLang = item.getAttribute("data-lang");

    updateInterface(currentLang, clicks, currentFactIndex);

    renderFactCard(currentLang, null);
  });
});

// Button listner
mainBtn.addEventListener("click", async () => {
  clicks++;

  currentFactIndex = Math.floor(Math.random() * catFacts.length);
  updateInterface(currentLang, clicks, currentFactIndex);

  if (clicks === 1) {
    spawnConfetti();
  }

  if (clicks >= 3) {
    hide(meowContainer);
    const card = document.querySelector(".fact-card");
    if (card) {
      show(card);

      await loadNewFact();
    }
  }
});

const nextFactBtn = document.querySelector(".next-fact-btn");

if (nextFactBtn) {
  nextFactBtn.addEventListener("click", async () => {
    const hasMore = moveNext();
    if (hasMore) {
      await loadNewFact();
    } else {
      nextFactBtn.style.opacity = "0.5";
      nextFactBtn.disabled = true;
    }
  });
}

updateInterface(currentLang, clicks, currentFactIndex);
