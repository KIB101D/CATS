export const getElement = (selector) => {
  const el = document.querySelector(selector);
  if (!el) throw new Error(`Element not found: ${selector}`);
  return el;
};

export const getElementSafe = (selector) => {
  return document.querySelector(selector);
};
