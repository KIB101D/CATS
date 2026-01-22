// import { hide, show } from "./hide.js";
// import { errorMessages } from "./facts/facts.js";

// const errorScreen = document.querySelector("#screen-error");
// const errorCodeEl = document.querySelector(".error-code");
// const errorMessageEl = document.querySelector(".error-message");
// const factScreen = document.querySelector(".fact-card");

// export function renderErrorState(error = null, lang = "en") {
//   if (!errorScreen || !errorCodeEl || !errorMessageEl) {
//     console.warn("Елементи помилки не знайдено в DOM");
//     return;
//   }

//   hide(factScreen);
//   show(errorScreen);

//   const usedLang = lang || "en";

//   let msgSet;

//   if (!navigator.onLine) {
//     msgSet = errorMessages.offline[usedLang] || errorMessages.offline.en;
//   } else {
//     // все інше вважаємо проблемою API / сервера
//     msgSet = errorMessages.api[usedLang] || errorMessages.api.en;
//   }

//   // якщо є конкретна помилка і хочемо показати message — можна додати
//   if (error?.message && usedLang === "en") {
//     // наприклад для дебагу на англійській можна показати оригінальне повідомлення
//     msgSet.message += ` (${error.message})`;
//   }

//   errorCodeEl.textContent = msgSet.code;
//   errorMessageEl.textContent = msgSet.message;
// }

// export function renderSuccessState() {
//   if (errorScreen) hide(errorScreen);
//   if (factScreen) show(factScreen);
// }

// export function updateErrorText(currentLang) {
//   if (errorScreen && !errorScreen.classList.contains("hidden")) {
//     renderErrorState(null, currentLang); // без error, бо це не нова помилка
//   }
// }
