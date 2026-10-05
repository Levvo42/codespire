// Settings dialog: music volume and new / save / load game.
import { parsePlayer } from "../game/player.js";
import {
  decodeSave,
  deleteSave,
  downloadSave,
  loadGame,
  saveGame,
} from "../game/save.js";
import {
  loadSettings,
  saveSettings,
  toSlider,
  toVolume,
} from "../game/settings.js";

// ========================================
// #region Variables
const LOBBY_URL = "/pages/lobby.html";
const CREATE_PLAYER_URL = "/pages/createplayer.html";

let dialog;
let volumeInput;
let volumeValue;
let fileInput;
let message;
// #endregion Variables
// ========================================
// #region Functions
// Finds the dialog from the header template and wires its buttons.
export function initSettings() {
  const openButton = document.querySelector('[data-js="settings-open"]');
  dialog = document.getElementById("settings-dialog");
  if (!openButton || !dialog) return;

  volumeInput = document.getElementById("settings-volume");
  volumeValue = document.getElementById("settings-volume-value");
  fileInput = document.getElementById("settings-file");
  message = document.getElementById("settings-message");

  volumeInput.value = Math.round(toSlider(loadSettings().volume) * 100);
  showVolume();

  openButton.addEventListener("click", openSettings);
  volumeInput.addEventListener("input", changeVolume);
  document.getElementById("settings-new").addEventListener("click", newGame);
  document
    .getElementById("settings-save")
    .addEventListener("click", saveToFile);
  document
    .getElementById("settings-load")
    .addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", loadFromFile);
  document
    .getElementById("settings-close")
    .addEventListener("click", () => dialog.close());
}

function openSettings() {
  message.textContent = "";
  dialog.showModal();
}

function showVolume() {
  volumeValue.textContent = `${volumeInput.value}%`;
}

function changeVolume() {
  const volume = toVolume(volumeInput.value / 100);
  saveSettings({ volume });
  document.dispatchEvent(new CustomEvent("volume-change", { detail: volume }));
  showVolume();
}

function newGame() {
  if (
    loadGame() &&
    !window.confirm("Start a new game? Your current save will be deleted.")
  ) {
    return;
  }

  deleteSave();
  window.location.href = CREATE_PLAYER_URL;
}

function saveToFile() {
  const player = loadGame();
  if (!player) {
    message.textContent = "No save yet. Create a hero first.";
    return;
  }

  downloadSave(player);
  message.textContent = "Save file downloaded.";
}

async function loadFromFile() {
  const file = fileInput.files[0];
  fileInput.value = ""; // so the same file can be picked again
  if (!file) return;

  let player;
  try {
    player = parsePlayer(decodeSave(await file.text()));
  } catch {
    player = null;
  }

  if (!player) {
    message.textContent = "That file is not a valid save.";
    return;
  }
  if (
    loadGame() &&
    !window.confirm(`Replace your current save with ${player.name}?`)
  ) {
    return;
  }
  if (!saveGame(player)) {
    message.textContent = "Could not save. Is browser storage blocked?";
    return;
  }

  window.location.href = LOBBY_URL;
}
// #endregion Functions
// ========================================
