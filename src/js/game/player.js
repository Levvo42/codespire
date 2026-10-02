// player.js

// ========================================
// #region Data
export const SAVE_VERSION = 1;
export const TOWERS = ["html", "css", "javascript", "python", "csharp"];
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
  healthPotion: { name: "Health Potion" },
};
export const CLASSES = Object.keys(CLASS_STATS);
export const ITEMS = Object.keys(ITEM_INFO);
export const NAME_MAX_LENGTH = 20;

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
