// Battle screen: reads the page, renders the climb, handles clicks and
// plays the animations in order (hit → result → button) so each step is visible.
// The rules (damage, floors) live in game/battle.js and game/tower.js.
import { ITEMS, ITEM_INFO } from "../game/player.js";
import { applyAnswer, createBattle, rollCrit } from "../game/battle.js";
import { createClimb, isLastFloor } from "../game/tower.js";
import { showError } from "./error-message.js";
import { fitText } from "./fit-text.js";
import { endRaid, getRaidName, goblinSays, startRaid } from "./goblin-raid.js";
import fallbackMonsterImage from "../../assets/images/placeholderlogo.png";

// ========================================
// #region Variables
const HEARTS_PER_BAR = 5; // each heart = 20% of max health
const LOW_HEALTH_SHARE = 0.3; // warn at 30% health or less
const ANSWER_LETTERS = ["A", "B", "C", "D"];
const LONG_ANSWER_CHARS = 32; // longer answers are shown one per row on phones (two lines fit up to ~32)
const ANSWER_LINES = 2; // an answer button fits two lines
const MIN_TEXT_REM = 0.75; // long text shrinks, but never below this
// 1 = normal speed, 1.2 = 20% slower. Keep the same as $animation-speed in _singleplayer.scss
const ANIMATION_SPEED = 1.5;
const HIT_PAUSE_MS = 450 * ANIMATION_SPEED; // time to watch the hit before the result text shows
const NUMBER_COUNT_MS = 500 * ANIMATION_SPEED; // HP numbers count down/up over this time

const BLOCK = "site-singleplayer";
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// Finds a data-js hook in the HTML. A missing hook stops the page right away
// with a clear message (instead of a confusing "null" error in the middle of a fight).
function select(name) {
  const element = document.querySelector(`[data-js="${name}"]`);

  if (!element) {
    throw new Error(`singleplayer.html is missing data-js="${name}"`);
  }

  return element;
}

const elements = {
  main: document.querySelector(`.${BLOCK}`),
  difficulty: select("difficulty"),
  towerName: select("tower-name"),
  towerLevel: select("tower-level"),
  boss: document.querySelector(`.${BLOCK}__boss`),
  bossName: select("boss-name"),
  bossHp: select("boss-hp"),
  bossHearts: select("boss-hearts"),
  scene: document.querySelector(`.${BLOCK}__scene`),
  monsterImage: select("monster-image"),
  monsterFrame: select("monster-frame"),
  dialog: document.querySelector(`.${BLOCK}__dialog`),
  feedback: select("feedback"),
  roll: select("roll"),
  explanation: select("explanation"),
  dialogText: select("dialog-text"),
  answers: select("answers"),
  question: select("question"),
  answerButtons: [...document.querySelectorAll('[data-js="answer-button"]')],
  nextButton: select("next-button"),
  continueButton: select("continue-button"),
  retryButton: select("retry-button"),
  playerName: select("player-name"),
  playerClass: select("player-class"),
  playerLevel: select("player-level"),
  playerXp: select("player-xp"),
  playerAvatar: select("player-avatar"),
  playerHealth: select("player-health"),
  playerHp: select("player-hp"),
  playerHearts: select("player-hearts"),
  statHp: select("stat-hp"),
  statAttack: select("stat-attack"),
  statDefense: select("stat-defense"),
  statCrit: select("stat-crit"),
  inventoryList: select("inventory-list"),
};

// TEMPORARY: game progress lives here until we have game/state.js
let game = null; // { player, stats, layout, towerName, difficulty, loadMonster, loadQuestions }
let climb = null; // floors, floor index, player HP, used monsters
let battle = null; // the current fight
let questions = [];
let questionIndex = 0;
let retryAction = null; // what "Try again" does: restart the climb, or retry a failed load
// #endregion Variables
// ========================================
// #region Exported functions

