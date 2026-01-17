export function spawnConfetti() {
  if (typeof confetti === "function") {
    confetti({
      particleCount: 300,
      spread: 100,
      origin: { y: 0.6 },
      colors: ["#ff9f00", "#ffffff", "#5dade2"],
    });
  } else {
    console.warn("Confetti.js doesnt found.");
  }
}
