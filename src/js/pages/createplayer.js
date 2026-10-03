// Entry script for pages/createplayer.html.
// Wiring only: import from game/, ui/ and api/, then start. No rules here.
import "../main.js";
import { CLASSES, createPlayer, checkName } from "../game/player.js";
import { saveGame, loadGame } from "../game/save.js";

// ========================================
// #region Variables
let classIndex = 0; // which class in CLASSES is shown (0 = warrior)

const form = document.querySelector(".site-createplayer-container__form");
const nameInput = document.getElementById("player-name");
const nameError = document.getElementById("name-error");
const classText = document.getElementById("player-class");
const avatarImage = document.getElementById("avatar-image");
const prevButton = document.getElementById("avatar-prev");
const nextButton = document.getElementById("avatar-next");
// #endregion Variables
// ========================================
// #region Event listeners
prevButton.addEventListener("click", () => changeClass(-1));
nextButton.addEventListener("click", () => changeClass(1));
form.addEventListener("submit", startGame);
// #endregion Event listeners
// ========================================
// #region Functions
// Moves one step back (-1) or forward (1) and wraps around at the ends.
function changeClass(step) {
  classIndex = classIndex + step;
  if (classIndex < 0) classIndex = CLASSES.length - 1; // before first → last
  if (classIndex >= CLASSES.length) classIndex = 0; // after last → first
  showClass();
}

// Shows the selected class name and its avatar.
function showClass() {
  const heroClass = CLASSES[classIndex];
  classText.textContent = `Class: ${heroClass}`;
  avatarImage.src = `/avatars/${heroClass}.webp`;
  avatarImage.alt = `${heroClass} avatar`;
}

// Checks the name, creates and saves the player, then goes to the lobby.
function startGame(event) {
  event.preventDefault();

  const error = checkName(nameInput.value);
  nameError.textContent = error;
  if (error) return;

  if (loadGame() && !confirm("This replaces your current hero. Continue?")) {
    return;
  }

  const player = createPlayer(nameInput.value.trim(), CLASSES[classIndex]);
  if (!saveGame(player)) {
    nameError.textContent = "Could not save your hero.";
    return;
  }

  window.location.href = "/pages/lobby.html";
}
// #endregion Functions
// ========================================
