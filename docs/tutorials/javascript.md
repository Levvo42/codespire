# JavaScript — how we write it

The conventions the four of us follow when writing JavaScript in this project.
The point is that all our files look like they were written by one person, so
nobody has to re-learn a new style in every pull request.

Most of these rules are checked automatically by ESLint — the tools, the
commands and how to read an error are covered in
[code-quality.md](code-quality.md). This guide is the _why_ and the examples,
plus the rules a tool can't check.

Each section says whether ESLint enforces the rule. **Not enforced** does not
mean optional — it means a human catches it in code review instead.

---

## Naming

Names are read far more often than they are written. Predictable names mean
you can guess what something is without opening the file.

| What                    | How                | Example                          |
| ----------------------- | ------------------ | -------------------------------- |
| Variables and functions | `camelCase`        | `playerName`, `currentMonster`   |
| Classes                 | `PascalCase`       | `Monster`, `Tower`               |
| True constants          | `UPPER_SNAKE_CASE` | `BASE_MAX_HEARTS`, `DND_API_URL` |
| Booleans                | start `is/has/can` | `isGameOver`, `hasAnswered`      |
| Functions               | start with a verb  | `getQuestions`, `renderHearts`   |
| Files                   | `kebab-case.js`    | `battle-screen.js`               |
| Entry scripts           | same name as page  | `pages/lobby.js` ← `lobby.html`  |
| `data-js` values        | `kebab-case`       | `data-js="answer-button"`        |

A verb tells you the function _does_ something; a noun would read like a value.
A boolean prefix tells you the `if` is a yes/no question, not a number.

```js
// ✅
const BASE_MAX_HEARTS = 3;
let currentQuestion = null;
const isGameOver = hearts === 0;

function renderHearts(hearts) {}
function handleAnswerClick(event) {}

// ❌
const max = 3; // constant? variable? about what?
let q = null; // one letter saves nothing
const gameOver = hearts === 0; // reads like a noun, not a yes/no
function hearts(n) {} // does it give me hearts or draw them?
```

**UPPER_SNAKE_CASE is only for true constants** — values fixed when you write
the code, like `BASE_MAX_HEARTS = 3`. A `const` that holds a value from the API or
the DOM is still `camelCase`:

```js
const BASE_MAX_HEARTS = 3; // ✅ decided by us, never changes
const currentMonster = await getMonster("goblin"); // ✅ const, but not a constant
```

_ESLint:_ `camelcase` catches `snake_case` variables and functions. The rest
(verbs, boolean prefixes, PascalCase classes) is up to us in review.

---

## File names

**All file names are lowercase `kebab-case`:** `battle-screen.js`,
`question-card.js`, `state.js`.

This matters more than it looks, because of a trap that only appears on
GitHub:

- **Windows doesn't care about case.** `./ui/BattleScreen.js` and
  `./ui/battle-screen.js` open the same file for you.
- **Linux does.** GitHub's CI runners are Linux, and there a wrong-case import
  is simply a file that doesn't exist.

So an import with the wrong case works perfectly on your machine, and then the
**Build** step in CI fails with something like
`Could not resolve "./ui/BattleScreen.js"`. The fix is to make the import
match the real file name exactly — but the easiest fix is to never have mixed
case in the first place.

```js
// file on disk: src/js/ui/battle-screen.js

import { renderBattle } from "./ui/battle-screen.js"; // ✅ works everywhere
import { renderBattle } from "./ui/BattleScreen.js"; // ❌ works on Windows, red CI
```

Renaming a file's case afterwards is awkward in git on Windows (git often
doesn't notice), so get it right when you create the file.

_ESLint:_ not enforced. The CI build catches the broken import, but only after
you've pushed.

---

## Variables: `const`, `let`, never `var`

`const` is the default. It says "this name will always point at this value",
which is one less thing to keep track of when reading. Use `let` only when you
actually reassign, and never `var` — `var` ignores block scope and can be
redeclared, which hides bugs.

```js
// ✅
const BASE_MAX_HEARTS = 3;
const answers = question.answers;
let hearts = BASE_MAX_HEARTS;

hearts -= 1;

// ❌
var hearts = 3; // no-var
let answers = question.answers; // never reassigned → prefer-const
```

Note that `const` on an object or array stops _reassignment_, not _changes_:

```js
const tower = { level: 1 };
tower.level = 2; // ✅ allowed — we changed a property
tower = { level: 2 }; // ❌ TypeError — we tried to replace the object
```

