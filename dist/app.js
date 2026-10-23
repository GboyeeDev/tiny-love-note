const intro = document.querySelector("#intro");
const scene = document.querySelector("#question-scene");
const celebration = document.querySelector("#celebration");
const openButton = document.querySelector("#open-letter");
const yesButton = document.querySelector("#yes-button");
const noButton = document.querySelector("#no-button");
const arena = document.querySelector("#button-arena");
const teaseText = document.querySelector("#tease-text");
const resistanceFill = document.querySelector("#resistance-fill");
const resistanceValue = document.querySelector("#resistance-value");
const liveRegion = document.querySelector("#live-region");
const replayButton = document.querySelector("#replay-button");
const motionToggle = document.querySelector("#motion-toggle");
const dialog = document.querySelector("#customize-dialog");
const customizeForm = document.querySelector("#customize-form");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const replies = [
  "Hmm… that button seems a little shy.",
  "Nice try. It has trust issues.",
  "Plot twist: your cursor is on my side.",
  "The ‘Yes’ button is looking extra cute now.",
  "Okay, okay… the button has reconsidered.",
];

let attempts = 0;
let lastSpark = 0;
let motionOff = reducedMotion.matches;

function showSection(from, to) {
  from.hidden = true;
  to.hidden = false;
  to.classList.remove("scene-in");
  void to.offsetWidth;
  to.classList.add("scene-in");
}

function setMotionState(off) {
  motionOff = off;
  document.body.classList.toggle("motion-off", off);
  motionToggle.setAttribute("aria-pressed", String(off));
  motionToggle.innerHTML = off
    ? '<span aria-hidden="true">◇</span> motion off'
    : '<span aria-hidden="true">✦</span> motion on';
}

function resetButtons() {
  attempts = 0;
  teaseText.textContent = "Choose wisely. My heart is watching.";
  resistanceFill.style.width = "0%";
  resistanceValue.textContent = "0%";
  yesButton.style.setProperty("--yes-scale", "1");
  noButton.classList.remove("is-caught");
  noButton.textContent = "No";
  noButton.style.left = "";
  noButton.style.top = "";
}

function moveNoButton(event) {
  if (motionOff || event.pointerType === "touch") return;
  event.preventDefault();
  attempts += 1;

  const maxX = Math.max(0, arena.clientWidth - noButton.offsetWidth);
  const maxY = Math.max(0, arena.clientHeight - noButton.offsetHeight);
  const nextX = Math.random() * maxX;
  const nextY = Math.random() * maxY;

  noButton.style.left = `${nextX}px`;
  noButton.style.top = `${nextY}px`;
  updateTease();
}

function updateTease() {
  const index = Math.min(attempts - 1, replies.length - 1);
  const percent = Math.min(attempts * 20, 100);
  teaseText.textContent = replies[Math.max(0, index)];
  liveRegion.textContent = replies[Math.max(0, index)];
  resistanceFill.style.width = `${percent}%`;
  resistanceValue.textContent = `${percent}%`;
  yesButton.style.setProperty("--yes-scale", String(Math.min(1 + attempts * 0.08, 1.4)));

  if (attempts >= replies.length) {
    noButton.classList.add("is-caught");
    noButton.textContent = "Okay… yes ♥";
    noButton.removeEventListener("pointerenter", moveNoButton);
  }
}

function handleNoClick() {
  attempts += 1;
  updateTease();
  if (attempts >= replies.length) celebrate();
}

function celebrate() {
  showSection(scene, celebration);
  if (!motionOff) launchConfetti();
  celebration.querySelector("h2").focus?.();
}

function launchConfetti() {
  const colors = ["#f06c66", "#f7c6c2", "#e7ad62", "#8eaf8c", "#ffffff"];
  for (let i = 0; i < 90; i += 1) {
    const piece = document.createElement("i");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[i % colors.length];
    piece.style.setProperty("--speed", `${2.5 + Math.random() * 2.5}s`);
    piece.style.setProperty("--angle", `${Math.random() * 180}deg`);
    piece.style.animationDelay = `${Math.random() * 0.8}s`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 5600);
  }
}

function loadPersonalization() {
  const saved = JSON.parse(localStorage.getItem("tiny-love-note") || "{}");
  const params = new URLSearchParams(location.search);
  const data = {
    name: params.get("name") || saved.name || "",
    question: params.get("question") || saved.question || "Do you love me?",
    message: params.get("message") || saved.message || "You just made me the happiest person alive.",
  };
  document.querySelector("#recipient-line").textContent = data.name
    ? `DEAR ${data.name.toUpperCase()},`
    : "DEAR MY FAVORITE PERSON,";
  document.querySelector("#question-title").textContent = data.question;
  document.querySelector("#celebration-copy").textContent = data.message;
  document.querySelector("#name-input").value = data.name;
  document.querySelector("#question-input").value = data.question;
  document.querySelector("#message-input").value = data.message;
}

openButton.addEventListener("click", () => showSection(intro, scene));
yesButton.addEventListener("click", celebrate);
noButton.addEventListener("pointerenter", moveNoButton);
noButton.addEventListener("click", handleNoClick);

replayButton.addEventListener("click", () => {
  document.querySelectorAll(".confetti").forEach((piece) => piece.remove());
  resetButtons();
  noButton.addEventListener("pointerenter", moveNoButton);
  showSection(celebration, intro);
});

motionToggle.addEventListener("click", () => setMotionState(!motionOff));
document.querySelector("#edit-button").addEventListener("click", () => dialog.showModal());

customizeForm.addEventListener("submit", (event) => {
  if (event.submitter?.value !== "save") return;
  event.preventDefault();
  const data = Object.fromEntries(new FormData(customizeForm));
  localStorage.setItem("tiny-love-note", JSON.stringify(data));
  loadPersonalization();
  dialog.close();
});

window.addEventListener("pointermove", (event) => {
  if (motionOff) return;
  document.querySelector(".cursor-glow").style.left = `${event.clientX}px`;
  document.querySelector(".cursor-glow").style.top = `${event.clientY}px`;
  if (Date.now() - lastSpark < 90 || event.pointerType === "touch") return;
  lastSpark = Date.now();
  const spark = document.createElement("span");
  spark.className = "spark";
  spark.textContent = Math.random() > 0.55 ? "♥" : "✦";
  spark.style.left = `${event.clientX}px`;
  spark.style.top = `${event.clientY}px`;
  spark.style.setProperty("--x", `${(Math.random() - 0.5) * 50}px`);
  spark.style.setProperty("--y", `${-20 - Math.random() * 35}px`);
  document.body.appendChild(spark);
  setTimeout(() => spark.remove(), 800);
});

reducedMotion.addEventListener("change", (event) => setMotionState(event.matches));
setMotionState(motionOff);
loadPersonalization();
