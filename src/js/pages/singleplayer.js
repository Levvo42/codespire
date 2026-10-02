// Entry script for pages/singleplayer.html.
// Wiring only: import from game/, ui/ and api/, then start. No rules here.
import "../main.js";
import { getMonsterForFloor } from "../api/monsters.js";
import { getQuestions } from "../api/questions.js";
import {
  QUESTION_DIFFICULTY,
  QUESTIONS_PER_RUN,
  TEST_PLAYER,
  TOWER_DIFFICULTY,
  TOWER_LAYOUTS,
  TOWER_NAME,
} from "../game/constants.js";
import { CLASS_STATS, createPlayer, getStat } from "../game/player.js";
import { loadGame } from "../game/save.js";
import { startGame } from "../ui/battle-screen.js";

// ========================================
// #region Variables
const toggles = document.querySelectorAll('[data-js="panel-toggle"]');

// The saved player, or a test player until character creation saves one
const player =
  loadGame() ?? createPlayer(TEST_PLAYER.name, TEST_PLAYER.heroClass);
// #endregion Variables
// ========================================
// #region Event listeners
toggles.forEach((toggle) => toggle.addEventListener("click", togglePanel));
// #endregion Event listeners
// ========================================
// #region Start
startGame({
  player,
  stats: {
    maxHp: getStat(player, "hp"),
    attack: getStat(player, "attack"),
    defense: getStat(player, "defense"),
    critChance: CLASS_STATS[player.heroClass].critChance,
  },
  layout: TOWER_LAYOUTS[TOWER_DIFFICULTY],
  towerName: TOWER_NAME,
  difficulty: TOWER_DIFFICULTY,
  loadMonster: getMonsterForFloor,
  loadQuestions: () => getQuestions(QUESTION_DIFFICULTY, QUESTIONS_PER_RUN),
});
// #endregion Start
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
