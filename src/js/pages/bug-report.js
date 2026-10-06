// Entry script for bug-report.html
// #region Imports
import "../main.js";
// #endregion Imports

// #region Bug Report form
const form = document.querySelector(".bug-report__form");

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  alert("Bug report submitted");
  form.reset();
});

// #endregion Bug Report form
