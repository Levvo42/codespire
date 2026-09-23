# Project Setup

This guide explains how to prepare your computer, install the project dependencies, and run the project locally.

---

## Requirements

You need:

- Git
- Node.js 24 LTS
- npm
- VS Code or another code editor

Vite and other project dependencies are installed **inside the project** and should not be installed globally.

---

# 1. Check Your Installed Versions

Open PowerShell or another terminal and run:

```powershell
git --version
node -v
npm -v
```

For this project, Node.js should use version:

```text
v24.x.x
```

npm is included with Node.js.

---

# 2. Install or Update Git

## Windows — Terminal

Check whether Git is installed:

```powershell
git --version
```

Install Git:

```powershell
winget install --id Git.Git -e
```

Update Git:

```powershell
winget upgrade --id Git.Git -e
```

Close and reopen the terminal after installation.

Then verify:

```powershell
git --version
```

## Manual Installation

Git can also be downloaded from:

https://git-scm.com/

---

# 3. Install or Update Node.js

## Windows — Terminal

Check your current Node.js version:

```powershell
node -v
```

Check whether Node.js LTS is installed through Winget:

```powershell
winget list OpenJS.NodeJS.LTS
```

### Install Node.js LTS

```powershell
winget install OpenJS.NodeJS.LTS
```

### Update Node.js LTS

```powershell
winget upgrade OpenJS.NodeJS.LTS
```

After installation or updating:

1. Close the terminal.
2. Open it again.
3. Verify the versions:

```powershell
node -v
npm -v
```

Node should report:

```text
v24.x.x
```

---

## Manual Installation

Alternatively, install the latest Node.js 24 LTS version from:

https://nodejs.org/

Restart the terminal afterwards and verify:

```powershell
node -v
npm -v
```

---

# 4. Update npm

Updating Node.js normally also installs an appropriate npm version.

Check your npm version:

```powershell
npm -v
```

If npm specifically needs updating:

```powershell
npm install -g npm@latest
```

Then verify:

```powershell
npm -v
```

---

# 5. Clone the Project

Move to the folder where you want the repository:

```powershell
cd C:\path\to\projects
```

Clone the repository:

```powershell
git clone <repository-url>
```

Enter the project:

```powershell
cd <project-folder>
```

Example:

```powershell
cd sys26d-sys26d-html-css-js-grupparbete-group-8
```

---

# 6. Install Project Dependencies

If the repository already contains:

```text
package.json
package-lock.json
```

install the project using:

```powershell
npm ci
```

`npm ci` installs the dependency versions defined by the project.

Normally, this is the command team members should use after cloning or pulling dependency changes.

You do **not** need to install Vite separately after this.

## Set Up Environment Variables

The quiz API key lives in a local `.env` file that is **not** committed to git, so every team member creates their own. Copy the committed template:

```powershell
Copy-Item .env.example .env
```

Then open `.env` and paste in the real key — ask for it in Discord (never post keys in the repo). See `docs/project-structure.md` for how `.env` variables work.

---

## Set Up the Editor

Install the recommended VS Code extensions (Prettier, ESLint, Stylelint, html-validate). VS Code offers them in a popup when you open the project folder. Details and a quick test are in [code-quality.md](code-quality.md#one-time-setup).

---

# 7. Initial Project Setup

> Only needed when initially creating/configuring the project.

If no valid `package.json` exists:

```powershell
npm init -y
```

Install Vite:

```powershell
npm install -D vite
```

Install Sass for SCSS support:

```powershell
npm install -D sass
```

Vite and Sass are development dependencies and will be added to:

```text
package.json
package-lock.json
```

Do not install Vite globally.

---

# 8. Vite Scripts

Make sure `package.json` contains these scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

The project also has formatting and linting scripts (`format`, `lint`, `check` and more). They are explained in [code-quality.md](code-quality.md).

---

# 9. Check Vite

Check the Vite version installed in the project:

```powershell
npx vite --version
```

Or:

```powershell
npm list vite
```

---

# 10. Run the Project Locally

Start the Vite development server:

```powershell
npm run dev
```

Vite will show a local address, usually:

```text
http://localhost:5173/
```

Open that address in your browser.

---

# 11. Stop the Development Server

In the terminal running Vite, press:

```text
Ctrl + C
```

---

# 12. Build the Project

Create a production build:

```powershell
npm run build
```

Vite will create:

```text
dist/
```

The `dist` folder contains the production version of the website.

---

# 13. Test the Production Build

Run:

```powershell
npm run preview
```

Vite will display another local address.

Open it in your browser to test the production build.

---

# 14. After Pulling Changes

When another developer has added or updated dependencies:

```powershell
git pull
npm ci
```

Then start the project:

```powershell
npm run dev
```

Running `npm ci` ensures your local dependencies match the committed `package-lock.json`.

---

# 15. Installing a New Dependency

If the project needs a new package:

```powershell
npm install <package-name>
```

For development-only tools:

```powershell
npm install -D <package-name>
```

Example:

```powershell
npm install -D sass
```

This updates:

```text
package.json
package-lock.json
```

Both files should be committed.

---

# 16. Important Files

Commit these:

```text
package.json
package-lock.json
```

Do not commit these:

```text
node_modules/
dist/
.env
```

(`.env.example` — the key-less template — **is** committed.)

The project's `.gitignore` is already set up to handle all of this; the file itself has a comment explaining each rule.

---

# 17. Common Commands

## Check versions

```powershell
git --version
node -v
npm -v
npx vite --version
```

## Install dependencies

```powershell
npm ci
```

## Start development server

```powershell
npm run dev
```

## Build production version

```powershell
npm run build
```

## Preview production version

```powershell
npm run preview
```

## Check formatting and linting (run before every push)

```powershell
npm run check
```

## Check installed dependencies

```powershell
npm list
```

## Check for outdated dependencies

```powershell
npm outdated
```

---

# Troubleshooting

## `node` is not recognized

Node.js is either not installed or the terminal has not been restarted.

Install Node.js:

```powershell
winget install OpenJS.NodeJS.LTS
```

Then close and reopen the terminal.

---

## `npm` is not recognized

npm is installed together with Node.js.

Check Node:

```powershell
node -v
```

If Node does not work, reinstall/update Node.js.

---

## `npm init -y` gives `EJSONPARSE`

Example:

```text
npm error JSON.parse Invalid package.json
npm error JSON.parse Unexpected end of JSON input
```

This usually means a `package.json` already exists but is empty or contains invalid JSON.

Check the file:

```powershell
Get-Content .\package.json
```

If the file is completely empty and contains nothing important, remove it:

```powershell
Remove-Item .\package.json
```

Then create it again:

```powershell
npm init -y
```

Do not delete an existing `package.json` containing project dependencies without checking it first.

---

## Dependencies seem broken

Remove the installed dependencies:

```powershell
Remove-Item -Recurse -Force .\node_modules
```

Then reinstall from the lock file:

```powershell
npm ci
```

---

## Vite does not start

First make sure dependencies are installed:

```powershell
npm ci
```

Then:

```powershell
npm run dev
```

Check the installed Vite version if necessary:

```powershell
npx vite --version
```

---

# Normal Daily Workflow

After the project has been set up, you normally only need:

```powershell
git pull
npm ci
npm run dev
```

If `package.json` and `package-lock.json` have not changed, running `npm ci` every single time is not required.

The usual workflow then becomes:

```powershell
git pull
npm run dev
```

For everything else git — branches, commits, pull requests, and fixing mistakes — see [daily-git-operations.md](daily-git-operations.md).