## Always `===`

`==` converts types before comparing, with results nobody remembers
(`"" == 0` is `true`, `null == undefined` is `true`). `===` compares value
_and_ type, which is what you meant.

```js
// ✅
if (answer === correctAnswer) {
  damageMonster();
}

// ❌ — `"2" == 2` is true, and so is `null == undefined`
if (answer == correctAnswer) {
  damageMonster();
}
```

_ESLint:_ `no-var`, `prefer-const` and `eqeqeq` are all errors.

---

## Modules: named exports, and always `.js`

**Named exports only** (in `src/`). With `export default` every file can
import the same thing under a different name — `import battle from ...` in one
file and `import renderBattle from ...` in another — so searching for where a
function is used stops working. Named exports force one spelling everywhere.

```js
// ✅ src/js/ui/battle-screen.js
export function renderBattle(monster) {}
export function renderHearts(hearts) {}

// ✅ importing
import { renderBattle, renderHearts } from "./ui/battle-screen.js";

// ❌
export default function renderBattle(monster) {}
```

**Always write the `.js` extension** in relative imports. Browsers load ES
modules by URL, and a URL without an extension is just a different URL — there
is no "try adding .js" step like in Node or a bundler config. Vite's dev
server is forgiving, the browser isn't.

```js
import { getQuestions } from "./api/questions.js"; // ✅
import { getQuestions } from "./api/questions"; // ❌
```

_ESLint:_ `export default` is an error inside `src/` (rule
`no-restricted-syntax`). The missing extension is not enforced — review
catches it.

---

## Data from the APIs

External APIs often return `snake_case` fields: the D&D 5e API gives
`hit_points` and `armor_class`, and the database behind our own server has
`question_id` and `is_correct`.

**Don't rename API data while you are still holding API data.** If the object
came from `fetch`, read it exactly as the API spelled it — that way you can
compare our code to the API documentation line by line.

```js
const monster = await getMonster("goblin");

console.warn(monster.hit_points); // ✅ that is the API's name for it
```

**Rename at the boundary**, when you pull the values out into our own
variables. Destructuring can rename in one step:

```js
// ✅ from here on it's our data, so it follows our naming
const { hit_points: hitPoints, armor_class: armorClass } = monster;

const monsterHealth = hitPoints;
```

_ESLint:_ `camelcase` is configured with `{ properties: "never" }`, which is
exactly this rule: `monster.hit_points` is fine, but
`const hit_points = ...` is an error.

---

## Finding elements in the DOM

**JS selects elements by `data-js` attributes. Never by BEM class.**

BEM classes belong to the design ([bem.md](bem.md)). The day somebody renames
`.battle__answer` to `.battle__answer-button` while restyling, they should not
have to grep the JavaScript to check whether the game still works. A
`data-js` attribute exists only for JavaScript, so it is obvious that removing
it breaks something.

```html
<button class="battle__answer" data-js="answer-button" type="button">
  Answer
</button>
```

```js
// ✅
const answerButtons = document.querySelectorAll('[data-js="answer-button"]');

// ❌ — breaks the next time someone restyles the battle screen
const answerButtons = document.querySelectorAll(".battle__answer");
```

Note the quotes: the attribute value needs `"..."` inside the selector, so
write the whole selector in single quotes.

**Events are added with `addEventListener`, never inline `onclick`** in the
HTML. Inline handlers put JavaScript in the HTML file (where no linter or
editor helps you), only allow one handler per element, and need a global
function to call.

```html
<button data-js="start-button" type="button">Start</button>
<!-- ❌ <button onclick="startGame()">Start</button> -->
```

```js
const startButton = document.querySelector('[data-js="start-button"]');

startButton.addEventListener("click", handleStartClick); // ✅
```

_ESLint:_ not enforced — ESLint doesn't read our HTML. This is a review rule.

---

## Never assign `innerHTML`

`element.innerHTML = something` parses the string as HTML. For a coding
trivia game that is a direct problem, not a theoretical one: **our questions
are about code, so they contain code.** A question like
`What does <script> do?` or an answer containing `<div>` either disappears
from the page or breaks the layout. And since the text comes from an API and
not from us, it can also run code as if we had written it into our own page —
`<img src="x" onerror="...">` is enough, no `<script>` tag needed.

Use `textContent` (which always shows text as text), or build elements with
`createElement`:

