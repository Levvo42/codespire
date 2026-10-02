// Entry script for index.html.
// Wiring only: import from game/, ui/ and api/, then start. No rules here.
// #region Imports
import "../main.js";
// #endregion Imports
// #region constants
const storyIframe = document.getElementById("story-iframe");
const storyButtons = document.querySelectorAll(
  ".index-main__aside-story-button",
);

// #endregion constants
// #region functions
function changePage(page) {
  if (storyIframe) {
    storyIframe.src = page;
  }
}

// #endregion functions
// #region event listeners
storyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const page = button.getAttribute("data-story-page");
    if (page) {
      changePage(page);
    }
  });
});
// #endregion event listeners
