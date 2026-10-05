// player.js

// ========================================
// #region Data
export const SAVE_VERSION = 1;
export const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"];
export const AVATARS = ["warrior", "mage", "rogue"];

// Base stats + growth
export const CLASS_STATS = {
  warrior: {
    base: { hp: 120, attack: 10, defense: 6 },
    perLevel: { hp: 12, attack: 2, defense: 1 },
    startPotions: 3,
    critChance: 0.05,
  },
  mage: {
    base: { hp: 80, attack: 14, defense: 2 },
    perLevel: { hp: 8, attack: 3, defense: 0.5 },
    startPotions: 3,
    critChance: 0.05,
  },
  rogue: {
    base: { hp: 95, attack: 12, defense: 4 },
    perLevel: { hp: 10, attack: 2.5, defense: 1 },
    startPotions: 5,
    critChance: 0.2,
  },
};
export const ITEM_INFO = {
  healthPotion: { name: "Health Potion", healShare: 0.3 },
};
export const TOWER_INFO = {
  html: { name: "HTML", available: true },
  css: { name: "CSS", available: true },
  javascript: { name: "JavaScript", available: true },
  python: { name: "Python", available: false },
  csharp: { name: "C#", available: false },
};
export const TOWERS = Object.keys(TOWER_INFO);
export const CLASSES = Object.keys(CLASS_STATS);
export const ITEMS = Object.keys(ITEM_INFO);

// Loot: drop chance per kill (0.1 = 10%), multiplied by the floor's lootMultiplier
export const LOOT_TABLE = {
  healthPotion: 0.1,
};
export const NAME_MAX_LENGTH = 20;

// XP and levels
const XP_SCALE = 0.1;
const XP_PER_LEVEL = 1000;
const MAX_LEVEL = 99;

// #endregion Data
// ========================================
// #region Player creation / loading

