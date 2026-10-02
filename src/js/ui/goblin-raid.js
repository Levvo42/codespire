// The goblin raid: the rare climb where every floor is a goblin (api/monsters.js).
// Adds a warning banner, goblin names and goblins that won't stop talking.
import { shuffle } from "../utils/shuffle.js";

// ========================================
// #region Variables
const BLOCK = "site-singleplayer";
const BANNER_MS = 2800; // how long "Goblin raid!" stays up
const TALK_MS = 4500; // how long a speech bubble stays up (same as goblin-talk in the SCSS)

const NAMES = [
  "Kevin",
  "Stinkbean",
  "Sir Snacksalot",
  "Wobblebottom",
  "Toenail Tim",
  "Burpington",
  "Muffin the Destroyer",
  "Noodle",
  "Lil' Smudge",
  "Dave from Accounting",
];
const BOSS_NAME = "Bigfuling the mighty";

// What the goblins shout, by moment
const LINES = {
  enter: [
    "Goblin centered a div once. ONCE. Now goblin is king.",
    "Me use <br><br><br><br> for spacing. Is called ART.",
    "z-index: 99999999! Goblin is on top of EVERYTHING!",
    "Goblin wrote this whole tower in Microsoft Word!",
    "<blink>GOBLIN</blink> <blink>GOBLIN</blink>",
    "Me eat all your cookies. Me did not accept them first.",
    "position: absolute! Goblin go WHEREVER goblin want!",
    "Goblin fix bug by adding more bugs. Bugs fight. Goblin win.",
    "Goblin hotlink all your images! Your bandwidth now goblin food!",
    "float: left! float: left! Goblin float away!",
    "It work on goblin machine!!",
  ],
  boss: [
    "Bigfuling has 99 divs and every single one is called 'container'!",
    "Face Bigfuling's ultimate weapon: an INFINITE while loop!",
    "Bigfuling's tower is held together by one div. DO NOT TOUCH THAT DIV.",
    "Bigfuling never uses Git! Bigfuling just names files 'tower_FINAL_v2_REAL.html'!",
    "Bigfuling wrote this tower in one line of code! Is very long line!",
    "Bigfuling has 47 nested <div>s and Bigfuling lives in the deepest one!",
    "You cannot defeat Bigfuling! Bigfuling is position: fixed!",
  ],
  hurt: [
    "Ow! Not the face!",
    "Hey! Me was reading that!",
    "Goblin will remember this!",
    "That one tickled. A lot.",
  ],
  taunt: [
    "Hah! Even goblin knew that!",
    "Wrong! Wrong! Goblin dance!",
    "Hehehe, back to the lobby!",
    "Goblin screenshot that for the goblin group chat!",
    "Even goblin's pet rock knew that! ...Wait. Is rock alive? Goblin need a minute.",
    "Goblin Googled that too! Goblin got a recipe for soup!",
    "Hah! You guess randomly too? Welcome to the goblin family!",
    "Goblin would laugh, but goblin is already laughing too hard!",
  ],
  defeated: [
    "Tell my mother... goblin finished the project... (goblin did not)...",
    "Tell my <span> I loved her...",
    "Goblin... will... respawn...",
    "Ctrl+Z... CTRL+Z... why is it not working on goblin...",
    "Goblin did not lose... goblin won... backwards...",
    "Respawning in 3... 2... goblin forgot what comes after 2...",
    "Goblin's last words are... wait... goblin forgot them...",
  ],
};

let names = []; // shuffled once per raid, so each goblin gets its own name
let talkTimer;
let bannerEndsAt = 0; // goblins wait until the banner is gone before talking
// #endregion Variables
// ========================================
// #region Exported functions

/**
 * Starts a raid: shuffles the goblin names and shows the warning banner.
 *
 * @param {HTMLElement} scene - The battle scene the banner is shown in.
 */
export function startRaid(scene) {
  names = shuffle(NAMES);
  bannerEndsAt = Date.now() + BANNER_MS;

  const banner = document.createElement("p");
  banner.className = `${BLOCK}__raid-banner`;
  banner.setAttribute("role", "status"); // screen readers hear it once

  const title = document.createElement("strong");
  title.textContent = "Goblin raid!";

  const text = document.createElement("span");
  text.textContent = "The goblins have overrun the tower!";

  banner.append(title, text);
  scene.append(banner);
  setTimeout(() => banner.remove(), BANNER_MS);
}

/**
 * Removes anything left over from a raid (a new climb is starting).
 *
 * @param {HTMLElement} scene - The battle scene.
 */
export function endRaid(scene) {
  clearTimeout(talkTimer);
  bannerEndsAt = 0;
  scene
    .querySelectorAll(`.${BLOCK}__raid-banner, .${BLOCK}__goblin-talk`)
    .forEach((element) => element.remove());
}

/**
 * The goblin's name for a floor, e.g. "Goblin Snik". The boss is the warlord.
 *
 * @param {number} floorIndex - The floor (0 = first).
 * @param {boolean} isBoss - Whether it is the boss floor.
 * @returns {string}
 */
export function getRaidName(floorIndex, isBoss) {
  return isBoss ? BOSS_NAME : `Goblin ${names[floorIndex % names.length]}`;
}

/**
 * Shows a speech bubble over the goblin with a random line
 * (after the raid banner, if it is still showing).
 *
 * @param {HTMLElement} scene - The battle scene.
 * @param {"enter"|"boss"|"hurt"|"taunt"|"defeated"} moment - What just happened.
 */
export function goblinSays(scene, moment) {
  clearTimeout(talkTimer);
  scene.querySelector(`.${BLOCK}__goblin-talk`)?.remove();

  const line = pickRandom(LINES[moment]);
  const bannerLeftMs = Math.max(bannerEndsAt - Date.now(), 0);

  talkTimer = setTimeout(() => showBubble(scene, line), bannerLeftMs);
}
// #endregion Exported functions
// ========================================
// #region Functions
function showBubble(scene, line) {
  const bubble = document.createElement("p");
  bubble.className = `${BLOCK}__goblin-talk`;
  bubble.setAttribute("aria-hidden", "true"); // just for fun, not game info
  bubble.textContent = line;

  scene.append(bubble);
  talkTimer = setTimeout(() => bubble.remove(), TALK_MS);
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}
// #endregion Functions
// ========================================
