# AGENTS.md

Instructions for AI coding tools and new developers. Details live in `docs/`;
this file is the short version.

## Project

codeSpire is a coding trivia RPG: pick a tower (HTML, CSS, JavaScript), fight
D&D monsters by answering questions, climb floors and difficulties.

- Live site: https://codespire.opuswright.com (Cloudflare Workers)
- Main repo: https://github.com/Levvo42/codespire
- Stack: Vite, plain JavaScript (ES modules), SCSS with BEM, no framework
- Backend (in progress): Cloudflare Worker in `server/` with a D1 (SQLite)
  database

## Commands

```bash
npm run dev       # Vite dev server for the game (localhost:5173)
npm run build     # production build into dist/
npm run check     # Prettier + ESLint + Stylelint + html-validate (same as CI)
npx wrangler dev  # Worker + local D1 (localhost:8787), serves the built dist/
```

While developing, run `npx wrangler dev` and `npm run dev` side by side; Vite
proxies `/api` to the Worker.

`npm run check` must pass before a PR. CI (`.github/workflows/ci.yml`) runs
the same checks plus the build. `.github/workflows/database.yml` keeps the
online databases in sync (see below).

## Folder structure

```
index.html, pages/   HTML pages; every page must be listed in vite.config.js
src/js/pages/        one entry script per page, wiring only
src/js/game/         game rules and state, no DOM
src/js/api/          fetching from external APIs and our own /api
src/js/ui/           drawing to the screen
src/js/components/   shared templates (header, footer)
src/js/utils/        small helpers
src/js/data/         question JSON (source for the database seed)
src/scss/            styles, BEM class names
src/assets/          images, audio, fonts that code imports
server/              Cloudflare Worker (the /api routes)
migrations/          D1 schema changes, numbered, never edited once applied
scripts/             Node scripts, e.g. seed-questions.js -> seed.sql
docs/                team docs and tutorials
```

See `docs/project-structure.md` and `docs/tutorials/indexing.md`.

## Code rules

- Named exports only, imports always end in `.js`.
- Never assign `innerHTML`; use `textContent` or `createElement`. Questions
  contain HTML code as text.
- `const`/`let`, never `var`; always `===`; camelCase names.
- API data is renamed into our own shape at the boundary (see
  `src/js/api/monsters.js`).
- Keep the layers: `game/` never touches the DOM, `pages/` only wires things
  together.
- Group code with `// #region` / `// #endregion` comments; keep comments short.
- CSS classes use BEM (`block__element--modifier`).
- LF line endings, Prettier formatting.

Full conventions: `docs/tutorials/javascript.md`, `docs/tutorials/bem.md`,
`docs/tutorials/semantic-html.md`, `docs/tutorials/code-quality.md`.

## Backend and database

- `wrangler.jsonc` sets the Worker entry (`server/index.js`), the static
  assets (`dist/`) and the D1 binding `codespire_db` (`env.codespire_db`).
- The server owns anything a player could cheat with: correct answers, and
  later battle math and loot. Never send `is_correct` to the browser.
- Use `.prepare("... ? ...").bind(...)` for every query; never build SQL from
  user input.
- Three databases: local (`.wrangler/`, `--local`), `codespire-db-preview`
  (PR previews, `--remote --preview`) and `codespire-db` (live, `--remote`).
  Only ever run `--local` commands; never run `--remote` ones.
- `src/js/data/*.json` is the source of the questions. To change questions,
  edit the JSON, then `node scripts/seed-questions.js` and
  `npx wrangler d1 execute codespire-db --local --file=seed.sql`.
- Schema change: `npx wrangler d1 migrations create codespire-db <name>`, then
  `npx wrangler d1 migrations apply codespire-db --local`. Never edit a merged
  migration; only add tables/columns (old and new code overlap during deploys).
- The Database workflow applies migrations and reseeds: on the preview database
  for PRs that touch `migrations/` or `src/js/data/`, on the live database on
  merge to `main`.
- Full guide: `docs/tutorials/backend.md`.

## Workflow

- Work on a branch (`feat/...`, `fix/...`, `docs/...`), open a PR to `main`.
- Merging to `main` deploys the live site.
- When a change alters how something works, update the matching doc in
  `docs/` in the same PR.
