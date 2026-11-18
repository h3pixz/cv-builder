export const THEME_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var isDark = stored === "dark" || (stored !== "light" && prefersDark);
    document.documentElement.classList.toggle("dark", isDark);
  } catch (error) {}
})();
`;
