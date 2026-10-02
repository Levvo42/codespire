// Entry script for pages/singleplayer.html.
// Wiring only: import from game/, ui/ and api/, then start. No rules here.
// The lobby opens this page as singleplayer.html?tower=html&difficulty=EASY
import "../main.js";
import { getMonsterForFloor } from "../api/monsters.js";
import { getQuestions } from "../api/questions.js";
import { QUESTIONS_PER_RUN, TOWER_LAYOUTS } from "../game/constants.js";
import {
  CLASS_STATS,
  DIFFICULTIES,
  TOWER_INFO,
  TOWERS,
  getStat,
} from "../game/player.js";
import { addXp, markCleared, toPlayerXp } from "../game/progress.js";
import { loadGame, saveGame } from "../game/save.js";
import { startGame } from "../ui/battle-screen.js";

// ========================================
// #region Variables
const LOBBY_URL = "/pages/lobby.html";
const CREATE_PLAYER_URL = "/pages/createplayer.html";

const toggles = document.querySelectorAll('[data-js="panel-toggle"]');

const params = new URLSearchParams(window.location.search);
const tower = params.get("tower"); // e.g. "html"
const difficulty = params.get("difficulty"); // "EASY" | "MEDIUM" | "HARD"

const player = loadGame(); // null when no hero has been created yet
// #endregion Variables
// ========================================
// #region Event listeners
toggles.forEach((toggle) => toggle.addEventListener("click", togglePanel));
// #endregion Event listeners
// ========================================
// #region Start
if (!player) {
  window.location.replace(CREATE_PLAYER_URL); // no hero yet: create one first
} else if (!isPlayable(tower, difficulty)) {
  window.location.replace(LOBBY_URL); // anyone can type a URL, so check it
} else {
  startGame({
    player,
    stats: {
      maxHp: getStat(player, "hp"),
      attack: getStat(player, "attack"),
      defense: getStat(player, "defense"),
      critChance: CLASS_STATS[player.heroClass].critChance,
    },
    layout: TOWER_LAYOUTS[difficulty],
    towerName: TOWER_INFO[tower].name,
    difficulty,
    loadMonster: getMonsterForFloor,
    loadQuestions: () => getQuestions(tower, difficulty, QUESTIONS_PER_RUN),
    onMonsterSlain: saveMonsterSlain,
    onLeaveTower: goToLobby,
  });
}
// #endregion Start
// ========================================
// #region Functions
// A tower the lobby could have sent us to: known, open, with a known difficulty
function isPlayable(towerId, difficultyName) {
  return (
    TOWERS.includes(towerId) &&
    TOWER_INFO[towerId].available &&
    DIFFICULTIES.includes(difficultyName)
  );
}

// A monster is slain: add its XP (and mark the tower cleared after the boss),
// then save. The lobby reads the save, so it shows the new level/XP and the
// next difficulty.
function saveMonsterSlain(monster, isTowerCleared) {
  if (isTowerCleared) {
    markCleared(player, tower, difficulty);
  }

  const levelsGained = addXp(player, monster.xp);

  return {
    xpGained: toPlayerXp(monster.xp),
    levelsGained,
    level: player.level,
    isSaved: saveGame(player),
  };
}

function goToLobby() {
  window.location.href = LOBBY_URL;
}

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
