# Code Quality — Formatting and Linting

Four tools check our code automatically, both in VS Code while you type and on
GitHub for every pull request. This guide covers the one-time setup, what to do
every day, how to read and fix errors, and what happens on GitHub.

Installing Node and the project itself is covered in [setup.md](setup.md).
The JavaScript rules ESLint enforces for us — and the conventions it can't
check — are in [javascript.md](javascript.md).

---

## The tools

| Tool              | Checks                                                                                          | Files                  | Config file           |
| ----------------- | ----------------------------------------------------------------------------------------------- | ---------------------- | --------------------- |
| **Prettier**      | Formatting only: indentation, quotes, line breaks                                               | Everything             | `.prettierrc.json`    |
| **ESLint**        | JavaScript bugs (undefined names, unused variables) **and our [JS conventions](javascript.md)** | `.js`                  | `eslint.config.js`    |
| **Stylelint**     | SCSS mistakes, **BEM class names**, **max 3 nesting levels**                                    | `src/**/*.scss`        | `stylelint.config.js` |
| **html-validate** | Invalid HTML, duplicate IDs, accessibility (e.g. missing `alt`)                                 | `index.html`, `pages/` | `.htmlvalidate.json`  |

The difference that matters:

- **Prettier** decides how code _looks_. You never fix formatting by hand — Prettier does it.
- The three **linters** find things that are _wrong_ or break our team rules. Most of those need a human to fix.

Other related files:

| File                       | Purpose                                                     |
| -------------------------- | ----------------------------------------------------------- |
| `.prettierignore`          | Files Prettier skips (plus everything in `.gitignore`)      |
| `.gitattributes`           | Forces LF line endings for everyone, on every OS            |
| `.vscode/settings.json`    | Shared editor settings: format on save, auto-fix on save    |
| `.vscode/extensions.json`  | The extensions VS Code recommends when you open the project |
| `.github/workflows/ci.yml` | The checks GitHub runs on every pull request                |

Limitation: html-validate checks the `.html` **files**. HTML that our JavaScript
creates at runtime (e.g. game screens built from API data) is not checked.

---

## One-time setup

### 1. Get the latest code and install

```powershell
git switch main
git pull
npm ci
```

`npm ci` installs Prettier, ESLint, Stylelint and html-validate into
`node_modules/`, at the exact versions in `package-lock.json`.

### 2. Install the VS Code extensions

