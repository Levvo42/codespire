// Entry script for pages/lobby.html.
// Wiring only: import from game/, ui/ and api/, then start. No rules here.
import "../main.js";
import {
  getStat,
  getXpToNextLevel,
  getNextDifficulty,
  CLASS_STATS,
  ITEMS,
  ITEM_INFO,
  TOWERS,
  TOWER_INFO,
} from "../game/player.js";
import { loadGame } from "../game/save.js";
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

  if (!info.available) {
    towerSign.textContent = `${info.name}: Coming soon`;
  } else if (!difficulty) {
    towerSign.textContent = `${info.name}: Cleared!`;
  } else {
    towerSign.textContent = `${info.name}: ${difficulty}`;
  }

  towerPlay.disabled = !info.available || !difficulty;
}
// Goes to the fight page with the chosen tower and difficulty in the address.
function startClimb() {
  const tower = TOWERS[towerIndex];
  const difficulty = getNextDifficulty(player, tower);
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
