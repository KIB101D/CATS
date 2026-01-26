// ─── Sounds (meow like) ────────────────────────────────────────
const meowSounds = [
  new Audio("./assets/sounds/meow-cozy.mp3"),
  new Audio("./assets/sounds/meow-cozy2.wav"),
  new Audio("./assets/sounds/meow-angry.wav"),
];

let lastMeowIndex = -1;

meowSounds.forEach((sound) => {
  sound.preload = "auto";
  sound.volume = 0.65;
});

export function playRandomMeow() {
  let randomIndex = Math.floor(Math.random() * meowSounds.length);

  while (randomIndex === lastMeowIndex && meowSounds.length > 1) {
    randomIndex = Math.floor(Math.random() * meowSounds.length);
  }

  lastMeowIndex = randomIndex;

  const selectedSound = meowSounds[randomIndex];
  selectedSound.currentTime = 0;
  selectedSound.play().catch((err) => console.log("Meow error:", err));
}

// Standard Meow
const meowStandard = new Audio("./assets/sounds/meow-standard.mp3");
export function playStandardMeow() {
  meowStandard.currentTime = 0;
  meowStandard.play().catch((err) => {
    console.log("Standard meow not loading:", err);
  });
}
