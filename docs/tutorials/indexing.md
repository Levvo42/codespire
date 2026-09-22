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
│   │   ├── ui/
│   │   └── utils/
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
│   │   ├── daily-git-operations.md
│   │   ├── indexing.md
│   │   ├── bem.md
│   │   └── semantic-html.md
│   │
│   └── assets/
│       └── images/
│
├── package.json
├── package-lock.json
├── vite.config.js
├── .gitignore
├── .env.example
└── README.md
```

## What goes where?

### `pages/`

HTML pages other than the main `index.html`.

### `src/js/`

JavaScript used by the website.

- `api/` — API requests
- `game/` — game logic
- `ui/` — interface behaviour
- `utils/` — reusable helper functions

### `src/scss/`

All SCSS used by the website.

### `src/assets/`

Images, icons, audio and fonts used by the game.

> Git does not track empty folders — create a subfolder (e.g. `images/`) when
> you add the first real file to it, not before.

### `public/`

Files that Vite should serve directly without processing.

### `docs/`

Project documentation.

- `team/` — group contract and meeting notes
- `project/` — planning and project structure
- `tutorials/` — guides for working in the project
- `assets/images/` — images used only in documentation

## Simple rule

If it is used by the **game**, it belongs in `src/` or `public/`.

If it is used to **explain the project**, it belongs in `docs/`.

For details on the config files, `.env`, and the `src/assets/` vs `public/`
distinction, see [`docs/project-structure.md`](../project-structure.md).