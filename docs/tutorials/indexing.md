# Project Index

This document explains where files belong in the project.

```text
project-root/
│
├── index.html
│
├── pages/
│   ├── lobby.html
│   ├── singleplayer.html
│   ├── createplayer.html
│   ├── tutorial.html
│   ├── credits.html
│   ├── bugreport.html
│   └── story/
│       ├── intro.html
│       ├── prologue.html
│       └── chapter1.html … chapter5.html
│
├── src/
│   ├── js/
│   │   ├── api/
│   │   ├── components/
│   │   ├── data/
│   │   ├── game/
│   │   ├── pages/
│   │   ├── ui/
│   │   ├── utils/
│   │   └── main.js
│   │
│   ├── scss/
│   │   ├── base/
│   │   ├── layout/
│   │   ├── components/
│   │   ├── pages/
│   │   └── style.scss
│   │
│   └── assets/
│       ├── images/
│       ├── icons/
│       ├── music/
│       └── fonts/
│
├── public/
│   ├── avatars/
│   ├── favicon.svg
│   ├── robots.txt
│   └── sitemap.xml
│
├── server/
│   └── index.js
│
├── migrations/
│   └── 0001_init.sql
│
├── scripts/
│   └── seed-questions.js
│
├── docs/
│   ├── project-structure.md
│   │
│   ├── team/
│   │   ├── commitments.md
│   │   └── meetings/
│   │
│   ├── project/
│   │   ├── story-points.md
│   │   ├── MVP Scope.md
│   │   └── Development.md
│   │
│   ├── tutorials/
│   │   ├── setup.md
│   │   ├── backend.md
│   │   ├── daily-git-operations.md
│   │   ├── indexing.md
│   │   ├── code-quality.md
│   │   ├── javascript.md
│   │   ├── bem.md
│   │   └── semantic-html.md
│   │
│   ├── logs/
│   │   └── README.md
│   │
│   └── assets/
│       └── images/
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── database.yml
│
├── package.json
├── package-lock.json
├── vite.config.js
├── wrangler.jsonc
├── .gitignore
├── AGENTS.md
└── README.md
```

## What goes where?

### `pages/`

HTML pages other than the main `index.html`. The story pages live in
`pages/story/`. Every page must also be listed in `vite.config.js`.

### `src/js/`

JavaScript used by the website.

- `api/` — API requests (the D&D API and our own `/api`)
- `components/` — shared templates every page uses (header and footer)
- `game/` — game rules, constants and state
- `pages/` — one entry script per HTML page (`lobby.html` → `pages/lobby.js`)
- `ui/` — interface behaviour
- `utils/` — reusable helper functions
- `data/` — the question JSON. The source for the database, not loaded by
  the game itself
- `main.js` — the setup every page shares; each page script imports it

Which code belongs in which folder is explained in
[javascript.md](javascript.md).

### `src/scss/`

All SCSS used by the website. `style.scss` imports every partial in
`base/`, `layout/`, `components/` and `pages/`.

### `src/assets/`

Images, icons, music and fonts used by the game.

> Git does not track empty folders — create a subfolder (e.g. `images/`) when
> you add the first real file to it, not before.

### `public/`

Files that Vite should serve directly without processing, e.g. the player
avatars in `avatars/`, whose paths are built at runtime.

### `server/`

The Worker: our server code, which answers `/api/...` requests and talks to
the database. See [backend.md](backend.md).

### `migrations/`

Numbered SQL files that create and change the database tables. Never edit one
after it has been merged — add a new one.

### `scripts/`

Node scripts we run by hand, e.g. `seed-questions.js`, which turns the
question JSON into `seed.sql`.

### `docs/`

Project documentation.

- `team/` — group contract and meeting notes
- `project/` — planning: story points, MVP scope and the Figma designs
- `tutorials/` — guides for working in the project
- `logs/` — what each API actually does (one file per API)
- `assets/images/` — images used only in documentation

## Simple rule

If it is used by the **game in the browser**, it belongs in `src/` or `public/`.

If it runs on the **server**, it belongs in `server/` (and `migrations/` for
the database structure).

If it is used to **explain the project**, it belongs in `docs/`.

For details on the config files, secrets, and the `src/assets/` vs `public/`
distinction, see [`docs/project-structure.md`](../project-structure.md).