/**
 * Sets up the battle screen and starts the first climb.
 *
 * @param {object} options
 * @param {object} options.player - The player from player.js (name, heroClass, level, inventory …)
 * @param {object} options.stats - { maxHp, attack, defense, critChance } for this player
 * @param {object[]} options.layout - Tower floors (TOWER_LAYOUTS[difficulty])
 * @param {string} options.towerName - e.g. "HTML"
 * @param {string} options.difficulty - e.g. "EASY"
 * @param {Function} options.loadMonster - (floor, usedMonsters) → Promise<monster>
 * @param {Function} options.loadQuestions - () → Promise<question[]>
 * @param {Function} options.onMonsterSlain - (monster, isTowerCleared) → { xpGained, levelsGained, level, isSaved }, called on every kill
 * @param {Function} options.onLeaveTower - Called when the player continues after the boss
 */
export function startGame(options) {
  game = options;

  elements.answerButtons.forEach((button, index) => {
    button.addEventListener("click", () => handleAnswer(index));
  });
  elements.nextButton.addEventListener("click", showNextQuestion);
  elements.continueButton.addEventListener("click", goToNextFloor);
  elements.retryButton.addEventListener("click", () => retryAction());
  elements.dialogText.addEventListener("scroll", updateScrollHint);
  // the text slides in from below, so check again once it is in place
  elements.dialogText.addEventListener("animationend", updateScrollHint);
  window.addEventListener("resize", fitQuestionText); // e.g. a phone turned sideways

  // If an API image fails to load, show our placeholder instead
  // (only once, so a broken placeholder can't loop)
  elements.monsterImage.addEventListener("error", () => {
    if (!elements.monsterImage.src.endsWith(fallbackMonsterImage)) {
      elements.monsterImage.src = fallbackMonsterImage;
    }
  });

  renderPlayer();
  startClimb({ moveFocus: false }); // no focus jump on page load
}
// #endregion Exported functions
// ========================================
// #region Climb flow

// A fresh climb: full HP, new questions, first floor. Also "Try again" after dying.
async function startClimb({ moveFocus = true } = {}) {
  showOutcomeButton(null);
  climb = createClimb(game.layout, game.stats);
  questionIndex = -1; // showNewQuestion() moves it to 0 for the first question
  elements.main.classList.remove(`${BLOCK}--defeated`, `${BLOCK}--raid`);
  endRaid(elements.scene);

  try {
    questions = await game.loadQuestions();
    await startFloor({ moveFocus });
  } catch (error) {
    showLoadError(
      `Could not start the climb: ${error.message}`,
      error,
      startClimb,
    );
  }
}

// After a win: the next floor, or the page's onLeaveTower when the boss is down
async function goToNextFloor() {
  showOutcomeButton(null); // no double clicks while the next monster loads

  if (isLastFloor(climb)) {
    game.onLeaveTower(); // the page decides where to go (the lobby)
    return;
  }

  climb = {
    ...climb,
    floorIndex: climb.floorIndex + 1,
    player: battle.player, // HP carries over between floors
  };

  await loadFloor();
}

// Loads the current floor; on failure "Try again" retries this same floor
async function loadFloor() {
  try {
    await startFloor();
  } catch (error) {
    showLoadError(
      `Could not load the next monster: ${error.message}`,
      error,
      loadFloor,
    );
  }
}

async function startFloor({ moveFocus = true } = {}) {
  setLoading();

  const floor = climb.floors[climb.floorIndex];
  let monster = await game.loadMonster(floor, climb.usedMonsters);

  // Goblin raid: it starts on the first floor (banner + green look), then
  // every goblin gets its own name (and the boss is the warlord)
  if (monster.isRaid) {
    if (climb.floorIndex === 0) {
      elements.main.classList.add(`${BLOCK}--raid`);
      startRaid(elements.scene);
    }

    monster = {
      ...monster,
      name: getRaidName(climb.floorIndex, monster.isBoss),
    };
  }

  // Download the picture while "Loading…" shows, so it appears all at once
  const imageUrl = await preloadImage(monster.imageUrl);

  climb = { ...climb, usedMonsters: [...climb.usedMonsters, monster.index] };
  battle = createBattle(climb.player, monster);

  renderFloor(imageUrl);
  renderHealth();
  showNewQuestion(); // every monster gets a new question, not the last one again
  playAnimation(elements.monsterImage, `${BLOCK}__monster--enter`);
  playAnimation(elements.boss, `${BLOCK}__boss--enter`);

  if (monster.isRaid) {
    goblinSays(elements.scene, monster.isBoss ? "boss" : "enter");
  }

  if (moveFocus) {
    elements.answerButtons[0].focus({ preventScroll: true });
  }
}

