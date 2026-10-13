const rgbCode = document.querySelector("#rgb-code");
const swatches = document.querySelector("#swatches");
const status = document.querySelector("#status");
const newColorsButton = document.querySelector("#new-colors");
const modeButtons = document.querySelectorAll(".mode-button");

let mode = "easy";
let targetColor;
let nextRoundTimer;
let countdownTimer;

function clearRoundTimers() {
	clearTimeout(nextRoundTimer);
	clearInterval(countdownTimer);
}

function randomChannel() {
	return Math.floor(Math.random() * 256);
}

function randomColor() {
	return [randomChannel(), randomChannel(), randomChannel()];
}

function colorToString(color) {
	return `rgb(${color.join(", ")})`;
}

function sameColor(first, second) {
	return first.every((channel, index) => channel === second[index]);
}

function renderGame() {
	clearRoundTimers();
	const optionCount = mode === "easy" ? 3 : 6;
	const options = Array.from({ length: optionCount }, randomColor);
	const correctIndex = Math.floor(Math.random() * optionCount);
	targetColor = options[correctIndex];

	rgbCode.textContent = `RGB(${targetColor.join(", ")})`;
	status.textContent = "Elegí una muestra para comenzar";
	swatches.innerHTML = "";

	options.forEach((color, index) => {
		const swatch = document.createElement("button");
		swatch.className = "swatch";
		swatch.type = "button";
		swatch.style.backgroundColor = colorToString(color);
		swatch.setAttribute("aria-label", `Opción de color ${index + 1}`);
		swatch.addEventListener("click", () => handleGuess(swatch, color));
		swatches.appendChild(swatch);
	});
}

function handleGuess(swatch, color) {
	if (sameColor(color, targetColor)) {
		swatch.classList.add("is-correct");
		let secondsRemaining = 5;
		status.textContent = `¡Correcto! Nueva ronda en ${secondsRemaining} segundos...`;
		document.querySelectorAll(".swatch").forEach((option) => {
			option.disabled = true;
			option.style.backgroundColor = colorToString(targetColor);
		});

		countdownTimer = setInterval(() => {
			secondsRemaining -= 1;
			if (secondsRemaining > 0) {
				status.textContent = `¡Correcto! Nueva ronda en ${secondsRemaining} segundos...`;
			}
		}, 1000);
		nextRoundTimer = setTimeout(renderGame, 5000);
		return;
	}

	swatch.classList.add("is-wrong");
	status.textContent = "No es ese. Seguí probando...";
}

modeButtons.forEach((button) => {
	button.addEventListener("click", () => {
		mode = button.dataset.mode;
		modeButtons.forEach((option) => {
			const isActive = option === button;
			option.classList.toggle("is-active", isActive);
			option.setAttribute("aria-pressed", String(isActive));
		});
		renderGame();
	});
});

newColorsButton.addEventListener("click", renderGame);
renderGame();
