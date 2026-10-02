// Battle rules: plain functions over plain values, no DOM.
import {
  CRIT_MULTIPLIER,
  DEFENSE_REDUCTION_PER_POINT,
  REFERENCE_ATTACK,
} from "./constants.js";

/**
 * Decides if a hit is a critical hit.
 *
 * @param {number} critChance - 0–1, e.g. 0.05 for 5% (CLASS_STATS critChance).
 * @returns {boolean}
 */
export function rollCrit(critChance) {
  return Math.random() < critChance;
}

/**
 * Damage a right answer does to the monster:
 * monster max HP ÷ questions to defeat × attack bonus, doubled on a crit.
 *
 * @param {object} monster - { maxHp, questionsToDefeat }
 * @param {number} playerAttack - The player's attack stat.
 * @param {boolean} isCrit - Whether this hit is a critical hit.
 * @returns {number} Damage to the monster.
 */
export function getPlayerHit(monster, playerAttack, isCrit) {
  const attackBonus = Math.max(playerAttack / REFERENCE_ATTACK, 1);
  const critBonus = isCrit ? CRIT_MULTIPLIER : 1;

  // Rounded up, so a 3-hit monster never needs a 4th hit because of rounding
  return Math.ceil(
    (monster.maxHp / monster.questionsToDefeat) * attackBonus * critBonus,
  );
}

/**
 * Damage a wrong answer does to the player:
 * player max HP × the floor's hit share, minus 1% per defense point (at least 1).
 *
 * @param {object} monster - { monsterHitShare }
 * @param {object} player - { maxHp, defense }
 * @returns {number} Damage to the player.
 */
export function getMonsterHit(monster, player) {
  const reduction = 1 - player.defense * DEFENSE_REDUCTION_PER_POINT;
  const damage = player.maxHp * monster.monsterHitShare * reduction;

  return Math.max(Math.round(damage), 1);
}

/**
 * Starts a fight: the monster at full HP, the player with the HP they have left.
 *
 * @param {object} player - { hp, maxHp, attack, defense, critChance }
 * @param {object} monster - { name, maxHp, questionsToDefeat, monsterHitShare, isBoss, … }
 * @returns {object} The battle state.
 */
export function createBattle(player, monster) {
  return { player, monster, monsterHp: monster.maxHp };
}

/**
 * Applies one answered question.
 *
 * @param {object} battle - The current battle state.
 * @param {boolean} isCorrect - Whether the player answered correctly.
 * @param {boolean} isCrit - Whether a right answer is a critical hit.
 * @returns {object} The new battle state, plus `damage`, `isCrit` and
 *   `outcome` ("continue" | "victory" | "defeat").
 */
export function applyAnswer(battle, isCorrect, isCrit) {
  const { player, monster } = battle;

  if (isCorrect) {
    const damage = getPlayerHit(monster, player.attack, isCrit);
    const monsterHp = Math.max(battle.monsterHp - damage, 0);
    const outcome = monsterHp === 0 ? "victory" : "continue";

    return { ...battle, monsterHp, damage, isCrit, outcome };
  }

  const damage = getMonsterHit(monster, player);
  const hp = Math.max(player.hp - damage, 0);
  const outcome = hp === 0 ? "defeat" : "continue";

  return {
    ...battle,
    player: { ...player, hp },
    damage,
    isCrit: false,
    outcome,
  };
}
