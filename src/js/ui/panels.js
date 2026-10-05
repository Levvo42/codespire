// Side panels: only one open at a time.
export function togglePanel(clicked, toggles) {
  toggles.forEach((toggle) => {
    const panel = document.getElementById(toggle.getAttribute("aria-controls"));
    const isOpen = toggle === clicked && !panel.classList.contains("is-open");

    panel.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", isOpen);
  });
}
