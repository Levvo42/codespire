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
function updateCurrentStoryButton(page) {
  const currentPage = new URL(page, document.baseURI).pathname;

  storyButtons.forEach((button) => {
    const isCurrent = button.getAttribute("data-story-page") === currentPage;
    button.classList.toggle("is-current", isCurrent);
    button.setAttribute("aria-pressed", String(isCurrent));
  });
}

function changePage(page) {
  if (storyIframe) {
    storyIframe.src = page;
    updateCurrentStoryButton(page);
  }
}

// #endregion functions
// #region event listeners
if (storyIframe) {
  updateCurrentStoryButton(storyIframe.src);
  storyIframe.addEventListener("load", () => {
    updateCurrentStoryButton(storyIframe.src);
  });
}

storyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const page = button.getAttribute("data-story-page");
    if (page) {
      changePage(page);
    }
  });
});
// #endregion event listeners
