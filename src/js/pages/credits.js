// Entry script for pages/credits.html.
// Wiring only: import from game/, ui/ and api/, then start. No rules here.
import "../main.js";
import { loadSettings } from "../game/settings.js";

// #region Elements
const music = document.getElementById("music");
const playBtn = document.getElementById("play-btn");
music.volume = loadSettings().volume;
document.addEventListener(
  "volume-change",
  (event) => (music.volume = event.detail),
);
// #endregion Elements

// #region Autoplay
music.play().catch(() => {
  document.addEventListener("click", () => music.play(), { once: true });
});
// #endregion Autoplay

// #region Play/Pause button
playBtn.addEventListener("click", () => {
  if (music.paused) {
    music.play();
    playBtn.textContent = "||";
    playBtn.setAttribute("aria-label", "Pause music");
  } else {
    music.pause();
    playBtn.textContent = "▷";
    playBtn.setAttribute("aria-label", "Play music");
  }
});
// #endregion Play/Pause button
