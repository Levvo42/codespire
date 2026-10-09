# Daily Git Operations

How we use git from the terminal — the everyday flow first, then the
occasional operations you'll need now and then. Installing git and cloning
the repo is covered in [setup.md](setup.md).

**Our workflow in one picture:**

```text
main ──●──────────●──────────●──   ← always working, never commit here directly
        \        /  \        /
         ●──●──●     ●──●──●       ← your branch: branch off, commit, open a
         (pull request)              pull request, merge back
```

Merges into `main` happen via pull requests, in our two daily merge windows
(after lunch and end of day). Always announce merges and conflicts in Discord.

---

## Every day: starting

Get the latest version of `main` before you do anything else:

```powershell
git switch main
git pull
```

If `package.json` / `package-lock.json` changed, also run `npm ci`.

If `migrations/` or the question JSON in `src/js/data/` changed, update your
local database:

```powershell
npx wrangler d1 migrations apply codespire-db --local
node scripts/seed-questions.js
npx wrangler d1 execute codespire-db --local --file=seed.sql
```

---

## Every day: starting a task

Create a branch for the task. Never work directly on `main`.

```powershell
git switch -c 12-lobby-layout
```

- `switch -c` = create the branch and move to it.
- Naming: `<issue-number>-<short-description>`, e.g. `12-lobby-layout`.

If you instead used GitHub's **"Create a branch"** button on an issue, the
branch already exists on GitHub — fetch it and switch to it:

```powershell
git fetch origin
git switch 12-lobby-layout
```

---

## Every day: while working

See what you have changed:

```powershell
git status          # which files are changed/staged
git diff            # exactly what changed, line by line
```

Stage and commit:

```powershell
git add src/js/game/battle.js    # stage one file
git add -A                       # or stage everything
git commit -m "feat: add damage calculation to battle"
```

Commit **small and often** — one logical change per commit. A commit is a
save point you can always go back to.

### Commit messages — Conventional Commits

