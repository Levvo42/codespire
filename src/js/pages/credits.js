// Entry script for pages/credits.html.
// Wiring only: import from game/, ui/ and api/, then start. No rules here.
import "../main.js";
import { loadSettings } from "../game/settings.js";

import playIcon from "../../assets/icons/sound-off.svg";
import pauseIcon from "../../assets/icons/sound-on.svg";

// #region Elements
const music = document.getElementById("music");
const playBtn = document.getElementById("play-btn");
music.volume = loadSettings().volume;
document.addEventListener(
  "volume-change",
  (event) => (music.volume = event.detail),
);
// #endregion Elements

// #region Sound toggle icon
const icon = document.createElement("img");
icon.src = playIcon;
icon.alt = "sound on";
playBtn.appendChild(icon);
// #endregion Sound toggle icon

// #region Autoplay music
music.play().catch(() => {
  document.addEventListener("click", () => music.play(), { once: true });
});
// #endregion Autoplay music

// #region Sound controls
playBtn.addEventListener("click", () => {
  if (music.paused) {
    music.play();
    icon.src = playIcon;
    icon.alt = "sound on";
    playBtn.setAttribute("aria-label", "Turn sound off");
  } else {
    music.pause();
    icon.src = pauseIcon;
    icon.alt = "sound off";
    playBtn.setAttribute("aria-label", "Turn sound on");
  }
});
// #endregion Sound controls
