// Shows an error to the player.

/**
 * Tells the player that something went wrong, and logs it for us.
 *
 * @param {string} message - What to tell the player, in plain words.
 * @param {Error} [error] - The original error, for the console.
 */
export function showError(message, error) {
  console.error(message, error);
  alert(message);
}