```js
// ✅ the question shows up exactly as written, tags and all
questionElement.textContent = question.question;

// ✅ building structure
const button = document.createElement("button");
button.type = "button";
button.className = "battle__answer";
button.dataset.js = "answer-button";
button.textContent = answerText;
answersElement.append(button);

// ❌
questionElement.innerHTML = question.question;
answersElement.innerHTML += `<button>${answerText}</button>`;
```

To empty a container, use `replaceChildren()` instead of `innerHTML = ""`:

```js
answersElement.replaceChildren(); // ✅ removes all children
```

_ESLint:_ any assignment to `.innerHTML` in `src/` is an error
(`no-restricted-syntax`).

---

## Async code and `fetch`

We use **`async`/`await`**, not `.then()` chains — awaited code reads
top-to-bottom like normal code, and `try`/`catch` works the way you expect.

Two things to remember about `fetch`:

1. **`fetch` does not throw on 404 or 500.** A response _is_ a successful
   result to `fetch`, even when the server says "not found". Only a network
   failure (no connection, DNS, CORS) rejects the promise. So you must check
   `response.ok` yourself, or you'll happily call `.json()` on an error page.
2. **An `await` that fails with nothing to catch it kills the rest of the
   function** and leaves the screen half-drawn. Every chain of `await` calls
   ends in a `try`/`catch` somewhere — see the split below.

### Who handles the error

We split it in two, along the same line as the folders:

| Layer                                 | Job when something fails                               |
| ------------------------------------- | ------------------------------------------------------ |
| `api/`                                | `throw new Error("<what went wrong, in plain words>")` |
| `pages/` (or the `ui/` code it calls) | `try`/`catch` → `showError(...)`                       |

`api/` never talks to the player — it doesn't know whether the call came from
the lobby or a battle. It throws, with a message a human can read. Whoever
called it catches that and shows it.

```js
// src/js/api/questions.js

/**
 * Picks questions for one tower and difficulty in random order.
 *
 * @param {string} tower - A tower id from TOWERS, e.g. "html".
 * @param {string} difficulty - "EASY", "MEDIUM", "HARD" or "EXTREME".
 * @param {number} count - How many to pick.
 * @returns {Promise<object[]>} Questions: { id, question, answers }
 * @throws {Error} If the request fails.
 */
export async function getQuestions(tower, difficulty, count) {
  const response = await fetch(
    `/api/questions?tower=${tower}&difficulty=${difficulty}&count=${count}`,
  );

  if (!response.ok) {
    throw new Error(`the question server answered ${response.status}`);
  }

  const questions = await response.json();

  return questions.map((question) => ({
    id: question.id,
    question: question.text,
    answers: question.answers,
  }));
}
```

The page script catches it:

```js
// src/js/pages/singleplayer.js
import { QUESTIONS_PER_BATTLE } from "../game/constants.js";
import { getQuestions } from "../api/questions.js";
import { showError } from "../ui/error-message.js";
import { startBattle } from "../ui/battle-screen.js";

try {
  const questions = await getQuestions("html", "EASY", QUESTIONS_PER_BATTLE);

  startBattle(questions);
} catch (error) {
  showError(`Could not load questions: ${error.message}`, error);
}
```

The player then gets `Could not load questions: the question server answered
500`, instead of a page that silently does nothing.

One `try` around the whole chain is enough — it catches both our thrown
`Error` and a network failure from `fetch` itself.

### `showError` lives in one file

Showing the error is `ui/` work, and it goes in **one** module so we can
change how errors look in one place:

```js
// src/js/ui/error-message.js

/**
 * Tells the player that something went wrong, and logs it for us.
 *
 * @param {string} message - What to tell the player, in plain words.
 * @param {Error} [error] - The original error, for the console.
 */
export function showError(message, error) {
  console.error(message, error);
  alert(message);
}
```

`alert()` is blunt — it blocks the page and it's ugly — but it is one line
and it is impossible to miss, which is what we want while we build the game.
Because every error goes through this one function, swapping it for a proper
in-game dialog later is a change to **one file**, not to every `catch` in the
project.

### Write down what an API does

Each external API has a notes file in `docs/logs/`, named after the API, e.g.
`docs/logs/dnd-api.md`. Our own `/api` is documented in
[backend.md](backend.md). When you work out something
that wasn't obvious — what a field is really called, which status code means
"out of requests", what you get back for a category that doesn't exist — add
a line there, so the next person doesn't re-discover it with `console.log`.
The template is in [docs/logs/README.md](../logs/README.md).

