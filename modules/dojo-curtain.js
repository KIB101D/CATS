let curtain;
let door;

const creakSound = new Audio("./assets/sounds/sliding-door.mp3");
const thudSound = new Audio("./assets/sounds/door-thud.mp3");

creakSound.volume = 0.45;
thudSound.volume = 0.6;

export function initCurtain() {
  curtain = document.getElementById("dojo-curtain");
  door = curtain?.querySelector(".door");
}

export function closeCurtain() {
  if (!curtain) return;
  creakSound.currentTime = 0;
  creakSound.play();

  curtain.classList.remove("open");
  curtain.classList.add("active");

  setTimeout(() => {
    thudSound.currentTime = 0;
    thudSound.play();
  }, 1850);
}

export function openCurtain() {
  if (!curtain) return;
  creakSound.currentTime = 0;
  creakSound.play();

  curtain.classList.remove("active");
  curtain.classList.add("open");
}

export function curtainTransition(fn, delay = 2000) {
  return new Promise(async (resolve) => {
    closeCurtain();
    setTimeout(async () => {
      await fn();
      openCurtain();
      resolve();
    }, delay);
  });
}
