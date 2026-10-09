# Backend: the Worker and the database

How our server works, how to run it on your own computer, and what to do when
you add questions, change the database or add an API route.

You do **not** need a Cloudflare account for any of this. Everything you run
yourself uses a local copy of the database; GitHub updates the real ones.

---

## The big picture

```text
browser (the game)  ──fetch("/api/...")──►  Worker (server/index.js)  ──SQL──►  D1 database
   src/js/api/                                  Cloudflare                     questions, answers
```

- **Worker** — our server code, `server/index.js`. Cloudflare runs it for every
  request to `/api/...`. Every other URL (pages, images, scripts) is served
  straight from the built `dist/` folder.
- **D1** — Cloudflare's database. It is SQLite: tables with rows and columns,
  queried with SQL.
- **Why a server at all?** Before, the questions and their correct answers were
  bundled into the game, so anyone could read them in DevTools. Now the browser
  only gets the question and the answer texts; the server checks which answer
  is correct. The same idea will later cover battle math, saves and
  leaderboards — anything a player could cheat with lives on the server.

### The API

| Route                | What it does                                                        |
| -------------------- | ------------------------------------------------------------------- |
| `GET /api/health`    | Returns `{"ok":true}`. A quick "is the server alive?" check.        |
| `GET /api/questions` | `?tower=html&difficulty=EASY&count=10` → random questions, no key   |
| `POST /api/answer`   | Body `{"questionId":"html-easy-001","position":1}` → right or wrong |

The browser side lives in `src/js/api/questions.js`. It renames the server's
fields into our own shape, like every other file in `api/`.

### The files

| File / folder                    | What it is                                                         |
| -------------------------------- | ------------------------------------------------------------------ |
| `server/index.js`                | The Worker: one `fetch` function that routes `/api/...` requests   |
| `wrangler.jsonc`                 | Cloudflare config: the Worker entry, `dist/`, the database binding |
| `migrations/`                    | The database structure (tables), one numbered SQL file per change  |
| `src/js/data/*.json`             | The questions. **This is the source** — the database is a copy     |
| `scripts/seed-questions.js`      | Turns the JSON into `seed.sql` (SQL that refills the tables)       |
| `.github/workflows/database.yml` | Updates the online databases automatically (see below)             |
| `.wrangler/`                     | Your local database and temp files. Gitignored, never committed    |

**Wrangler** is Cloudflare's command line tool. It is a dev dependency, so
`npm ci` installs it and you run it with `npx wrangler ...`.

---

## The three databases

| Database               | Where        | Used by                                 | Who changes it               |
| ---------------------- | ------------ | --------------------------------------- | ---------------------------- |
| local                  | `.wrangler/` | `npx wrangler dev` on your computer     | you, with `--local` commands |
| `codespire-db-preview` | Cloudflare   | the preview link on every pull request  | GitHub, when a PR is pushed  |
| `codespire-db`         | Cloudflare   | the live site, codespire.opuswright.com | GitHub, when a PR is merged  |

Your local database is yours alone — break it as much as you like. Commands
with `--remote` change the online databases and need the owner's Cloudflare
login; you should never need them.

---

## Running it locally

### First time: create your local database

```powershell
npx wrangler d1 migrations apply codespire-db --local
node scripts/seed-questions.js
npx wrangler d1 execute codespire-db --local --file=seed.sql
```

1. Creates the tables (runs every file in `migrations/`).
2. Writes `seed.sql` from the question JSON.
3. Runs `seed.sql`, which empties the tables and fills them with every question.

Check it worked:

```powershell
npx wrangler d1 execute codespire-db --local --command="SELECT COUNT(*) FROM questions"
```

### Every time: two terminals

The game needs both the Vite dev server and the Worker running.

**Terminal 1 — the Worker** (localhost:8787):

```powershell
npx wrangler dev
```

**Terminal 2 — the game** (localhost:5173):

```powershell
npm run dev
```

Open http://localhost:5173 as usual. Vite forwards every `/api/...` request to
the Worker (the `server.proxy` setting in `vite.config.js`), so the game works
the same way it does online.

Wrangler reloads by itself when you save `server/index.js`. Stop either one
with `Ctrl + C`.

> localhost:8787 also serves the game, but from the **built** `dist/` folder —
> it only changes after `npm run build`. Play on 5173 while developing.

### Test the API directly

Open http://localhost:8787/api/health or
http://localhost:8787/api/questions?tower=html&difficulty=EASY&count=2 in the
browser. To test the POST route from PowerShell:

```powershell
curl -X POST http://localhost:8787/api/answer -H "Content-Type: application/json" -d '{"questionId":"html-easy-001","position":1}'
```

---

## Recipe: add or change questions

The JSON files in `src/js/data/` are the source of truth. Never add questions
straight into a database — the next seed would delete them.

