// Entry script for bugreport.html
// #region Imports
import "../main.js";
// #endregion Imports

// #region Bug Report form
const form = document.querySelector(".bugreport__form");

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  alert("Bug report submitted");
  form.reset();
});

// #endregion Bug Report form
