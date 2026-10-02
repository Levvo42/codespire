// Entry script for pages/lobby.html.
// Wiring only: import from game/, ui/ and api/, then start. No rules here.
import "../main.js";
import {
  createPlayer,
  getStat,
  CLASS_STATS,
  ITEMS,
  ITEM_INFO,
} from "../game/player.js";
import { saveGame, loadGame } from "../game/save.js";

window.test = { createPlayer, saveGame, loadGame };

// ========================================
// #region Variables
const toggles = document.querySelectorAll(".site-lobby__toggle");

const player = loadGame();

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

function showPlayer(player) {
  playerName.textContent = player.name;
  playerClass.textContent = player.heroClass;
  playerLevel.textContent = player.level;
  playerXp.textContent = player.xp;
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
// #endregion Functions
// ========================================

if (player) {
  showPlayer(player);
  showStats(player);
  showInventory(player);
}
