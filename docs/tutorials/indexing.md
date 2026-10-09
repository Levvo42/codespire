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
│   ├── tutorial.html
│   └── credits.html
│
├── src/
│   ├── js/
│   │   ├── api/
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
│   │   └── pages/
│   │
│   └── assets/
│       ├── images/
│       ├── icons/
│       ├── audio/
│       └── fonts/
│
├── public/
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
│   │   └── story-points.md
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

HTML pages other than the main `index.html`.

### `src/js/`

JavaScript used by the website.

- `api/` — API requests (the D&D API and our own `/api`)
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

All SCSS used by the website.

### `src/assets/`

Images, icons, audio and fonts used by the game.

> Git does not track empty folders — create a subfolder (e.g. `images/`) when
> you add the first real file to it, not before.

### `public/`

Files that Vite should serve directly without processing.

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
- `project/` — planning and project structure
- `tutorials/` — guides for working in the project
- `logs/` — what each API actually does (one file per API)
- `assets/images/` — images used only in documentation

## Simple rule

If it is used by the **game in the browser**, it belongs in `src/` or `public/`.

If it runs on the **server**, it belongs in `server/` (and `migrations/` for
the database structure).

If it is used to **explain the project**, it belongs in `docs/`.

For details on the config files, `.env`, and the `src/assets/` vs `public/`
distinction, see [`docs/project-structure.md`](../project-structure.md).
