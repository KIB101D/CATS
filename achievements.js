const sounds = {
  standard: new Audio(
    "https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg",
  ),
  rare: new Audio(
    "https://actions.google.com/sounds/v1/cartoon/cartoon_cowbell.ogg",
  ),
  legendary: new Audio(
    "https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg",
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

  setTimeout(() => {
    toast.classList.add("fade-out");
    setTimeout(() => toast.remove(), 500);
  }, 3100);
}
