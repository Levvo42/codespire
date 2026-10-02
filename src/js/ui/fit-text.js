// Shrinks text that is too long for its box, so boxes keep one size
// and long questions/answers still fit (just a little smaller).

const FONT_STEP_REM = 0.05;

/**
 * Makes an element's font smaller, step by step, until its text fits in
 * maxLines lines, but never smaller than minRem. Starts from the CSS size,
 * so short text is never shrunk.
 *
 * @param {HTMLElement} element - The element whose text should fit.
 * @param {number} maxLines - How many lines the text may use.
 * @param {number} minRem - The smallest font size allowed, in rem.
 */
export function fitText(element, maxLines, minRem) {
  element.style.fontSize = ""; // back to the size from the CSS

  const rootSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize,
  );
  let sizeRem = parseFloat(getComputedStyle(element).fontSize) / rootSize;

  while (countLines(element) > maxLines && sizeRem > minRem) {
    sizeRem = Math.max(sizeRem - FONT_STEP_REM, minRem);
    element.style.fontSize = `${sizeRem}rem`;
  }
}

// How many lines of text the element shows (its height without padding ÷ line height)
function countLines(element) {
  const style = getComputedStyle(element);
  const textHeight =
    element.clientHeight -
    parseFloat(style.paddingTop) -
    parseFloat(style.paddingBottom);

  return Math.round(textHeight / parseFloat(style.lineHeight));
}
