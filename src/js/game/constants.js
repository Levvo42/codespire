// Numbers we decided on. Nothing here changes while playing.

// ========================================
// #region Damage
// Player damage = monster max HP ÷ questions to defeat × attack bonus (× 2 on a crit)
//   attack bonus = 1 + 1% per attack point
export const ATTACK_BONUS_PER_POINT = 0.01;
export const CRIT_MULTIPLIER = 2; // chance comes from the class (CLASS_STATS critChance)

// Monster damage = base + per challenge rating (CR), minus defense %
//   1 defense point = 1% less damage
export const MONSTER_BASE_DAMAGE = 15;
export const MONSTER_DAMAGE_PER_CR = 2;
export const DEFENSE_REDUCTION_PER_POINT = 0.01;
// #endregion Damage
// ========================================
// #region Questions
// The questions' difficulty is the tower's difficulty (from the lobby)
export const QUESTIONS_PER_RUN = 33; // picked from the pool and shuffled for each climb
// #endregion Questions
// ========================================
// #region Tower
// Floors go from weakest to the boss.
//   challengeRatings / minHp / maxHp: which D&D monsters can appear
//   questionsToDefeat: right answers needed to beat it (fewer with crits)
//   lootMultiplier: × the drop chances in LOOT_TABLE (player.js)
// One layout per difficulty (the lobby sends EASY, MEDIUM or HARD)
export const TOWER_LAYOUTS = {
  EASY: [
    {
      count: 2,
      minHp: 1,
      maxHp: 30,
      challengeRatings: [0, 0.125, 0.25, 0.5, 1],
      questionsToDefeat: 1,
      lootMultiplier: 1,
    },
    {
      count: 2,
      minHp: 30,
      maxHp: 80,
      challengeRatings: [1, 2, 3],
      questionsToDefeat: 2,
      lootMultiplier: 2,
    },
    {
      count: 1,
      minHp: 80,
      maxHp: 150,
      challengeRatings: [3, 4, 5, 6],
      questionsToDefeat: 3,
      lootMultiplier: 3,
    },
    {
      count: 1,
      minHp: 150,
      maxHp: 250,
      challengeRatings: [8, 9, 10, 11, 12, 13, 14, 15, 16],
      questionsToDefeat: 5,
      lootMultiplier: 5,
      isBoss: true,
    },
  ],
  MEDIUM: [
    {
      count: 2,
      minHp: 15,
      maxHp: 50,
      challengeRatings: [0.5, 1, 2],
      questionsToDefeat: 1,
      lootMultiplier: 1,
    },
    {
      count: 2,
      minHp: 50,
      maxHp: 110,
      challengeRatings: [2, 3, 4],
      questionsToDefeat: 2,
      lootMultiplier: 2,
    },
    {
      count: 1,
      minHp: 110,
      maxHp: 200,
      challengeRatings: [5, 6, 7, 8, 9],
      questionsToDefeat: 3,
      lootMultiplier: 3,
    },
    {
      count: 1,
      minHp: 200,
      maxHp: 350,
      challengeRatings: [11, 12, 13, 14, 15, 16, 17],
      questionsToDefeat: 5,
      lootMultiplier: 5,
      isBoss: true,
    },
  ],
  HARD: [
    {
      count: 2,
      minHp: 30,
      maxHp: 80,
      challengeRatings: [1, 2, 3],
      questionsToDefeat: 1,
      lootMultiplier: 1,
    },
    {
      count: 2,
      minHp: 80,
      maxHp: 150,
      challengeRatings: [3, 4, 5, 6],
      questionsToDefeat: 2,
      lootMultiplier: 2,
    },
    {
      count: 1,
      minHp: 150,
      maxHp: 250,
      challengeRatings: [8, 9, 10, 11, 12, 13],
      questionsToDefeat: 3,
      lootMultiplier: 3,
    },
    {
      count: 1,
      minHp: 250,
      maxHp: 450,
      challengeRatings: [17, 19, 20, 21, 22, 23],
      questionsToDefeat: 6,
      lootMultiplier: 6,
      isBoss: true,
    },
  ],
};
// #endregion Tower
