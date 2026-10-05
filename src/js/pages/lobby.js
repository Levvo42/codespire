// Entry script for pages/lobby.html.
// Wiring only: import from game/, ui/ and api/, then start. No rules here.
import "../main.js";
import {
  getStat,
  getXpToNextLevel,
  getNextDifficulty,
  DIFFICULTIES,
  CLASS_STATS,
  ITEMS,
  ITEM_INFO,
  TOWERS,
  TOWER_INFO,
} from "../game/player.js";
import { loadGame, saveGame } from "../game/save.js";
import { showError } from "../ui/error-message.js"; //added error ui from battle screen
import { leaveGamePage, startMusic } from "../ui/music.js";
import { togglePanel } from "../ui/panels.js";

// ========================================
// #region Variables
const toggles = document.querySelectorAll(".site-lobby__toggle");

const player = loadGame();
// No hero yet → go create one.
if (!player) window.location.replace("/pages/createplayer.html");

const playerName = document.getElementById("player-name");
const playerClass = document.getElementById("player-class");
const playerLevel = document.getElementById("player-level");
const playerXp = document.getElementById("player-xp");
const playerAvatar = document.getElementById("player-avatar");

const statHp = document.getElementById("stat-hp");
const statAttack = document.getElementById("stat-attack");
const statDefense = document.getElementById("stat-defense");
const statCrit = document.getElementById("stat-crit");
const inventoryList = document.getElementById("inventory-list");

let towerIndex = 0;

const towerSign = document.getElementById("tower-sign");
const towerPrev = document.getElementById("tower-prev");
const towerNext = document.getElementById("tower-next");
const towerPlay = document.getElementById("tower-play");
// Update the button's action label and prestige sign for the selected tower.
const towerPlayActionLabel = towerPlay.querySelector(".site-lobby__hint");
// used for changing play to prestige
const towerPrestigeSign = document.getElementById("tower-sign__prestige");
// used to show tracked prestige#

// #endregion Variables
// ========================================
// #region Event listeners
toggles.forEach((toggle) =>
  toggle.addEventListener("click", () => togglePanel(toggle, toggles)),
);
towerPrev.addEventListener("click", () => changeTower(-1));
towerNext.addEventListener("click", () => changeTower(1));
towerPlay.addEventListener("click", startClimb);
// #endregion Event listeners
// ========================================
// #region Functions
// Writes the player status screen.
function showPlayer(player) {
  playerName.textContent = player.name;
  playerClass.textContent = player.heroClass;
  playerLevel.textContent = player.level;
  const nextLevelXp = getXpToNextLevel(player);
  playerXp.textContent =
    nextLevelXp === null ? "Max" : `${player.xp} / ${nextLevelXp}`;
  playerAvatar.src = `/avatars/${player.avatar}.webp`;
  playerAvatar.alt = `${player.name}'s avatar`;
}

// Writes the player's calculated stats into the Stats panel.
function showStats(player) {
  statHp.textContent = getStat(player, "hp");
  statAttack.textContent = getStat(player, "attack");
  statDefense.textContent = getStat(player, "defense");
  statCrit.textContent = `${CLASS_STATS[player.heroClass].critChance * 100}%`;
}

// Builds one row per item in the Inventory panel.
function showInventory(player) {
  inventoryList.replaceChildren();

  for (const item of ITEMS) {
    const label = document.createElement("dt");
    label.textContent = ITEM_INFO[item].name;

    const count = document.createElement("dd");
    count.textContent = player.inventory[item];

    inventoryList.append(label, count);
  }
}

// ++this tower's prestige and resets difficulty.
function prestigeTower(tower) {
  // only a fully clearedtower can prestige.
  if (player.clearedLevels[tower] !== DIFFICULTIES.at(-1)) return;

  const previousPrestige = player.prestigeLevels[tower]; // =tmp fallback memory
  player.prestigeLevels[tower] += 1; // prestige rank++
  player.clearedLevels[tower] = null; // difficulty reset

  if (!saveGame(player)) {
    // prestige failsafecheck
    player.prestigeLevels[tower] = previousPrestige; // restores fallbackmemory
    player.clearedLevels[tower] = DIFFICULTIES.at(-1); // resets tower to hard
    showError("Could not save prestige.");
    return; //abort prestige function post fail
  }

  showTower();
}

// Moves one tower back (-1) or forward (1) and wraps around at the ends.
function changeTower(step) {
  towerIndex = towerIndex + step;
  if (towerIndex < 0) towerIndex = TOWERS.length - 1;
  if (towerIndex >= TOWERS.length) towerIndex = 0;
  showTower();
}

// Shows the tower name and next difficulty, and locks Play if it can't be played.
function showTower() {
  const tower = TOWERS[towerIndex];
  const info = TOWER_INFO[tower];
  const difficulty = getNextDifficulty(player, tower);
  const prestige = player.prestigeLevels[tower];

  if (!info.available) {
    towerSign.textContent = `${info.name}: Coming soon`;
  } else if (!difficulty) {
    towerSign.textContent = `${info.name}: Cleared!`;
  } else {
    towerSign.textContent = `${info.name}: ${difficulty}`;
  }

  towerPrestigeSign.textContent = `Prestige ${prestige}`; // sets prestige# sign
  towerPrestigeSign.classList.toggle(
    "site-lobby__sign-prestige--visible",
    prestige > 0, // hides prestige if 0
  );
  // A fully cleared available tower uses Play as its prestige action.
  const canPrestige =
    info.available && player.clearedLevels[tower] === DIFFICULTIES.at(-1);
  towerPlay.classList.toggle("site-lobby__button--prestige-ready", canPrestige);
  towerPlayActionLabel.textContent = canPrestige ? "Play?" : "Play"; // changes play status to prestige
  towerPlay.setAttribute("aria-label", canPrestige ? "Play?" : "Play");
  towerPlay.disabled = //didnt remove but probably wont be needed after prestige implementation
    !info.available ||
    (!difficulty && player.clearedLevels[tower] !== DIFFICULTIES.at(-1));
}
// Goes to the fight page with the chosen tower and difficulty in the address.
function startClimb() {
  const tower = TOWERS[towerIndex];
  const difficulty = getNextDifficulty(player, tower);
  if (!difficulty) {
    // No next difficulty means HARD is cleared; prestige instead of starting a run.
    prestigeTower(tower);
    return;
  }

  const params = new URLSearchParams({ tower, difficulty });
  leaveGamePage(`/pages/singleplayer.html?${params}`);
}
// #endregion Functions
// ========================================

if (player) {
  showPlayer(player);
  showStats(player);
  showInventory(player);
  showTower();
  startMusic("lobby");
}
