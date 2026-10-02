// Tower climb rules: which floors there are and when the tower is cleared.

/**
 * Starts a new climb: one floor per monster, weakest first, boss last.
 * The player starts at full HP and keeps the HP they have left between floors.
 *
 * @param {object[]} layout - Tower tiers from TOWER_LAYOUTS.
 * @param {object} player - { maxHp, attack, defense }
 * @returns {object} { floors, floorIndex, player, usedMonsters }
 */
export function createClimb(layout, player) {
  const floors = layout.flatMap((tier) =>
    Array.from({ length: tier.count }, () => tier),
  );

  return {
    floors,
    floorIndex: 0,
    player: { ...player, hp: player.maxHp },
    usedMonsters: [], // so the same monster doesn't show up twice in one climb
  };
}

/**
 * Whether the climb is on its last floor (the boss).
 *
 * @param {object} climb - The current climb.
 * @returns {boolean}
 */
export function isLastFloor(climb) {
  return climb.floorIndex === climb.floors.length - 1;
}
