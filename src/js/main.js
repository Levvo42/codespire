// Shared setup for every page. Each entry script in pages/ imports this first.
//
// The stylesheet is imported here, not in each page script, so that no page
// can forget it. Vite compiles the SCSS it finds through JS imports.

import "../scss/style.scss";
import { templateHeaderFooter } from "./components/headerFooter.js";
import { initSettings } from "./ui/settings.js";

templateHeaderFooter();
initSettings();

// ========================================
// #region Variables
const menuButton = document.querySelector(".site-header__menu-button");
const navigation = document.querySelector(".site-header__nav");
const menuText = menuButton?.querySelector("span");
const desktopBreakpoint = getComputedStyle(document.documentElement) // tells java to extract from document
  .getPropertyValue("--breakpoint-desktop"); // variable to extract
const desktopMedia = window.matchMedia(`(min-width: ${desktopBreakpoint})`);
// #endregion Variables
// ========================================
// #region Event listeners
if (menuButton && navigation) {
  menuButton.addEventListener("click", toggleNavMenu); // decides if the mobile nav menu is open
  document.addEventListener("click", closeMenuOnOutsideClick); // closes menu if you click outside the box
  desktopMedia.addEventListener("change", closeMenuOnDesktop); // closes auto if you resize to big window
}
// #endregion Event listeners
// ========================================
// #region Functions

// open / close mobile nav menu
function toggleNavMenu() {
  const isOpen = navigation.classList.toggle("is-open");

  menuButton.setAttribute("aria-expanded", isOpen);

  if (isOpen) {
    menuText.textContent = "Close";
  } else {
    menuText.textContent = "Menu";
  }
}

// autoclose menu on resizing to desktop sized window
function closeMenuOnDesktop(event) {
  if (event.matches) {
    closeNavMenu();
  }
}

// closes menu if you click outside the menu
function closeMenuOnOutsideClick(event) {
  if (
    navigation.classList.contains("is-open") &&
    !navigation.contains(event.target) &&
    !menuButton.contains(event.target)
  ) {
    closeNavMenu();
  }
}

// closetrigger for menu
function closeNavMenu() {
  navigation.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuText.textContent = "Menu";
}
// #endregion Functions
// ========================================
