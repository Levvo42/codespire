// player.js
export const SAVE_VERSION = 1;
export const TOWERS = ["html", "css", "javascript", "python", "csharp"];
export const ITEMS = ["healthPotion"];
export const CLASSES = ["warrior", "mage", "rogue"];
export const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"];

export function createPlayer(name, heroClass) {
  const clearedLevels = {};
  TOWERS.forEach((tower) => (clearedLevels[tower] = null));

  const inventory = {};
  for (const item of ITEMS) {
    inventory[item] = 0;
  }
  return {
    version: SAVE_VERSION,
    name,
    heroClass,
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
  // Gate 4: Ignore names that are 0 or over 20 characters long.
  if (name.length < 1 || name.length > 20) return null;
  // Gate 5: Check so that level and xp are numbers and not below 1 or above 99. Or xp less then 0.
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

  // Build a fresh player or build a player from save file.
  const player = createPlayer(name, data.heroClass);
  player.level = data.level;
  player.xp = data.xp;
  player.storyFlags = [...data.storyFlags];
  TOWERS.forEach((tower) => (player.clearedLevels[tower] = cleared[tower]));
  if (Number.isFinite(data.createdAt)) player.createdAt = data.createdAt;
  for (const item of ITEMS) {
    player.inventory[item] = inventory[item];
  }

  return player;
}
