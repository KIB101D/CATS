// modules/facts-card.js
import { getElement } from "./dom.js";
import { catFacts, uiFacts } from "./facts/facts.js";

let currentFactIndex = 0;

export function renderFactCard(lang, catUrl = null) {
  const factText = getElement(".cat-fact-text");
  const factBtn = getElement(".next-fact-btn");
  const factImg = getElement(".cat-fact-img");

  if (!factText || !factBtn || !factImg) {
    console.warn("Не знайдено елементи картки");
    return;
  }

  if (currentFactIndex < catFacts.length) {
    factText.textContent =
      catFacts[currentFactIndex][lang] || catFacts[currentFactIndex].en;
  } else {
    factText.textContent = "Факти закінчилися...";
  }

  factBtn.textContent = uiFacts[lang]?.button || "Наступний факт";

  if (catUrl) {
    factImg.classList.add("loading");
    factImg.classList.remove("loaded");

    factImg.src = catUrl;

    factImg.onload = () => {
      setTimeout(() => {
        factImg.classList.remove("loading");
        factImg.classList.add("loaded");
      }, 80);
    };

    factImg.onerror = () => {
      factImg.src = "https://cataas.com/cat?type=cute";
      factImg.classList.remove("loading");
      console.warn("Кіт не завантажився:", catUrl);
    };
  }
}

export function moveNext() {
  if (currentFactIndex < catFacts.length - 1) {
    currentFactIndex++;
    return true;
  }
  return false;
}

export function getCurrentIndex() {
  return currentFactIndex;
}
