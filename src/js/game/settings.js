// Player settings, saved apart from the hero save.
const SETTINGS_KEY = "codespire-settings";

// Volume: the slider (0-1) follows a curve, because ears hear loudness that way.
// Slider 100% = MAX_VOLUME, slider 50% = a quarter of it.
const MAX_VOLUME = 0.5;
const DEFAULT_VOLUME = toVolume(0.5);

export function toVolume(slider) {
  return MAX_VOLUME * slider ** 2;
}

export function toSlider(volume) {
  return Math.sqrt(volume / MAX_VOLUME);
}

export function loadSettings() {
  try {
    const volume = JSON.parse(localStorage.getItem(SETTINGS_KEY))?.volume;
    if (typeof volume === "number" && volume >= 0 && volume <= 1) {
      return { volume: Math.min(volume, MAX_VOLUME) };
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