// Checks a player name. Returns an error message, or "" if the name is OK.
export function checkName(name) {
  const trimmed = name.trim();

  if (trimmed.length < 1) return "Please enter a name.";
  if (trimmed.length > NAME_MAX_LENGTH)
    return `Max ${NAME_MAX_LENGTH} characters.`;
  if (!/^[\p{L}0-9 _'-]+$/u.test(trimmed))
    return "Only letters, numbers, spaces, - _ and '.";

  return "";
}

export function createPlayer(name, heroClass) {
  const clearedLevels = {};
  TOWERS.forEach((tower) => (clearedLevels[tower] = null));

  const inventory = {};
  for (const item of ITEMS) {
    inventory[item] = 0;
  }
  inventory.healthPotion = CLASS_STATS[heroClass].startPotions;
  return {
    version: SAVE_VERSION,
    name,
    heroClass,
    avatar: heroClass,
    level: 1,
    xp: 0,
    inventory,
    clearedLevels,
    storyFlags: [], // e.g. "met-the-wizard"
    createdAt: Date.now(),
  };
}

// These are upload "gates" so users cannot upload wrong files to the website.
export function parsePlayer(data) {
  // Gate 1: Check if the file is a real "Object"
  if (typeof data !== "object" || data === null || Array.isArray(data))
    return null;
  // Gate 2: Version must match, so we only load saves we understand.
  if (data.version !== SAVE_VERSION) return null;
  // Gate 3: Make sure the name is an actual string (text) then trim spaces.
  if (typeof data.name !== "string") return null;
  const name = data.name.trim();
  // Gate 4: Name must follow the same rules as character creation (checkName).
  if (checkName(data.name) !== "") return null;
  // Gate 5: Check so that level and xp are numbers and not below 1 or above 99. Or xp less than 0.
  if (!Number.isInteger(data.level) || data.level < 1 || data.level > 99)
    return null;
  if (!Number.isInteger(data.xp) || data.xp < 0) return null;
  // Gate 6: Checks so that storyFlags is a list and contains strings in each position.
  if (!Array.isArray(data.storyFlags)) return null;
  if (!data.storyFlags.every((flag) => typeof flag === "string")) return null;
  // Gate 7: Checks clearedLevels so they are either easy, medium, hard or null.
  const cleared = data.clearedLevels;
  if (typeof cleared !== "object" || cleared === null) return null;
  for (const tower of TOWERS) {
    const value = cleared[tower];
    if (value !== null && !DIFFICULTIES.includes(value)) return null;
  }
  // Gate 8: inventory must be an object, and each item count a whole number, 0 or more.
  const inventory = data.inventory;
  if (typeof inventory !== "object" || inventory === null) return null;

  for (const item of ITEMS) {
    const count = inventory[item];
    if (!Number.isInteger(count) || count < 0) return null;
  }
  // Gate 9: Check so the heroClass actually exists.
  if (!CLASSES.includes(data.heroClass)) return null;
  // Gate 10: Check so that the avatar actually exists.
  if (!AVATARS.includes(data.avatar)) return null;

  // Build a fresh blank player, then copy in the checked values.
  const player = createPlayer(name, data.heroClass);
  player.level = data.level;
  player.xp = data.xp;
  player.avatar = data.avatar;
  player.storyFlags = [...data.storyFlags];
  TOWERS.forEach((tower) => (player.clearedLevels[tower] = cleared[tower]));
  if (Number.isFinite(data.createdAt)) player.createdAt = data.createdAt;
  for (const item of ITEMS) {
    player.inventory[item] = inventory[item];
  }

  return player;
}
// Returns the next difficulty to play in a tower, or null if all are cleared.
export function getNextDifficulty(player, tower) {
  const cleared = player.clearedLevels[tower];
  if (cleared === null) return DIFFICULTIES[0]; // nothing cleared → EASY

  const nextIndex = DIFFICULTIES.indexOf(cleared) + 1;
  if (nextIndex >= DIFFICULTIES.length) return null; // HARD cleared → done
  return DIFFICULTIES[nextIndex];
}
// #endregion Player creation / loading
// ========================================

// #region Stats
// Calculates a stat (e.g. "hp") from the player's class and level.
export function getStat(player, stat) {
  const classStats = CLASS_STATS[player.heroClass];
  const levelsGained = player.level - 1;
  return Math.floor(
    classStats.base[stat] + classStats.perLevel[stat] * levelsGained,
  );
}
// #endregion Stats
// ========================================
// #region Progress
// Monster XP (D&D scale) to player XP.
export function toPlayerXp(monsterXp) {
  return Math.max(Math.round(monsterXp * XP_SCALE), 1);
}

// Adds XP, levels up, returns how many levels were gained.
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

// XP needed for the next level, or null at max level.
export function getXpToNextLevel(player) {
  if (player.level >= MAX_LEVEL) return null;
  return player.level * XP_PER_LEVEL;
}

// Saves the highest cleared difficulty of a tower (never goes down).
export function markCleared(player, tower, difficulty) {
  const current = player.clearedLevels[tower];

  if (
    current === null ||
    DIFFICULTIES.indexOf(difficulty) > DIFFICULTIES.indexOf(current)
  ) {
    player.clearedLevels[tower] = difficulty;
  }
}
// #endregion Progress
// ========================================
// #region Items
// Uses one potion. Returns false if there are none left.
export function usePotion(player) {
  if (player.inventory.healthPotion < 1) return false;

  player.inventory.healthPotion -= 1;
  return true;
}

// Rolls each item in the loot table, adds the drops, returns the dropped items.
export function rollLoot(player, lootMultiplier) {
  const loot = [];

  for (const item of Object.keys(LOOT_TABLE)) {
    if (Math.random() < LOOT_TABLE[item] * lootMultiplier) {
      player.inventory[item] += 1;
      loot.push(item);
    }
  }

  return loot;
}
// #endregion Items
// ========================================