// What the goblin says after an answer
function getGoblinMoment(isCorrect) {
  if (!isCorrect) {
    return "taunt";
  }

  return battle.outcome === "victory" ? "defeated" : "hurt";
}

// "Next question" button: same monster, new question
function showNextQuestion() {
  showNewQuestion();
  elements.answerButtons[0].focus({ preventScroll: true });
}

// The only place questionIndex moves forward, so no question shows twice in a row.
// Starts over from the first question if the climb runs out of them.
function showNewQuestion() {
  questionIndex = (questionIndex + 1) % questions.length;
  renderQuestion();
}

async function handleAnswer(chosenIndex) {
  const { answers, correctAnswer, explanation } = questions[questionIndex];
  const isCorrect = chosenIndex === correctAnswer;
  const isCrit = isCorrect && rollCrit(battle.player.critChance);

  battle = applyAnswer(battle, isCorrect, isCrit);
  let reward = null;

  // Every kill gives XP: the page saves it right away (kept even if the player
  // dies later) and tells us what was gained. The boss also clears the tower.
  if (battle.outcome === "victory") {
    reward = game.onMonsterSlain(battle.monster, isLastFloor(climb));
    renderPlayer(); // new XP (and maybe level) in the player panel
  }

  // 1. Lock the answers and colour the right one (and the wrong pick)
  elements.answerButtons.forEach((button, index) => {
    button.disabled = true;
    button.classList.toggle(
      `${BLOCK}__answer--correct`,
      index === correctAnswer,
    );
    button.classList.toggle(
      `${BLOCK}__answer--wrong`,
      index === chosenIndex && !isCorrect,
    );
  });
  elements.dialog.focus({ preventScroll: true }); // keep focus inside the battle

  // 2. The hit itself: monster shakes, or the screen flashes red
  if (isCorrect) {
    playAnimation(
      elements.monsterImage,
      isCrit ? `${BLOCK}__monster--crit` : `${BLOCK}__monster--hit`,
    );
    // inside the frame, so it stays on the monster when the frame resizes
    showDamageNumber(
      elements.monsterFrame,
      battle.damage,
      isCrit ? "crit" : "monster",
    );
  } else {
    playAnimation(elements.main, `${BLOCK}--hurt`);
    playAnimation(elements.playerHealth, `${BLOCK}__player-health--hit`);
    showDamageNumber(elements.playerHealth, battle.damage, "player");
  }

  if (battle.monster.isRaid) {
    goblinSays(elements.scene, getGoblinMoment(isCorrect));
  }

  renderHealth();
  await wait(HIT_PAUSE_MS);

  // 3. The result replaces the question; the box grows over the locked answers
  elements.main.classList.add(`${BLOCK}--result`);
  elements.question.hidden = true;
  showText(elements.feedback, getFeedbackText(isCorrect));
  elements.feedback.classList.toggle(`${BLOCK}__feedback--correct`, isCorrect);
  elements.feedback.classList.toggle(`${BLOCK}__feedback--wrong`, !isCorrect);
  elements.feedback.classList.toggle(
    `${BLOCK}__feedback--cleared`,
    battle.outcome === "victory" && isLastFloor(climb),
  );
  showText(
    elements.roll,
    reward
      ? `${getDamageText(isCorrect)} ${getRewardText(reward)}`
      : getDamageText(isCorrect, answers[correctAnswer]),
  );
  showText(elements.explanation, explanation);
  elements.dialogText.scrollTop = 0; // new text starts at the top of the scroll box
  updateScrollHint();

  // 4. Big moments get their own animation before the button shows
  if (battle.outcome === "victory") {
    await playAnimation(elements.monsterImage, `${BLOCK}__monster--defeated`, {
      keep: true,
    });
  } else if (battle.outcome === "defeat") {
    elements.main.classList.add(`${BLOCK}--defeated`);
  }

  // 5. The button for what happens next
  showOutcomeButton(battle.outcome);
}
// #endregion Climb flow
// ========================================
// #region Rendering

