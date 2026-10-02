import { parsePlayer } from "./player.js";

const SAVE_KEY = "codespire-save";

export function saveGame(player) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(player));
    return true;
  } catch {
    return false;
  }
}

export function loadGame() {
  try {
    const text = localStorage.getItem(SAVE_KEY);
    if (text === null) return null;
    return parsePlayer(JSON.parse(text));
  } catch {
    return null;
  }
}

export function deleteSave() {
  localStorage.removeItem(SAVE_KEY);
}