Open the **project folder itself** in VS Code (File → Open Folder → the repo
folder — not a parent folder, or the shared settings don't apply).

VS Code shows a popup: _"This workspace has extension recommendations"_ →
click **Install**. Or install them manually (`Ctrl+Shift+X`):

| Extension                 | Publisher     | ID                                   |
| ------------------------- | ------------- | ------------------------------------ |
| Prettier - Code formatter | Prettier      | `esbenp.prettier-vscode`             |
| ESLint                    | Microsoft     | `dbaeumer.vscode-eslint`             |
| Stylelint                 | Stylelint     | `stylelint.vscode-stylelint`         |
| html-validate             | html-validate | `html-validate.vscode-html-validate` |

Check the publisher — several extensions have copycat names.

You do **not** need to change any VS Code settings yourself. They come from
`.vscode/settings.json` in the repo.

### 3. Test that it works

Open `index.html`, mess up the indentation of a line, press `Ctrl+S`. The line
should snap back. If not, see [Troubleshooting](#troubleshooting).

---

## Every day

**While you work** — every `Ctrl+S`:

1. Prettier formats the file.
2. ESLint and Stylelint auto-fix what they safely can.

Problems that can't be auto-fixed show as **squiggles**. Hover over one to see
the message and the rule name. The **Problems** panel (`Ctrl+Shift+M`) lists
all of them.

**Before you push** — always:

```powershell
npm run check
```

This runs the same checks as GitHub (except the build). If it prints no errors,
your pull request will pass. If it fails locally, it will fail on GitHub too.

---

## All commands

| Command                | What it does                                          |
| ---------------------- | ----------------------------------------------------- |
| `npm run check`        | **Everything:** format check + all three linters      |
| `npm run format`       | Formats all files (changes files)                     |
| `npm run format:check` | Only reports unformatted files (changes nothing)      |
| `npm run lint`         | All three linters                                     |
| `npm run lint:js`      | ESLint only                                           |
| `npm run lint:js:fix`  | ESLint + fix what can be fixed automatically          |
| `npm run lint:css`     | Stylelint only                                        |
| `npm run lint:css:fix` | Stylelint + fix what can be fixed automatically       |
| `npm run lint:html`    | html-validate only (no auto-fix — HTML needs a human) |

`npm run lint` and `npm run check` stop at the first tool that finds errors.
Fix those, run again, and the next tool runs.

To run a tool on a single file, use `npx`:

```powershell
npx prettier --write src/js/game/battle.js
npx eslint src/js/game/battle.js
```

---

## Reading an error

All three linters print errors the same way:

```text
src/js/main.js
  2:13  error  'undefinedVariable' is not defined  no-undef
```

| Part                         | Meaning                           |
| ---------------------------- | --------------------------------- |
| `src/js/main.js`             | The file                          |
| `2:13`                       | Line 2, column 13                 |
| `'undefinedVariable' is ...` | What's wrong                      |
| `no-undef`                   | The **rule name** — search for it |

Search for `eslint no-undef`, `stylelint max-nesting-depth` and so on. Every
rule has a docs page explaining why it exists, with right and wrong examples.
html-validate prints the docs links for you at the bottom of its output.

---

## Fixing errors

Work in this order:

1. `npm run format` — fixes all formatting.
2. `npm run lint:js:fix` and `npm run lint:css:fix` — fix what can be auto-fixed.
3. Fix the rest by hand.

Errors you are likely to meet in this project:

| Rule                      | Tool          | Typical cause → fix                                                                                      |
| ------------------------- | ------------- | -------------------------------------------------------------------------------------------------------- |
| `no-undef`                | ESLint        | Typo in a name, or forgot to `import` it → fix the name / add the import                                 |
| `no-unused-vars`          | ESLint        | Leftover variable or import → remove it                                                                  |
| `no-var`, `prefer-const`  | ESLint        | `var`, or a `let` that is never reassigned → `npm run lint:js:fix` fixes both                            |
| `eqeqeq`                  | ESLint        | `==` instead of `===` → always `===`; see [javascript.md](javascript.md)                                 |
| `camelcase`               | ESLint        | `snake_case` name, usually copied from API data → rename it: `const { hit_points: hitPoints } = monster` |
| `no-console`              | ESLint        | Leftover `console.log` → remove it before the PR (**warning** only — CI still passes)                    |
| `no-restricted-syntax`    | ESLint        | `export default`, or assigning `innerHTML` → use a named export / `textContent`; the message says which  |
| `selector-class-pattern`  | Stylelint     | Class name isn't BEM (`.BattleAnswer`, `.battle__answers__button`) → see [bem.md](bem.md)                |
| `max-nesting-depth`       | Stylelint     | SCSS nested more than 3 levels → flatten; with BEM `&__element` you rarely need deep nesting             |
| `wcag/h37`                | html-validate | `<img>` without `alt` → describe the image, or `alt=""` if it's purely decorative                        |
| `no-implicit-button-type` | html-validate | `<button>` without `type` defaults to `submit` → write `type="button"` for normal buttons                |
| `no-dup-id`               | html-validate | Same `id` used twice on a page → IDs must be unique; use a class if several elements need the same hook  |

Most of the ESLint rules in this table are our team's JavaScript conventions.
Each one, with examples and the reasoning behind it, is in
[javascript.md](javascript.md).

---

## Turning a rule off (rarely)

Sometimes a rule is wrong for one specific line — e.g. a class name that comes
from a third-party library and can't be BEM.

**Team rule:** only ever for **one line**, and always with a reason after `--`.
Never change the config files to silence a rule without agreeing on it in the
team first.

```js
// eslint-disable-next-line no-unused-vars -- used by the boss battle in #42
const bossMultiplier = 2;
```

```scss
/* stylelint-disable-next-line selector-class-pattern -- class set by the chart library */
.ChartTooltip {
  color: red;
}
```

```html
<!-- [html-validate-disable-next wcag/h37 -- alt text is set by JS on load] -->
<img src="monster.png" />
```

The reason is for your teammates in code review — "why is this rule off here?"
should never need to be asked.

---

## Pull requests and GitHub

### What GitHub checks

Every pull request runs the **CI** workflow (`.github/workflows/ci.yml`) on
GitHub's servers. In the PR you see a box with **CI / check**:

- 🟡 running (about a minute)
- ✅ passed
- ❌ failed — click **Details** to see which step failed

The steps are: Prettier → ESLint → Stylelint → html-validate → Build. The build
step catches things the linters don't, like an import of a file that doesn't
exist.

### Rules on `main`

`main` is protected on GitHub:

- **No direct pushes.** `git push` to `main` is rejected — always a branch + pull request.
- **CI must be green** before the merge button works.
- **One approval from someone else.** You can't approve or merge your own PR alone.

### Reviewing a teammate's PR

1. Open the PR → **Files changed**.
2. Read the code. Click a line number to leave a comment or question.
3. **Review changes** → choose **Approve**, or **Request changes** with a comment on what to fix.

The point of the review is that everyone reads everyone's code — ask if
something is unclear; that's a valid review comment too.

### When CI is red

1. Click **Details** and find the red step.
2. Run the same command locally (e.g. `npm run lint:css`).
3. Fix, commit, `git push`. CI runs again automatically on the new commit.

---

## Troubleshooting

**Saving doesn't format the file**

- Is the Prettier extension installed (publisher: Prettier)?
- Did you open the project folder itself, not a parent folder?
- Open the Output panel (`Ctrl+Shift+U`), choose **Prettier** in the dropdown, and read the error.
- Did you run `npm ci`? The extension uses the Prettier installed in `node_modules/`.

**Right after pulling, git shows files as modified that you didn't touch**

Usually line endings (Windows CRLF vs our LF). Run:

```powershell
git add --renormalize .
git status
```

If `git status` is now clean, that was all. If files are still listed, ask in
Discord before doing anything else.

**`npm ci` fails with "package.json and package-lock.json are not in sync"**

Someone changed `package.json` but didn't commit the updated
`package-lock.json`. Run `npm install`, then commit `package-lock.json`.

**CI fails on GitHub, but `npm run check` passes locally**

- A file wasn't committed — check `git status`.
- You ran `npm run format` but didn't commit the result.
- The **Build** step failed — run `npm run build` locally; `check` doesn't include the build.

**A squiggle in `.htmlvalidate.json` on the `$schema` line**

You haven't run `npm ci` yet — the schema file lives in `node_modules/`.