// Name, class, stats and inventory in the panels (same data as the lobby)
function renderPlayer() {
  const { player, stats } = game;

  elements.playerName.textContent = player.name;
  elements.playerName.title = player.name; // full name on hover if it is cut off
  elements.playerClass.textContent = player.heroClass;
  elements.playerLevel.textContent = player.level;
  elements.playerXp.textContent = player.xp;
  elements.playerAvatar.src = `/avatars/${player.avatar}.webp`; // same images as the lobby
  elements.playerAvatar.alt = `${player.name}'s avatar`;
  elements.statHp.textContent = stats.maxHp;
  elements.statAttack.textContent = stats.attack;
  elements.statDefense.textContent = stats.defense;
  elements.statCrit.textContent = `${Math.round(stats.critChance * 100)}%`;

  elements.inventoryList.replaceChildren();

  for (const item of ITEMS) {
    const label = document.createElement("dt");
    label.textContent = ITEM_INFO[item].name;

    const count = document.createElement("dd");
    count.textContent = player.inventory[item];

    elements.inventoryList.append(label, count);
  }
}

// While the next monster loads: clear the old fight so nothing stale shows
function setLoading() {
  showOutcomeButton(null);
  elements.main.classList.remove(`${BLOCK}--result`);
  elements.bossName.textContent = "Loading…";
  elements.bossName.classList.add(`${BLOCK}__boss-name--loading`);
  // The defeated monster must not show again while the next one loads
  elements.monsterImage.classList.add(`${BLOCK}__monster--hidden`);
  elements.feedback.hidden = true;
  elements.roll.hidden = true;
  elements.explanation.hidden = true;
  elements.question.hidden = true;
  elements.answerButtons.forEach((button) => {
    button.disabled = true;
  });
}

function renderFloor(imageUrl) {
  const { monster } = battle;

  elements.difficulty.textContent = toTitleCase(game.difficulty);
  elements.towerName.textContent = game.towerName;
  elements.towerLevel.textContent = `${climb.floorIndex + 1}/${climb.floors.length}`;
  elements.bossName.classList.remove(`${BLOCK}__boss-name--loading`);
  elements.bossName.textContent = monster.isBoss
    ? `Boss: ${monster.name}`
    : monster.name;
  elements.monsterImage.src = imageUrl; // already downloaded, so it swaps instantly
  elements.monsterImage.alt = monster.name;
  elements.monsterImage.classList.remove(
    `${BLOCK}__monster--defeated`,
    `${BLOCK}__monster--hidden`,
  );
}

function renderQuestion() {
  const { question, answers } = questions[questionIndex];

  elements.main.classList.remove(`${BLOCK}--result`); // answers back in view
  elements.question.textContent = question;
  elements.question.hidden = false;
  elements.feedback.hidden = true;
  elements.roll.hidden = true;
  elements.explanation.hidden = true;
  elements.dialogText.scrollTop = 0;
  showOutcomeButton(null);

  // Sentence-long answers get one row each (on phones) instead of the 2 × 2 grid
  elements.answers.classList.toggle(
    `${BLOCK}__answers--list`,
    answers.some((answer) => answer.length > LONG_ANSWER_CHARS),
  );

  // 4 answers (multiple choice) or 2 (true/false): hide the buttons not needed
  elements.answerButtons.forEach((button, index) => {
    const answer = answers[index];

    button.hidden = answer === undefined;
    button.textContent = `[${ANSWER_LETTERS[index]}] ${answer ?? ""}`;
    button.disabled = false;
    button.classList.remove(
      `${BLOCK}__answer--correct`,
      `${BLOCK}__answer--wrong`,
    );
    button.style.setProperty("--i", index); // staggers the slide-in
    playAnimation(button, `${BLOCK}__answer--enter`);
  });

  fitQuestionText();
}

