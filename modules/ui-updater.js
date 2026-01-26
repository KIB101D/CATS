import {
  uiMain,
  uiFacts,
  catFacts,
  errorMessages,
} from "./translation/translations.js";

export function updateInterface(lang, clickCount = 0, factIndex = null) {
  const mainBtn = document.querySelector(".troll-button");
  if (mainBtn) {
    const btnIndex = clickCount % uiMain.length;
    mainBtn.textContent = uiMain[btnIndex][lang].button;
  }

  const nextFactBtn = document.querySelector(".next-fact-btn");
  if (nextFactBtn) {
    nextFactBtn.textContent = uiFacts[lang].button;
  }

  const factTextElement = document.querySelector(".cat-fact");
  if (factTextElement && factIndex !== null) {
    factTextElement.textContent = catFacts[factIndex][lang];
  }
}
