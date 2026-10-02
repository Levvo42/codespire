// Numbers we decided on. Nothing here changes while playing.

// ========================================
// #region Damage
// Player damage = monster max HP ÷ questions to defeat × attack bonus (× 2 on a crit)
//   attack bonus = player attack / REFERENCE_ATTACK, but never below 1,
//   so a "1 hit" monster always dies in 1 right answer
export const REFERENCE_ATTACK = 10; // the warrior's starting attack counts as ×1
export const CRIT_MULTIPLIER = 2; // chance comes from the class (CLASS_STATS critChance)

// Monster damage = player max HP × the floor's hit share, minus defense %
//   1 defense point = 1% less damage (warrior 6 → 6% less)
export const DEFENSE_REDUCTION_PER_POINT = 0.01;
// #endregion Damage
// ========================================
// #region Questions
export const QUESTION_DIFFICULTY = "EASY";
export const QUESTIONS_PER_RUN = 33; // picked from the pool and shuffled for each climb
// #endregion Questions
// ========================================
// #region Tower
// Floors go from weakest to the boss.
//   challengeRatings / minHp / maxHp: which D&D monsters can appear
//   questionsToDefeat: right answers needed to beat it (fewer with crits)
//   monsterHitShare: how much of the player's max HP one wrong answer costs
export const TOWER_NAME = "HTML";
export const TOWER_DIFFICULTY = "EASY";
export const TOWER_LAYOUTS = {
  EASY: [
    {
      count: 2,
      minHp: 1,
      maxHp: 30,
      challengeRatings: [0, 0.125, 0.25, 0.5, 1],
      questionsToDefeat: 1,
      monsterHitShare: 0.15,
    },
    {
      count: 2,
      minHp: 30,
      maxHp: 80,
      challengeRatings: [1, 2, 3],
      questionsToDefeat: 2,
      monsterHitShare: 0.18,
    },
    {
      count: 1,
      minHp: 80,
      maxHp: 150,
      challengeRatings: [3, 4, 5, 6],
      questionsToDefeat: 3,
      monsterHitShare: 0.22,
    },
    {
      count: 1,
      minHp: 150,
      maxHp: 250,
      challengeRatings: [8, 9, 10, 11, 12, 13, 14, 15, 16],
      questionsToDefeat: 5,
      monsterHitShare: 0.3,
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
      monsterHitShare: 0.2,
    },
    {
      count: 2,
      minHp: 80,
      maxHp: 150,
      challengeRatings: [3, 4, 5, 6],
      questionsToDefeat: 2,
      monsterHitShare: 0.24,
    },
    {
      count: 1,
      minHp: 150,
      maxHp: 250,
      challengeRatings: [8, 9, 10, 11, 12, 13],
      questionsToDefeat: 3,
      monsterHitShare: 0.28,
    },
    {
      count: 1,
      minHp: 250,
      maxHp: 450,
      challengeRatings: [17, 19, 20, 21, 22, 23],
      questionsToDefeat: 6,
      monsterHitShare: 0.35,
      isBoss: true,
    },
  ],
};
// #endregion Tower
// ========================================
// #region Test player
// Used when there is no saved player yet (until character creation saves one)
export const TEST_PLAYER = { name: "Hero", heroClass: "warrior" };
// #endregion Test player
