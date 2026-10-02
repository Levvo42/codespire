// Player progress: XP per slain monster, level-ups and cleared difficulties.
// Same names and behaviour as the functions planned for player.js (handover.md).
// When those are in player.js, import them from there instead and delete this file.
import { DIFFICULTIES } from "./player.js";

const XP_SCALE = 0.1; // D&D XP is big (a CR 8 boss alone gives 3900), so it is scaled down
const XP_PER_LEVEL = 1000; // level 1 → 2 needs 1000 XP, 2 → 3 needs 2000, and so on
const MAX_LEVEL = 99; // the save check in player.js rejects higher levels

/**
 * Turns a slain monster's D&D XP into the XP the player gets.
 *
 * @param {number} monsterXp - The monster's D&D XP (from the API).
 * @returns {number} Whole XP points for the player, at least 1.
 */
export function toPlayerXp(monsterXp) {
  return Math.max(Math.round(monsterXp * XP_SCALE), 1);
}

/**
 * Adds XP and handles level-ups. The player's xp is the progress towards the
 * next level, so it starts over from what is left after each level-up.
 *
 * @param {object} player - The saved player (changed in place).
 * @param {number} monsterXp - The slain monster's D&D XP.
 * @returns {number} How many levels were gained.
 */
export function addXp(player, monsterXp) {
  player.xp += toPlayerXp(monsterXp);
  let levelsGained = 0;

  while (player.level < MAX_LEVEL && player.xp >= player.level * XP_PER_LEVEL) {
    player.xp -= player.level * XP_PER_LEVEL;
    player.level += 1;
    levelsGained += 1;
  }

  return levelsGained;
}

/**
 * Marks a difficulty of a tower as beaten. Never downgrades:
 * clearing EASY after HARD keeps HARD.
 *
 * @param {object} player - The saved player (changed in place).
 * @param {string} tower - A tower id, e.g. "html".
 * @param {string} difficulty - "EASY", "MEDIUM" or "HARD".
 */
export function markCleared(player, tower, difficulty) {
  const current = player.clearedLevels[tower];

  if (
    current === null ||
    DIFFICULTIES.indexOf(difficulty) > DIFFICULTIES.indexOf(current)
  ) {
    player.clearedLevels[tower] = difficulty;
  }
}
