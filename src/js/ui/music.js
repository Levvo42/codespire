// Background music for the game pages: one playlist for the lobby, one for battle.
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
import playIcon from "../../assets/icons/sound-on.svg";
import pauseIcon from "../../assets/icons/sound-off.svg";
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

let audio = null;
let playlist = [];
let musicKey = "";
let track = 0;

// #region Music-button
const playBtn = document.createElement("button");
playBtn.className = "music-btn";
playBtn.setAttribute("aria-label", "Turn sound off");

const icon = document.createElement("img");
icon.src = pauseIcon;
icon.alt = "sound off";
playBtn.appendChild(icon);
// #endregion Music-button

// #endregion Variables
// ========================================
// #region Functions
// Starts a playlist ("lobby" or "battle") where it was left last time.
export function startMusic(playlistName) {
  playlist = PLAYLISTS[playlistName];
  musicKey = `codespire-music-${playlistName}`;

  const position = loadPosition();
  track = position.track;

  audio = new Audio(playlist[track]);
  // Body
  if (!document.body.contains(playBtn)) {
    document.body.appendChild(playBtn);
  }

  audio.volume = loadSettings().volume;
  audio.addEventListener(
    "loadedmetadata",
    () => (audio.currentTime = position.time),
    { once: true },
  );
  audio.addEventListener("ended", playNextTrack);
  document.addEventListener(
    "volume-change",
    (event) => (audio.volume = event.detail),
  );
  window.addEventListener("pagehide", savePosition);

  playMusic();
}

// #region Sound controls
playBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    icon.src = pauseIcon;
    icon.alt = "sound off";
    playBtn.setAttribute("aria-label", "Turn sound off");
  } else {
    audio.pause();
    icon.src = playIcon;
    icon.alt = "sound on";
    playBtn.setAttribute("aria-label", "Turn sound on");
  }
});
// #endregion Sound controls

function playMusic() {
  audio.play().catch(waitForClick);
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
