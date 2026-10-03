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

// Downloads the player as a .json save file.
export function downloadSave(player) {
  const file = new Blob([JSON.stringify(player, null, 2)], {
    type: "application/json",
  });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(file);
  link.download = `codespire-${player.name}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
}