// Same box sizes for every question: long text gets a little smaller instead
function fitQuestionText() {
  fitText(elements.question, getQuestionLines(), MIN_TEXT_REM);

  elements.answerButtons.forEach((button) => {
    if (!button.hidden) {
      fitText(button, ANSWER_LINES, MIN_TEXT_REM);
    }
  });

  updateScrollHint(); // a question that still doesn't fit scrolls (with the glow)
}

// How many question lines fit in the box. The box height comes from the CSS
// (--dialog-h), so the CSS alone decides: two lines, three on narrow phones.
function getQuestionLines() {
  const box = getComputedStyle(elements.dialog);
  const textHeight =
    elements.dialog.clientHeight -
    parseFloat(box.paddingTop) -
    parseFloat(box.paddingBottom);
  const lineHeight = parseFloat(getComputedStyle(elements.question).lineHeight);

  return Math.max(Math.floor(textHeight / lineHeight), 1);
}

function renderHealth() {
  const { player, monster, monsterHp } = battle;

  countTo(elements.bossHp, monsterHp);
  renderHearts(elements.bossHearts, monsterHp, monster.maxHp, "Boss health");

  countTo(elements.playerHp, player.hp);
  renderHearts(elements.playerHearts, player.hp, player.maxHp, "Player health");
  elements.playerHealth.classList.toggle(
    `${BLOCK}__player-health--low`,
    player.hp > 0 && player.hp / player.maxHp <= LOW_HEALTH_SHARE,
  );
}

// Each heart fills by --fill (0%–100%), left to right. The fill slides
// (CSS transition) and a heart that lost or gained health gets a pop.
function renderHearts(heartsElement, hp, maxHp, label) {
  const filledHearts = (hp / maxHp) * HEARTS_PER_BAR;

  [...heartsElement.children].forEach((heart, index) => {
    const fill = Math.min(Math.max(filledHearts - index, 0), 1) * 100;
    const previousFill = Number(
      heart.style.getPropertyValue("--fill").replace("%", ""),
    );

    if (
      heart.style.getPropertyValue("--fill") !== "" &&
      fill !== previousFill
    ) {
      playAnimation(
        heart,
        fill < previousFill
          ? `${BLOCK}__heart--lost`
          : `${BLOCK}__heart--gained`,
      );
    }

    heart.style.setProperty("--fill", `${fill}%`);
  });

  heartsElement.setAttribute("aria-label", `${label}: ${hp} of ${maxHp}`);
}

// Shows only the button that matches the outcome (or none), and moves
// keyboard focus to it so keyboard and screen reader users can go on
function showOutcomeButton(outcome) {
  elements.nextButton.hidden = outcome !== "continue";
  elements.continueButton.hidden = outcome !== "victory";
  elements.retryButton.hidden = outcome !== "defeat";
  elements.continueButton.textContent =
    climb && isLastFloor(climb) ? "Back to lobby" : "Next monster";

  const shownButton = [
    elements.nextButton,
    elements.continueButton,
    elements.retryButton,
  ].find((button) => !button.hidden);

  shownButton?.focus({ preventScroll: true });

  if (outcome === "defeat") {
    retryAction = startClimb;
  }
}

// A failed API call: tell the player and offer "Try again" for that step
function showLoadError(message, error, retry) {
  showError(message, error);
  elements.bossName.classList.remove(`${BLOCK}__boss-name--loading`);
  elements.bossName.textContent = "Could not load";
  elements.main.classList.add(`${BLOCK}--result`); // room for the Try again button
  showOutcomeButton("defeat");
  retryAction = retry;
}

