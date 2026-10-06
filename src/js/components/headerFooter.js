import logo from "../../assets/images/codespire-logo.webp";
const headerTemplate = `
  <header class="site-header">
    <a href="/index.html" class="site-header__logo-link"><img
      src="${logo}"
      loading="eager"
      class="site-header__logo"
      alt=".codeSpire"
      width="448"
      height="113"
    /></a>
    <nav class="site-header__nav" id="header-navigation">
      <a href="/index.html">Main Menu</a>
      <a href="/pages/lobby.html">Play</a>
      <a href="/pages/credits.html">Credits</a>
      <button
        class="site-header__settings-button"
        type="button"
        data-js="settings-open"
      >
        Settings
      </button>
    </nav>
    <button
      class="site-header__menu-button"
      type="button"
      aria-expanded="false"
      aria-controls="header-navigation"
    >
      <span>Menu</span>
    </button>
  </header>
  <dialog class="site-settings" id="settings-dialog" aria-labelledby="settings-title">
    <h2 class="site-settings__title" id="settings-title">Settings</h2>
    <label class="site-settings__label" for="settings-volume">
      Music volume <span id="settings-volume-value"></span>
    </label>
    <input class="site-settings__volume" id="settings-volume" type="range" min="0" max="100" step="5" />
    <div class="site-settings__actions">
      <button class="site-settings__button" id="settings-new" type="button">New game</button>
      <button class="site-settings__button" id="settings-save" type="button">Save game</button>
      <button class="site-settings__button" id="settings-load" type="button">Load game</button>
      <input id="settings-file" type="file" accept=".txt,.json,text/plain,application/json" hidden />
    </div>
    <p class="site-settings__message" id="settings-message" role="status"></p>
    <button class="site-settings__button" id="settings-close" type="button">Close</button>
  </dialog>
`;

const footerTemplate = `
  <footer class="site-footer">
    <span class="site-footer__info">
      <a href="/pages/credits.html">About</a>
      <a href="/pages/lobby.html">Lobby</a>
      <a href="/index.html">Bug Report</a>
      <a href="/index.html">Socials</a>
    </span>
  </footer>
`;

export function templateHeaderFooter() {
  const headerPlaceholder = document.querySelector("[data-site-header]");
  const footerPlaceholder = document.querySelector("[data-site-footer]");

  if (headerPlaceholder) {
    headerPlaceholder.outerHTML = headerTemplate;
  }

  if (footerPlaceholder) {
    footerPlaceholder.outerHTML = footerTemplate;
  }
}
