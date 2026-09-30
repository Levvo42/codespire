// Entry script for pages/credits.html.
// Wiring only: import from game/, ui/ and api/, then start. No rules here.
import "../main.js";

window.addEventListener("load", () => {
  const music = document.getElementById("music");
  const playBtn = document.getElementById("playBtn");
  music.volume = 0.4;

  music.play().catch(() => {
    document.addEventListener("click", () => music.play(), { once: true });
  });
  playBtn.addEventListener("click", () => {
    music.play();
  });
});
