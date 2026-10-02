const headerTemplate = `
  <header class="site-header">
    <img
      src="/src/assets/images/codespire-logo.png"
      loading="eager"
      class="site-header__logo"
      alt=".codeSpire"
      width="60"
      height="30"
    />
    <nav class="site-header__nav" id="header-navigation">
      <a href="/index.html">Main Menu</a>
      <a href="/pages/createplayer.html">Play</a>
      <a href="/pages/credits.html">Credits</a>
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
`;

const footerTemplate = `
  <footer class="site-footer">
    <span class="site-footer__info">
      <a href="/pages/credits.html">About</a>
      <a href="/pages/lobby.html">Lobby</a>
      <a href="/pages/singleplayer.html">Bug Report</a>
      <a href="/pages/createplayer.html">Socials</a>
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