We agreed on [Conventional Commits](https://www.conventionalcommits.org/):
`type: short description in imperative mood`, all lowercase.

| Type       | Use for                                  | Example                                        |
| ---------- | ---------------------------------------- | ---------------------------------------------- |
| `feat`     | New feature                              | `feat: add answer buttons to battle screen`    |
| `fix`      | Bug fix                                  | `fix: prevent double answer submission`        |
| `docs`     | Documentation only                       | `docs: add git tutorial`                       |
| `style`    | Formatting, no logic change              | `style: fix indentation in lobby.scss`         |
| `refactor` | Rewriting code without changing behavior | `refactor: extract fetch logic to api/quiz.js` |
| `chore`    | Config, dependencies, tooling            | `chore: add prettier`                          |

---

## Every day: sharing your work

Before pushing, run the same checks GitHub will run:

```powershell
npm run check
```

Fix any errors first — see [code-quality.md](code-quality.md).

First push of a new branch (`-u` links it to GitHub so later pushes are just `git push`):

```powershell
git push -u origin 12-lobby-layout
```

After that, simply:

```powershell
git push
```

Then on GitHub: open a **pull request** from your branch into `main`, ask for
a review in Discord, and merge it during a merge window. Delete the branch on
GitHub when the PR is merged (button in the PR).

GitHub only allows the merge when the **CI check is green** and **one other
team member has approved** the PR. How to review is described in
[code-quality.md](code-quality.md#reviewing-a-teammates-pr).

### What runs on your pull request

| Check          | What it does                                                                                |
| -------------- | ------------------------------------------------------------------------------------------- |
| **CI**         | Prettier, linters and the build — the same as `npm run check` plus `npm run build`.         |
| **Cloudflare** | Builds a preview of the whole site and comments a **Deployment URL** on the PR. Test there. |
| **Database**   | Only when the PR changes `migrations/` or `src/js/data/`: updates the preview database.     |

Merging into `main` deploys the live site, and if the PR changed migrations or
questions, the Database workflow updates the live database too. Nobody needs a
Cloudflare login for any of this. Details in [backend.md](backend.md).

---

## Every day: after your PR is merged

```powershell
git switch main
git pull
git branch -d 12-lobby-layout    # delete your local copy of the branch
```

Then create a new branch for the next task.

---

## Keeping your branch up to date

If your branch lives longer than a day, pull `main` into it regularly so the
final merge stays small:

```powershell
git switch main
git pull
git switch 12-lobby-layout
git merge main
```

(`git rebase main` is an alternative that gives a straighter history, but
**never rebase a branch you have already pushed and someone else might use** —
when unsure, merge.)

---

## Merge conflicts

A conflict happens when two branches changed the same lines. Git stops and
marks the file like this:

```text
<<<<<<< HEAD
  const maxHp = 100;
=======
  const maxHp = 120;
>>>>>>> main
```

To resolve:

1. Tip: back up your version of the file first (copy it somewhere or `git stash` on a side branch) so nothing is lost while experimenting.
2. Open each conflicted file (`git status` lists them).
3. Decide together with the other author — keep one version or combine both.
4. Delete the `<<<<<<<`, `=======`, `>>>>>>>` marker lines.
5. Test that the project still runs: `npm run dev`.
6. `git add <file>` and `git commit` to finish the merge.

Panic button — abort and go back to how it was before the merge:

```powershell
git merge --abort
```

Always mention conflicts in Discord so both authors know how they were resolved.

---

## Occasional operations

Things you don't do daily but will need eventually. ⚠ = destroys work, be sure first.

### Looking around

```powershell
git log --oneline --graph --all -15   # recent history for all branches
git diff main                         # everything your branch changes vs main
git blame src/js/main.js              # who last changed each line
git branch -a                         # list local + remote branches
git fetch --prune                     # refresh remote branch list, drop deleted ones
```

### Undoing — before commit

```powershell
git restore --staged file.js   # unstage (keeps your edits)
git restore file.js            # ⚠ throw away uncommitted edits to a file
git restore .                  # ⚠⚠ throw away ALL uncommitted edits
git stash                      # park uncommitted work (e.g. to switch branch)
git stash pop                  # take parked work back out
```

### Undoing — after commit, before push

```powershell
git commit --amend -m "fix: better message"   # fix the last commit message
git add forgotten.js
git commit --amend --no-edit                  # add a forgotten file to the last commit
git reset --soft HEAD~1                       # undo last commit, keep the changes staged
```

Never amend/reset a commit that is already pushed — use `revert` instead:

### Undoing — after push

```powershell
git log --oneline        # find the bad commit's hash
git revert <hash>        # makes a NEW commit that undoes it — safe on shared branches
```

### Common mistakes and their fixes

**"I committed on `main` by mistake"** (and haven't pushed):

```powershell
git switch -c rescue-branch        # your commits are now safe on a branch
git switch main
git reset --hard origin/main       # ⚠ main back to how GitHub has it
git switch rescue-branch           # continue working here, open a PR as usual
```

**"I committed a file that should be ignored"** (e.g. build output):

```powershell
# 1. add it to .gitignore, then:
git rm --cached path/to/file
git commit -m "chore: stop tracking file"
```

**"I named my branch wrong"**:

```powershell
git branch -m 12-better-name
```

**"I think I lost a commit"** — you almost never have. `git reflog` shows
everything HEAD pointed at recently; find the hash and `git switch -c rescue <hash>`.
Ask in Discord before doing anything drastic.

---

## Golden rules

1. Never commit directly to `main` — always a branch + pull request (GitHub blocks direct pushes).
2. Never `git push --force` a shared branch.
3. Pull before you start, push before you stop for the day.
4. Small commits with Conventional Commit messages.
5. `.env` and other secrets never get committed (they're gitignored — don't fight it).
6. Unsure about a ⚠ command? Ask in Discord _first_. Everything not yet
   committed is the only thing git can't get back.
7. Run `npm run check` before every push.
