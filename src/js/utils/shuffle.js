/**
 * Returns a shuffled copy of an array (Fisher–Yates). The original is not changed.
 *
 * @param {Array} items - The array to shuffle.
 * @returns {Array} A new array with the same items in random order.
 */
export function shuffle(items) {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}
