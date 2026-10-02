// Entry script for pages/createplayer.html.
// Wiring only: import from game/, ui/ and api/, then start. No rules here.
import "../main.js";

// Avatar name and classes
const avatars = [
  { image: "/src/assets/images/av1.png", class: "Warrior" },
  { image: "/src/assets/images/av2.png", class: "Mage" },
  { image: "/src/assets/images/av3.png", class: "Rogue" },
];
let currentAvatar = 0;

// UI for avatar/form selection
const avatarImage = document.querySelector(
  ".site-createplayer-container__image",
);
const classText = document.querySelector(".character-class");
function updateAvatar() {
  avatarImage.src = avatars[currentAvatar].image;
  classText.textContent = `Class: ${avatars[currentAvatar].class}`;
}
// Save selected avatar on form submit
const form = document.querySelector(".site-createplayer-container__form");
form.addEventListener("submit", () => {
  localStorage.setItem("selectedAvatar", avatars[currentAvatar]);
});
// Loop avatars
const nextButton = document.querySelector("[aria-label = 'Next avatar']");
nextButton.addEventListener("click", () => {
  currentAvatar++;
  if (currentAvatar > 2) {
    currentAvatar = 0;
  }
  updateAvatar();
});
// Start playing with selected avatar
const playButton = document.querySelector(
  ".site-createplayer-container__play-btn",
);
playButton.addEventListener("click", () => {
  localStorage.setItem("selectedAvatar", avatars[currentAvatar]);
  // Next: singleplayer
  window.location.href = "./singleplayer.html";
});
