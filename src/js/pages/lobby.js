// Entry script for pages/lobby.html.
// Wiring only: import from game/, ui/ and api/, then start. No rules here.
import "../main.js";
import { createPlayer } from "../game/player.js";
import { saveGame, loadGame } from "../game/save.js";

window.test = { createPlayer, saveGame, loadGame };

// ========================================
// #region Variables
const toggles = document.querySelectorAll(".site-lobby__toggle");
// #endregion Variables
// ========================================
// #region Event listeners
toggles.forEach((toggle) => toggle.addEventListener("click", togglePanel));
// #endregion Event listeners
// ========================================
// #region Functions
// Opens the clicked tab's panel and closes the other one,
// so only one side panel is open at a time.
function togglePanel(event) {
  const clicked = event.currentTarget;

  toggles.forEach((toggle) => {
    const panel = document.getElementById(toggle.getAttribute("aria-controls"));
    const isOpen = toggle === clicked && !panel.classList.contains("is-open");

    panel.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", isOpen);
  });
}
// #endregion Functions
// ========================================
