import { getElement } from "./dom.js";
import { catFacts, uiFacts } from "./facts/facts.js";

let currentFactIndex = 0;

export function renderFactCard(lang, catUrl) {
  const factText = getElement(".cat-fact-text");
  const factBtn = getElement(".next-fact-btn");
  const factImg = getElement(".cat-fact-img");

  if (currentFactIndex < catFacts.length) {
    factText.textContent = catFacts[currentFactIndex][lang];
    factBtn.textContent = uiFacts[lang].button;

    if (catUrl) {
      factImg.src = catUrl;
    }
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
