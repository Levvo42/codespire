import { parsePlayer } from "./player.js";

const SAVE_KEY = "codespire-save";

// Saves are stored as base64. TextEncoder first, because btoa only takes 1 byte per character.
export function encodeSave(player) {
  const bytes = new TextEncoder().encode(JSON.stringify(player));
  const byteText = Array.from(bytes, (byte) => String.fromCharCode(byte)).join(
    "",
  );
  return btoa(byteText);
}

export function decodeSave(text) {
  if (text.trim().startsWith("{")) return JSON.parse(text); // old plain JSON save
  const bytes = Uint8Array.from(atob(text.trim()), (char) =>
    char.charCodeAt(0),
  );
  return JSON.parse(new TextDecoder().decode(bytes));
}

export function saveGame(player) {
  try {
    localStorage.setItem(SAVE_KEY, encodeSave(player));
    return true;
  } catch {
    return false;
  }
}

export function loadGame() {
  try {
    const text = localStorage.getItem(SAVE_KEY);
    if (text === null) return null;
    return parsePlayer(decodeSave(text));
  } catch {
    return null;
  }
}

export function deleteSave() {
  localStorage.removeItem(SAVE_KEY);
}

// Downloads the player as a .json save file.
export function downloadSave(player) {
  const file = new Blob([encodeSave(player)], { type: "text/plain" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(file);
  link.download = `codespire-${player.name}.txt`;
  link.click();
  URL.revokeObjectURL(link.href);
}
