export const keys = {};

export function setupInput() {
  window.addEventListener("keydown", (event) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(event.key)) {
      event.preventDefault(); // stop scrolling
    }
  });
  document.addEventListener('keydown', e => keys[e.key] = true);
  document.addEventListener('keyup', e => keys[e.key] = false);
}
