// Entry script for pages/singleplayer.html.
// Wiring only: import from game/, ui/ and api/, then start. No rules here.
import "../main.js";

// ========================================
// #region Variables

const toggles = document.querySelectorAll('[data-js="panel-toggle"]');

// #endregion Variables
// ========================================
// #region Event listeners

toggles.forEach((toggle) => toggle.addEventListener("click", togglePanel));

// #endregion Event listeners
// ========================================
// #region Functions

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