These files are written by hand: JavaScript in a browser has no access to the
repo, so it cannot write into `docs/`. At runtime the code does what the
section above describes — `console.error` for us, `alert` for the player.

_ESLint:_ not enforced.

---

## `console.log`

`console.log` is for debugging _you_, right now. It doesn't belong in code
somebody else has to read, and a logging game console in the browser looks
broken to anyone who opens the dev tools.

So `console.log` gives a **warning**: your editor shows it, `npm run lint:js`
lists it, but CI still passes — debugging shouldn't be blocked. **Remove your
debug logs before you open the pull request.**

`console.warn` and `console.error` are allowed without a warning, because
those are real messages about something going wrong (like the `catch` above),
not leftovers.

```js
console.log("hearts:", hearts); // ⚠️ warning — remove before the PR
console.warn("No monster image, using fallback"); // ✅
console.error("Could not load questions:", error); // ✅
```

_ESLint:_ `no-console`, set to warn, with `warn` and `error` allowed.

---

## Where does the code go?

`src/js/` has seven folders and one shared file. The folder list is in
[indexing.md](indexing.md); this is what each one is allowed to contain.

| Folder        | Contains                                             | Must not contain                |
| ------------- | ---------------------------------------------------- | ------------------------------- |
| `api/`        | `fetch` calls, URLs, `import.meta.env`               | game rules, DOM code            |
| `game/`       | Game rules, constants and state: damage, hearts      | **any DOM code**                |
| `ui/`         | DOM: reading elements, rendering, event listeners    | game rules, `fetch`             |
| `utils/`      | Small helpers used by several files (`shuffle`, ...) | anything game- or page-specific |
| `pages/`      | One entry script per HTML page — wiring only         | rules, rendering, fetching      |
| `components/` | Shared templates (header, footer)                    | game rules, `fetch`             |
| `data/`       | The question JSON, the source for the database       | code; the game never imports it |
| `main.js`     | Shared setup every page needs (the SCSS import)      | page-specific code              |

The one that matters most is **`game/` never touches the DOM**. Game rules
written as plain functions over plain values can be read — and later tested —
without a browser, a page or a click:

```js
// ✅ src/js/game/battle.js — a rule, nothing else
export function applyAnswer(state, isCorrect) {
  if (isCorrect) {
    return { ...state, monsterHealth: state.monsterHealth - 1 };
  }

  return { ...state, hearts: state.hearts - 1 };
}

// ❌ same rule, now impossible to read without the page
export function applyAnswer(isCorrect) {
  const hearts = Number(
    document.querySelector('[data-js="hearts"]').dataset.count,
  );
  // ...
}
```

`ui/` then asks `game/` what happened and draws the result. If you catch
yourself writing `document.` in `game/`, the code belongs in `ui/`.

_ESLint:_ not enforced.

---

## Entry scripts: one per page

**Every HTML page loads its own entry script from `src/js/pages/`, named after
the page it belongs to.**

| Page                      | Entry script                   |
| ------------------------- | ------------------------------ |
| `index.html`              | `src/js/pages/index.js`        |
| `pages/lobby.html`        | `src/js/pages/lobby.js`        |
| `pages/singleplayer.html` | `src/js/pages/singleplayer.js` |
| `pages/createplayer.html` | `src/js/pages/createplayer.js` |
| `pages/tutorial.html`     | `src/js/pages/tutorial.js`     |
| `pages/credits.html`      | `src/js/pages/credits.js`      |

The page loads it as a module, with a path from the project root:

```html
<script type="module" src="/src/js/pages/lobby.js"></script>
```

Why one per page and not one shared file: with a single script, every page
runs the same code, so it has to start by working out which page it is on —
and the lobby downloads the battle code it never uses. With one file per page,
the script **is** the answer to "what happens on this page", and two people
working on two pages don't edit the same file.

An entry script only **wires things together**. It has no rules of its own:

```js
// src/js/pages/lobby.js — everything that happens on lobby.html
import "../main.js";
import { getState } from "../game/state.js";
import { renderPlayerName, renderTowers } from "../ui/lobby-screen.js";

const { playerName, towers } = getState();

renderPlayerName(playerName);
renderTowers(towers);
```

If an entry script grows past wiring — it starts calculating damage, or
building elements — that code belongs in `game/` or `ui/`.