1. **Edit the JSON** — `html.json`, `css.json` or `javascript.json`:

   ```json
   {
     "id": "html-easy-051",
     "difficulty": "EASY",
     "type": "MULTIPLE_CHOICE",
     "text": "Which element makes text bold and important?",
     "answers": [
       { "text": "<b>", "is-correct": false },
       { "text": "<strong>", "is-correct": true },
       { "text": "<em>", "is-correct": false },
       { "text": "<mark>", "is-correct": false }
     ],
     "explanation": "<strong> marks text as important; browsers show it bold.",
     "verified": false
   }
   ```

   - `id` must be unique: `<tower>-<difficulty>-<number>`. Never reuse or
     renumber an existing id — the game asks for answers by id.
   - `difficulty`: `EASY`, `MEDIUM`, `HARD` or `EXTREME`.
   - `type`: `MULTIPLE_CHOICE` (4 answers) or `TRUE_FALSE` (2 answers).
   - Exactly one answer has `"is-correct": true`.

2. **Reseed your local database:**

   ```powershell
   node scripts/seed-questions.js
   npx wrangler d1 execute codespire-db --local --file=seed.sql
   ```

   The seed always replaces **all** questions, so it is safe to run as often
   as you like. Restarting `wrangler dev` is not needed.

3. **Test it** — play that tower and difficulty on localhost:5173.

4. **Commit the JSON and open a pull request.** Don't commit `seed.sql`; it is
   generated (and gitignored).

5. **GitHub does the rest:**
   - On the pull request, the **Database** check reseeds the preview database,
     so the preview link already has your new questions.
   - When the PR is merged, the same check reseeds the live database.

---

## Recipe: change the database structure

New tables or columns (e.g. for accounts or saves) are made with a
**migration**: a numbered SQL file that changes the database one step. Every
database remembers which migrations it has run, so each file runs exactly once
per database.

1. **Create the file:**

   ```powershell
   npx wrangler d1 migrations create codespire-db add-players
   ```

   This creates an empty `migrations/0002_add-players.sql`.

2. **Write the SQL** in it, for example:

   ```sql
   CREATE TABLE players (
     id TEXT PRIMARY KEY,
     name TEXT NOT NULL,
     created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
   );
   ```

3. **Apply it locally and test:**

   ```powershell
   npx wrangler d1 migrations apply codespire-db --local
   ```

4. **Commit and open a pull request.** The Database check applies it to the
   preview database; merging applies it to the live database.

Rules:

- **Never edit a migration that has been merged.** It has already run on the
  live database and will never run again. Fix mistakes with a new migration.
- **Only add, don't break.** The live site may run the old code for a minute
  while the migration runs (and the other way around), so add tables and
  columns instead of renaming or deleting them in the same step.
- **There is one preview database for all pull requests.** A migration in your
  PR changes it for everyone's preview, even before it is merged. Mention
  structure changes in Discord.
- The seed empties and refills `questions` and `answers`. If a new table ever
  points at questions (`REFERENCES questions(id)`), the seed has to change
  first — ask before adding one.

---

## Recipe: add an API route

1. In `server/index.js`, add a check in `fetch` and a function for the route:

   ```js
   if (url.pathname === "/api/towers") {
     return getTowers(env);
   }
   ```

   ```js
   async function getTowers(env) {
     const { results } = await env.codespire_db
       .prepare("SELECT DISTINCT tower FROM questions")
       .all();

     return Response.json(results.map((row) => row.tower));
   }
   ```

2. Add a function in `src/js/api/` that fetches it, and use that from the game.

Rules:

- **Always** put user input in `?` placeholders with `.bind(...)`. Never build
  SQL by gluing strings together — that is how SQL injection happens.
- `.first()` returns one row (or `null`), `.all()` returns `{ results: [...] }`,
  `.run()` is for `INSERT`/`UPDATE`/`DELETE`.
- Return errors as JSON with a status code:
  `Response.json({ error: "..." }, { status: 400 })`.
- Never send anything a player could cheat with (like `is_correct`).

---

## What happens on GitHub

| When                                      | Workflow       | What it does                                       |
| ----------------------------------------- | -------------- | -------------------------------------------------- |
| every pull request                        | **CI**         | Prettier, linters, build                           |
| every pull request                        | **Cloudflare** | builds a preview of the whole site, posts the link |
| PR touches migrations or question data    | **Database**   | migrations + reseed on the **preview** database    |
| merge to `main`                           | **Cloudflare** | deploys the live site                              |
| merge touches migrations or question data | **Database**   | migrations + reseed on the **live** database       |

The Database workflow (`.github/workflows/database.yml`) logs in to Cloudflare
with an API token stored as a GitHub secret. It can only edit D1 databases,
so nobody else needs access to the Cloudflare account.

If the Database check is red, open it (**Details**) and read the last lines of
the failed step. Usually it is an SQL error in a new migration — fix it in a
new commit and push. Ask the owner if it is a login error.

---

## Troubleshooting

**The game shows an error instead of questions on localhost:5173**
The Worker isn't running. Start `npx wrangler dev` in a second terminal. The
Vite terminal shows `http proxy error ... ECONNREFUSED` when this happens.

**`/api/questions` answers `no questions found`**
Your local database is empty or missing that tower/difficulty. Run the
first-time setup above.

**`no such table: questions`**
The local migrations haven't run: `npx wrangler d1 migrations apply codespire-db --local`.

**localhost:8787 shows an old version of the game**
It serves `dist/`. Run `npm run build`, or play on localhost:5173.

**Start completely fresh**
Stop `wrangler dev`, delete the `.wrangler` folder, and run the first-time
setup again.
