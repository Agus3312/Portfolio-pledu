const root = document.documentElement;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const revealItems = document.querySelectorAll(".reveal");
const currentYear = document.querySelector("#current-year");

const darkPalette = { background: [17, 17, 17], line: [65, 65, 65] };
const lightPalette = { background: [238, 238, 238], line: [193, 193, 190] };
const lightText = [245, 245, 242];
const darkText = [0, 0, 0];
const mutedTextOptions = [[173, 173, 169], [91, 91, 91]];

function interpolateColor(start, end, progress) {
  const channels = start.map((channel, index) => Math.round(channel + (end[index] - channel) * progress));
  return `rgb(${channels.join(", ")})`;
}

function relativeLuminance([red, green, blue]) {
  const linearize = (channel) => {
    const normalized = channel / 255;
    return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linearize(red) + 0.7152 * linearize(green) + 0.0722 * linearize(blue);
}

function contrastRatio(first, second) {
  const luminances = [relativeLuminance(first), relativeLuminance(second)].sort((a, b) => b - a);
  return (luminances[0] + 0.05) / (luminances[1] + 0.05);
}

function rgbColor(channels) {
  return `rgb(${channels.join(", ")})`;
}

function updatePalette() {
  const travel = Math.max(window.innerHeight * 0.9, 1);
  const progress = Math.min(window.scrollY / travel, 1);
  const background = darkPalette.background.map((channel, index) => Math.round(channel + (lightPalette.background[index] - channel) * progress));
  const ink = contrastRatio(background, lightText) > contrastRatio(background, darkText) ? lightText : darkText;
  const muted = mutedTextOptions.find((candidate) => contrastRatio(background, candidate) >= 4.5) ?? ink;

  root.style.setProperty("--page-bg", rgbColor(background));
  root.style.setProperty("--page-ink", rgbColor(ink));
  root.style.setProperty("--page-muted", rgbColor(muted));
  root.style.setProperty("--page-line", interpolateColor(darkPalette.line, lightPalette.line, progress));
}

let paletteFrame = 0;
window.addEventListener("scroll", () => {
  if (paletteFrame) return;
  paletteFrame = window.requestAnimationFrame(() => {
    updatePalette();
    paletteFrame = 0;
  });
}, { passive: true });
window.addEventListener("resize", updatePalette, { passive: true });
updatePalette();

if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

currentYear.textContent = String(new Date().getFullYear());