`vite.config.js` lists the HTML **pages**, not the scripts: Vite finds the
script through the page's `<script>` tag. So a new page means two steps —
create `src/js/pages/<name>.js`, and add the page to `vite.config.js`.

### Is `main.js` like `style.scss`?

Yes — that is exactly the right comparison, with one adjustment now that each
page has its own script.

`src/scss/style.scss` is the one stylesheet: it pulls in every partial from
`base/`, `layout/`, `components/` and `pages/`, and every page gets the whole
thing. `src/js/main.js` is the same idea for JavaScript — the setup **every**
page needs — except it is no longer the file the HTML loads. Each page script
imports it on the first line:

```js
// src/js/main.js — runs on every page, whichever page it is
import "../scss/style.scss";
```

```js
// src/js/pages/lobby.js
import "../main.js"; // stylesheet + shared setup
```

That import is also what gets our SCSS into the build at all: Vite compiles
the SCSS it finds through JS imports (see
[project-structure.md](../project-structure.md)). Keeping it in `main.js`
means no page can forget it and render unstyled.

So: **`style.scss` gathers all the CSS, `main.js` gathers what all pages
share, and `pages/<name>.js` is the one file that differs per page.**

_ESLint:_ not enforced.

---

## Constants and state

Values in the game come in two kinds, and they live in two different modules:

| Kind         | Module                     | Changes while playing? | Example                                 |
| ------------ | -------------------------- | ---------------------- | --------------------------------------- |
| **Constant** | `src/js/game/constants.js` | Never                  | `BASE_MAX_HEARTS`, `MAX_TOWER_LEVEL`    |
| **State**    | `src/js/game/state.js`     | Yes                    | `hearts`, `playerLevel`, `currentTower` |

The question to ask is "can this be different the next time I look at it?"
No means constant — `UPPER_SNAKE_CASE`, decided once when we write the code.
Yes means state, and **all** of it lives in that one module: player name,
hearts, level, current tower, current question, tower levels. Not as separate
variables spread across files, and never on `window`.

One state module means there is one answer to "how many hearts does the player
have right now?" and one place to look when it's wrong.

```js
// ✅ src/js/game/constants.js — numbers we decided on, nothing else
export const BASE_MAX_HEARTS = 3;
export const HEARTS_PER_LEVEL = 1;
export const MAX_TOWER_LEVEL = 3;
export const QUESTIONS_PER_BATTLE = 5;
```

A useful check: **`constants.js` imports nothing.** If a value needs an import
to work out, it isn't a constant — it's state, or it's derived from state.

### Values derived from both

Some values are neither, because they are calculated from a constant **and**
the current state. Max health is exactly that: it starts at `BASE_MAX_HEARTS`
and grows with the player's level.

Don't store a derived value. Store what it's computed from, and export a
function that computes it:

```js
// ✅ src/js/game/state.js
import { BASE_MAX_HEARTS, HEARTS_PER_LEVEL } from "./constants.js";

const state = {
  playerName: "",
  playerLevel: 1,
  hearts: BASE_MAX_HEARTS,
  towers: [], // one entry per tower, with its current level
  currentTower: null,
  currentQuestion: null,
};

export function getState() {
  return state;
}

/**
 * The player's maximum hearts right now: the base, plus one per level gained.
 *
 * @returns {number} Max hearts at the player's current level.
 */
export function getMaxHearts() {
  return BASE_MAX_HEARTS + (state.playerLevel - 1) * HEARTS_PER_LEVEL;
}

export function loseHeart() {
  state.hearts -= 1;
}

export function levelUp() {
  state.playerLevel += 1;
  // A new level heals the player back to the new maximum.
  state.hearts = getMaxHearts();
}
```

If we stored `maxHearts` as its own value instead, every place that changes
the level would have to remember to update it too — and the first time one
place forgets, the health bar is wrong for the rest of the run. A function
can't go out of date.

```js
// ❌ somewhere in ui/
window.hearts = 3; // global — anything can change it, nothing records that it did
```

_ESLint:_ not enforced.

---

## Magic numbers

A bare number in the middle of the code makes the reader guess, and when the
same number appears in four files, changing it means finding all four.

