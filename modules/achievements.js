const sounds = {
  standard: new Audio(
    "https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg",
  ),
  rare: new Audio(
    "https://actions.google.com/sounds/v1/cartoon/cartoon_cowbell.ogg",
  ),
  legendary: new Audio(
    "https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg",
  ),
};

Object.values(sounds).forEach((audio) => {
  audio.volume = 0.3;
});

export function showToast(type = "standard", options = {}) {
  const {
    title = `${type.toUpperCase()} ACHIEVEMENT`,
    desc = "Котяча майстерність",
    icon = "🐾",
  } = options;

  const old = document.querySelector(".toast");
  if (old) old.remove();

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-inner">
      <div class="icon">${icon}</div>
      <div>
        <div class="title">${title}</div>
        <div class="desc">${desc}</div>
      </div>
    </div>
  `;
  document.body.appendChild(toast);

  const audio = sounds[type];
  audio.currentTime = 0;
  audio.play();

  if (type === "legendary") {
    setTimeout(() => audio.play(), 600);
  }

  // Визначаємо час відображення залежно від типу ачівки (в мілісекундах)
  const durationMap = {
    standard: 5000,
    rare: 6000,
    legendary: 7500,
  };

  const visibleDuration = durationMap[type] || 5000;

  setTimeout(() => {
    toast.classList.add("fade-out");
    setTimeout(() => toast.remove(), 500);
  }, visibleDuration);
}
