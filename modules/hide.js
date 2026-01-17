export function hide(element) {
  if (element) {
    element.classList.add("hidden");
  }
}

export function show(element) {
  if (element) {
    element.classList.remove("hidden");
  }
}

export function toggle(element) {
  if (element) {
    element.classList.toggle("hidden");
  }
}
