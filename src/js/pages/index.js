// Entry script for index.html.
// Wiring only: import from game/, ui/ and api/, then start. No rules here.
// #region Imports
import "../main.js";
// #endregion Imports
// #region const/vars
const storyIframe = document.getElementById("story-iframe");
const storyButtons = document.querySelectorAll(
  ".index-main__aside-story-button[data-story-page]",
);
const upButton = document.getElementById("chapter-up");
const downButton = document.getElementById("chapter-down");

let firstVisible = 0;

// #endregion const/vars
//  #region Active story and iframe
function updateCurrentStoryButton(page) {
  const currentPage = new URL(page, document.baseURI).pathname;

  storyButtons.forEach((button) => {
    const buttonPage = new URL(
      button.getAttribute("data-story-page"),
      document.baseURI,
    ).pathname;
    const isCurrent = buttonPage === currentPage;
    button.classList.toggle("is-current", isCurrent);
    button.setAttribute("aria-pressed", String(isCurrent));
  });
}

// Finds which chapter button matches the story currently loaded in the iframe.
function getCurrentStoryIndex() {
  if (!storyIframe) {
    return -1;
  }

  return Array.from(storyButtons).findIndex((button) => {
    const page = new URL(
      button.getAttribute("data-story-page"),
      document.baseURI,
    ).pathname;
    return page === new URL(storyIframe.src, document.baseURI).pathname;
  });
}

// Loads a story in the iframe and immediately updates its active chapter marker.
function changePage(page) {
  if (storyIframe) {
    storyIframe.src = page;
    updateCurrentStoryButton(page);
  }
}

// #endregion Active story and iframe
// #region Chapter list navigation
// Applies the three-button mobile window and disables arrows at either end.
function updateChapters() {
  const activeIndex = getCurrentStoryIndex();

  if (activeIndex >= 0) {
    // Center the active chapter in the banner
    firstVisible = Math.max(
      0,
      Math.min(activeIndex - 1, storyButtons.length - 3),
    );
  }

  storyButtons.forEach((chapter, index) => {
    chapter.classList.toggle(
      "is-outside-window",
      index < firstVisible || index >= firstVisible + 3,
    );
  });

  if (upButton && downButton) {
    upButton.disabled = activeIndex <= 0;
    downButton.disabled =
      activeIndex < 0 || activeIndex >= storyButtons.length - 1;
  }
}

// Moves to an adjacent story and shifts the visible window when needed.
function navigateStory(direction) {
  const currentIndex = getCurrentStoryIndex();
  const nextIndex = currentIndex + direction;

  if (currentIndex < 0 || nextIndex < 0 || nextIndex >= storyButtons.length) {
    return;
  }

  const nextButton = storyButtons[nextIndex];
  const page = nextButton.getAttribute("data-story-page");

  if (!page) {
    return;
  }

  changePage(page);
  updateChapters();
}

// #endregion Chapter list navigation
// #region Event listeners and initial state
// Arrow clicks navigate to the previous or next story.
if (upButton) {
  upButton.addEventListener("click", () => {
    navigateStory(-1);
  });
}

if (downButton) {
  downButton.addEventListener("click", () => {
    navigateStory(1);
  });
}

// Keep the chapter marker and arrow states in sync with iframe navigation.
if (storyIframe) {
  updateCurrentStoryButton(storyIframe.src);
  storyIframe.addEventListener("load", () => {
    updateCurrentStoryButton(storyIframe.src);
    updateChapters();
  });
}

updateChapters();

// Chapter clicks load the selected story in the iframe.
storyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const page = button.getAttribute("data-story-page");
    if (page) {
      changePage(page);
      updateChapters();
    }
  });
});
// #endregion Event listeners and initial state