function getFeedbackText(isCorrect) {
  if (battle.outcome === "victory" && isLastFloor(climb)) {
    return "Tower cleared!";
  }

  return isCorrect ? "Correct!" : "Wrong!";
}

// Only news goes here: the floating number already shows the damage and the
// hearts show the HP. A miss names the right answer (the buttons are covered).
function getDamageText(isCorrect, correctAnswerText) {
  const { monster, isCrit, outcome } = battle;
  const crit = isCrit ? "Critical hit!" : "";

  if (outcome === "victory") {
    return `${crit} ${monster.name} is defeated!`.trim();
  }

  if (outcome === "defeat") {
    return "You have fallen… the climb starts over.";
  }

  return isCorrect ? crit : `Correct answer: ${correctAnswerText}`;
}

// "+150 XP · Level up! You are level 2."
function getRewardText({ xpGained, levelsGained, level, isSaved }) {
  const levelUp =
    levelsGained > 0 ? ` · Level up! You are level ${level}.` : "";
  const saveProblem = isSaved ? "" : " (Could not save your progress.)";

  return `+${xpGained} XP${levelUp}${saveProblem}`;
}

// Gold glow under the text while more is hidden below (removed at the end)
function updateScrollHint() {
  const box = elements.dialogText;
  const hasMore = box.scrollTop + box.clientHeight < box.scrollHeight - 1;

  box.classList.toggle(`${BLOCK}__dialog-text--more`, hasMore);
}

function showText(element, text) {
  element.textContent = text;
  element.hidden = !text;
}

function toTitleCase(text) {
  return text.charAt(0) + text.slice(1).toLowerCase();
}
// #endregion Rendering
// ========================================
// #region Animation helpers

// Adds an animation class and resolves when the animation has finished.
// Without a class name it waits for the element's own (CSS) animation.
// `keep: true` leaves the class on (for end states like a defeated monster).
function playAnimation(element, className, { keep = false } = {}) {
  return new Promise((resolve) => {
    if (className) {
      element.classList.remove(className);
      void element.offsetWidth; // restarts the animation if it is already on
      element.classList.add(className);
    }

    const finish = () => {
      if (className && !keep) {
        element.classList.remove(className);
      }
      resolve();
    };

    if (getComputedStyle(element).animationName === "none") {
      finish(); // reduced motion, or no animation for this class
      return;
    }

    element.addEventListener("animationend", function onEnd(event) {
      if (event.target === element) {
        element.removeEventListener("animationend", onEnd);
        finish();
      }
    });
  });
}

// "-34" floating up from where the hit landed
function showDamageNumber(container, damage, type) {
  const number = document.createElement("span");

  number.className = `${BLOCK}__damage ${BLOCK}__damage--${type}`;
  number.textContent = `-${damage}`;
  number.setAttribute("aria-hidden", "true"); // the damage text already says it
  container.append(number);
  playAnimation(number).then(() => number.remove());
}

// HP numbers count down/up instead of jumping
function countTo(element, target) {
  const start = Number(element.textContent) || 0;

  if (reducedMotion.matches || start === target) {
    element.textContent = target;
    return;
  }

  const startTime = performance.now();

  requestAnimationFrame(function step(now) {
    const progress = Math.min((now - startTime) / NUMBER_COUNT_MS, 1);

    element.textContent = Math.round(start + (target - start) * progress);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  });
}

// Downloads an image before it is shown. Resolves with the url to use:
// the monster's own picture, or our placeholder if it has none or fails.
function preloadImage(url) {
  return new Promise((resolve) => {
    if (!url) {
      resolve(fallbackMonsterImage);
      return;
    }

    const image = new Image();
    image.addEventListener("load", () => resolve(url), { once: true });
    image.addEventListener("error", () => resolve(fallbackMonsterImage), {
      once: true,
    });
    image.src = url;
  });
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, reducedMotion.matches ? 0 : ms);
  });
}
// #endregion Animation helpers
// ========================================
