// D&D 5e API: https://www.dnd5eapi.co (no API key needed)
import { shuffle } from "../utils/shuffle.js";

// Secret tower & boss (KEEP IT OR I WILL RESIGN!!!!)
const DND_API_URL = "https://www.dnd5eapi.co";
const MAX_PICK_ATTEMPTS = 8; // monsters to check before taking the closest match
const RARE_CLIMB_CHANCE = 0.032; // a rare climb where every floor is the same monster
const RARE_CLIMB_MONSTER = "goblin";

let isRareClimb = false;

/**
 * Fetches a random monster for one tower floor: from the floor's challenge
 * ratings, with HP inside the floor's range (or as close as we can find).
 *
 * @param {object} floor - A tier from TOWER_LAYOUTS.
 * @param {string[]} usedMonsters - Monster indexes already used in this climb.
 * @returns {Promise<object>} { index, name, maxHp, imageUrl, questionsToDefeat, monsterHitShare, isBoss }
 * @throws {Error} If a request fails or no monster matches.
 */
export async function getMonsterForFloor(floor, usedMonsters) {
  // No used monsters yet means a new climb: roll once for the rare climb
  if (usedMonsters.length === 0) {
    isRareClimb = Math.random() < RARE_CLIMB_CHANCE;
  }

  if (isRareClimb) {
    const monster = await fetchJson(`/api/2014/monsters/${RARE_CLIMB_MONSTER}`);
    return toMonster(monster, floor);
  }

  const list = await fetchJson(
    `/api/2014/monsters?challenge_rating=${floor.challengeRatings.join(",")}`,
  );
  const candidates = shuffle(list.results).filter(
    (result) => !usedMonsters.includes(result.index),
  );

  if (candidates.length === 0) {
    throw new Error("no monsters found for this tower floor");
  }

  let closest = null;

  for (const candidate of candidates.slice(0, MAX_PICK_ATTEMPTS)) {
    const monster = await fetchJson(candidate.url);

    if (getHpDistance(monster, floor) === 0) {
      return toMonster(monster, floor);
    }

    if (
      !closest ||
      getHpDistance(monster, floor) < getHpDistance(closest, floor)
    ) {
      closest = monster;
    }
  }

  return toMonster(closest, floor);
}

async function fetchJson(path) {
  const response = await fetch(`${DND_API_URL}${path}`);

  if (!response.ok) {
    throw new Error(`the monster server answered ${response.status}`);
  }

  return await response.json();
}

// 0 when the HP is inside the floor's range, otherwise how far outside it is
function getHpDistance(monster, floor) {
  if (monster.hit_points < floor.minHp) {
    return floor.minHp - monster.hit_points;
  }

  return Math.max(monster.hit_points - floor.maxHp, 0);
}

// Renames the API data into our own shape (javascript.md: rename at the boundary)
// and adds the floor's rules (how many hits it takes, how hard it hits).
function toMonster(monster, floor) {
  return {
    index: monster.index,
    name: monster.name,
    maxHp: monster.hit_points,
    imageUrl: monster.image ? `${DND_API_URL}${monster.image}` : null,
    questionsToDefeat: floor.questionsToDefeat,
    monsterHitShare: floor.monsterHitShare,
    isBoss: Boolean(floor.isBoss),
  };
}