```js
// ❌ what is 3? what is 0.25?
if (towerLevel === 3) {
  unlockBossFight();
}

damage = damage * 0.25;

// ✅
const MAX_TOWER_LEVEL = 3;
const WRONG_ANSWER_PENALTY = 0.25;

if (towerLevel === MAX_TOWER_LEVEL) {
  unlockBossFight();
}

damage = damage * WRONG_ANSWER_PENALTY;
```

`0` and `1` in obvious places (`hearts -= 1`, `array.length === 0`) are fine —
the rule is about numbers whose _meaning_ isn't obvious.

Where to put it: a number only one file uses goes at the top of that file. A
number the game rules share goes in `game/constants.js` — see
[Constants and state](#constants-and-state).

_ESLint:_ not enforced.

---

## Comments and JSDoc

**Every exported function gets a JSDoc comment** (`/** ... */`), because an
exported function is used by code in another file, where the reader can't see
how it works. Editors show JSDoc as a tooltip at the call site, so writing it
pays off immediately.

```js
/**
 * Picks a random monster suited to a tower level.
 *
 * @param {number} towerLevel - Current level of the tower, from 1.
 * @returns {Promise<object>} A monster from the D&D API.
 */
export async function getMonsterForLevel(towerLevel) {}
```

**Ordinary comments explain _why_, not _what_.** The code already says what it
does; what it can't say is the reason.

```js
// ❌ adds one to the level
towerLevel += 1;

// ✅ the API has no questions above difficulty 3, so we cap the level
const apiLevel = Math.min(towerLevel, 3);
```

A comment that only repeats the code goes stale the first time the code
changes, and then it's worse than no comment.

_ESLint:_ not enforced.

---

## Line length

**Prettier handles it.** Lines wrap at 80 characters, automatically, on save.

Never wrap code by hand to make it "fit" — Prettier will just reformat it, and
your manual line breaks show up as noise in the pull request diff. Write the
line, press `Ctrl+S`, move on.

ESLint has a `max-len` rule, but it is deprecated (ESLint dropped its
formatting rules; formatting is Prettier's job), so we don't use it. If a line
is still hard to read after Prettier, that's usually a sign to give part of it
a name:

```js
// hard to read even at 80 characters
renderBattle(state.currentMonster, state.currentQuestion, state.hearts, true);

// easier
const { currentMonster, currentQuestion, hearts } = getState();

renderBattle(currentMonster, currentQuestion, hearts, { isBoss: true });
```

---

## How these rules show up

What ESLint prints when you break each rule, and whether
`npm run lint:js:fix` can fix it for you:

| Rule                   | Message                                                                                                  | Auto-fix  |
| ---------------------- | -------------------------------------------------------------------------------------------------------- | --------- |
| `no-var`               | Unexpected var, use let or const instead                                                                 | ✅ yes    |
| `prefer-const`         | 'x' is never reassigned. Use 'const' instead                                                             | ✅ yes    |
| `eqeqeq`               | Expected '===' and instead saw '=='                                                                      | ⚠️ rarely |
| `camelcase`            | Identifier 'hit_points' is not in camel case                                                             | ❌ no     |
| `no-console`           | Unexpected console statement. Only these console methods are allowed: warn, error _(warning, not error)_ | ❌ no     |
| `no-restricted-syntax` | Use named exports (export function ...), not export default                                              | ❌ no     |
| `no-restricted-syntax` | Don't assign innerHTML. Use textContent, or build elements with createElement. ...                       | ❌ no     |

`eqeqeq` says "rarely" because ESLint only rewrites `==` when it can prove
both sides are the same type (`1 == 2`). In real code, where at least one side
is a variable, it can't — so you fix it yourself.

The format of an error line (file, line:column, message, rule name) is
explained in [code-quality.md](code-quality.md#reading-an-error), together
with how to turn off a rule for one line in the rare case where it's wrong —
[code-quality.md](code-quality.md#turning-a-rule-off-rarely).

---

## Open questions

To be decided by the team — don't guess, ask at a standup:

- **Do we use classes at all?** The naming table covers `PascalCase` for
  classes, but we haven't decided whether monsters and towers are classes or
  plain objects.
- **Does `showError` need a "try again" option?** Right now the player gets an
  alert and the screen stays as it was. For "out of requests" that's probably
  not enough — but a retry button is only worth building once we see how
  often it actually happens.

---

Related: [code-quality.md](code-quality.md) (tools and commands) ·
[indexing.md](indexing.md) (where files go) · [bem.md](bem.md) (CSS naming) ·
[project-structure.md](../project-structure.md) (config files and `.env`)
