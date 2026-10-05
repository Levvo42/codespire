// Background music for the game pages: one playlist for the lobby, one for battle.
// Also fades the screen and music out when the game moves to the other page.
import dystopia from "../../assets/music/dystopia.ogg";
import horizon from "../../assets/music/horizon.ogg";
import momentaryNeonDreams from "../../assets/music/momentary_neon_dreams.ogg";
import portalsToAnotherDimension from "../../assets/music/portals_to_another_dimention.ogg";
import solitude from "../../assets/music/solitude.ogg";
import theAdventureOfTheFallingLeaf from "../../assets/music/the_adventure_of_the_falling_leaf.ogg";
import theFallOfTheHero from "../../assets/music/the_fall_of_the_hero.ogg";
import theLossOfANewfoundFriend from "../../assets/music/the_loss_of_a_newfound_friend.ogg";
import theTrickstersPath from "../../assets/music/the_tricksters_path.ogg";
import voidOfThought from "../../assets/music/void_of_thought.ogg";
import { loadSettings } from "../game/settings.js";

// ========================================
// #region Variables
const PLAYLISTS = {
  lobby: [solitude, theFallOfTheHero, theLossOfANewfoundFriend, voidOfThought],
  battle: [
    horizon,
    theTrickstersPath,
    theAdventureOfTheFallingLeaf,
    portalsToAnotherDimension,
    momentaryNeonDreams,
    dystopia,
  ],
};

const FADE_IN_MS = 3000;
const FADE_OUT_MS = 700;

let audio = null;
let playlist = [];
let musicKey = "";
let track = 0;
let targetVolume = 0;
let fadeFrame = 0;
let isLeaving = false;
// #endregion Variables
// ========================================
// #region Functions
// Starts a playlist ("lobby" or "battle") where it was left last time.
export function startMusic(playlistName) {
  playlist = PLAYLISTS[playlistName];
  musicKey = `codespire-music-${playlistName}`;

  const position = loadPosition();
  track = position.track;

  targetVolume = loadSettings().volume;
  audio = new Audio(playlist[track]);
  audio.volume = 0;
  audio.addEventListener(
    "loadedmetadata",
    () => (audio.currentTime = position.time),
    { once: true },
  );
  audio.addEventListener("ended", playNextTrack);
  document.addEventListener("volume-change", changeVolume);
  window.addEventListener("pagehide", savePosition);
  window.addEventListener("pageshow", returnToPage);

  playMusic();
}

// Fades the screen to black and the music to silent, then opens the url.
export function leaveGamePage(url) {
  isLeaving = true;
  document.querySelector("main").classList.add("is-leaving");
  fadeTo(0, FADE_OUT_MS);
  setTimeout(() => (window.location.href = url), FADE_OUT_MS);
}

// Back button: the browser can show the old page from memory, still faded out.
function returnToPage(event) {
  if (!event.persisted) return;

  isLeaving = false;
  document.querySelector("main").classList.remove("is-leaving");
  playMusic();
}

function playMusic() {
  audio.play().then(fadeIn, waitForClick);
}

function fadeIn() {
  if (!isLeaving) fadeTo(targetVolume, FADE_IN_MS);
}

// Moving the slider stops any fade and jumps to the new volume.
function changeVolume(event) {
  targetVolume = event.detail;
  cancelAnimationFrame(fadeFrame);
  audio.volume = targetVolume;
}

// Changes the volume step by step over duration ms.
function fadeTo(volume, duration) {
  cancelAnimationFrame(fadeFrame);
  const startVolume = audio.volume;
  const startTime = performance.now();

  function step(now) {
    const progress = Math.min(Math.max((now - startTime) / duration, 0), 1);
    audio.volume = startVolume + (volume - startVolume) * progress;
    if (progress < 1) fadeFrame = requestAnimationFrame(step);
  }
  fadeFrame = requestAnimationFrame(step);
}

// Browsers block sound until the player clicks or presses a key.
function waitForClick() {
  document.addEventListener("pointerdown", playMusic, { once: true });
  document.addEventListener("keydown", playMusic, { once: true });
}

function playNextTrack() {
  track = (track + 1) % playlist.length;
  audio.src = playlist[track];
  playMusic();
}

// Track and time live in sessionStorage, so a page change doesn't restart the song.
function savePosition() {
  sessionStorage.setItem(
    musicKey,
    JSON.stringify({ track, time: audio.currentTime }),
  );
}

function loadPosition() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(musicKey));
    if (
      Number.isInteger(saved?.track) &&
      saved.track >= 0 &&
      saved.track < playlist.length &&
      Number.isFinite(saved.time)
    ) {
      return saved;
    }
    return { track: 0, time: 0 };
  } catch {
    return { track: 0, time: 0 };
  }
}
// #endregion Functions
// ========================================
