// Shared setup for every page. Each entry script in pages/ imports this first.
//
// The stylesheet is imported here, not in each page script, so that no page
// can forget it. Vite compiles the SCSS it finds through JS imports.
import "../scss/style.scss";

// ========================================
// #region Variables
const menuButton = document.querySelector(".site-header__menu-button");
const navigation = document.querySelector(".site-header__nav");
const menuText = menuButton.querySelector("span");
const desktopMedia = window.matchMedia("(min-width: 64rem)");
// #endregion Variables
// ========================================
// #region Event listeners
menuButton.addEventListener("click", toggleNavMenu);
desktopMedia.addEventListener("change", closeMenuOnDesktop);
// #endregion Event listeners
// ========================================
// #region Functions
function toggleNavMenu() {
  const isOpen = navigation.classList.toggle("is-open");

  menuButton.setAttribute("aria-expanded", isOpen);

  if (isOpen) {
    menuText.textContent = "Close";
  } else {
    menuText.textContent = "Menu";
  }
}

function closeMenuOnDesktop(event) {
  if (event.matches) {
    navigation.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuText.textContent = "Menu";
  }
}
// #endregion Functions
// ========================================
