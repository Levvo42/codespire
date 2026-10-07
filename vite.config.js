import { defineConfig } from "vite";
import { resolve } from "node:path";

// Vite configuration for the whole project.
// A wider overview of the project (folders, package.json, where assets go)
// lives in docs/project-structure.md.
export default defineConfig({
  build: {
    rollupOptions: {
      // Vite only builds index.html by default. Every extra HTML page must be
      // listed here, otherwise it is silently left out of the production
      // build (dist/). The dev server (`npm run dev`) serves all pages either
      // way — this list only matters for `npm run build`.
      //
      // When you create a new page in pages/, add a line for it here.
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        lobby: resolve(import.meta.dirname, "pages/lobby.html"),
        singleplayer: resolve(import.meta.dirname, "pages/singleplayer.html"),
        tutorial: resolve(import.meta.dirname, "pages/tutorial.html"),
        credits: resolve(import.meta.dirname, "pages/credits.html"),
        createplayer: resolve(import.meta.dirname, "pages/createplayer.html"),
        intro: resolve(import.meta.dirname, "pages/story/intro.html"),
        bugreport: resolve(import.meta.dirname, "pages/story/bug-report.html"),
        prologue: resolve(import.meta.dirname, "pages/story/prologue.html"),
        chapter1: resolve(import.meta.dirname, "pages/story/chapter1.html"),
        chapter2: resolve(import.meta.dirname, "pages/story/chapter2.html"),
        chapter3: resolve(import.meta.dirname, "pages/story/chapter3.html"),
        chapter4: resolve(import.meta.dirname, "pages/story/chapter4.html"),
        chapter5: resolve(import.meta.dirname, "pages/story/chapter5.html"),
      },
    },
  },
});
