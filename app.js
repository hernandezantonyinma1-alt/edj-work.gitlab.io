const survey = [
  {
    question: "¿Qué experiencia inmersiva busca tu cliente global?",
    options: ["Lanzamiento de marca", "Evento de innovación", "Investigación de mercado premium", "Activación en retail"]
  },
  {
    question: "¿Cuál es el nivel ideal de personalización por región?",
    options: ["Bajo", "Medio", "Alto", "Ultra segmentado"]
  },
  {
    question: "¿Qué KPI es prioritario para tu agencia?",
    options: ["Engagement", "Conversión", "NPS", "Insights accionables"]
  }
];

let current = 0;
const answers = [];
const qText = document.getElementById("questionText");
const answersWrap = document.getElementById("answers");
const nextBtn = document.getElementById("nextBtn");
const stepLabel = document.getElementById("stepLabel");
const progressBar = document.getElementById("progressBar");
const results = document.getElementById("results");
const charts = document.getElementById("charts");
const questionCard = document.getElementById("questionCard");

document.getElementById("restartBtn").addEventListener("click", () => location.reload());

function renderQuestion() {
  nextBtn.disabled = true;
  const item = survey[current];
  stepLabel.textContent = `Pregunta ${current + 1} de ${survey.length}`;
  progressBar.style.width = `${((current + 1) / survey.length) * 100}%`;
  qText.textContent = item.question;
  answersWrap.innerHTML = "";
  item.options.forEach((option) => {
    const btn = document.createElement("button");
    btn.className = "answer";
    btn.textContent = option;
    btn.onclick = () => {
      [...answersWrap.children].forEach((child) => child.classList.remove("selected"));
      btn.classList.add("selected");
      answers[current] = option;
      nextBtn.disabled = false;
    };
    answersWrap.appendChild(btn);
  });
}

nextBtn.addEventListener("click", () => {
  current += 1;
  if (current < survey.length) {
    renderQuestion();
    return;
  }
  showResults();
});

function showResults() {
  questionCard.hidden = true;
  results.hidden = false;
  const counts = {};
  answers.forEach((a) => { counts[a] = (counts[a] || 0) + 1; });
  charts.innerHTML = Object.entries(counts).map(([label, count]) => {
    const pct = (count / answers.length) * 100;
    return `<div class="bar-wrap"><strong>${label}</strong><div class="bar"><span style="width:${pct}%"></span></div><small>${pct.toFixed(0)}%</small></div>`;
  }).join("");
}

renderQuestion();
