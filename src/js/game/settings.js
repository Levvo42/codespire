// Player settings, saved apart from the hero save.
const SETTINGS_KEY = "codespire-settings";
const DEFAULT_VOLUME = 0.2;

export function loadSettings() {
  try {
    const volume = JSON.parse(localStorage.getItem(SETTINGS_KEY))?.volume;
    if (typeof volume === "number" && volume >= 0 && volume <= 1) {
      return { volume };
    }
    return { volume: DEFAULT_VOLUME };
  } catch {
    return { volume: DEFAULT_VOLUME };
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Storage blocked: the setting just isn't remembered.
  }
}
