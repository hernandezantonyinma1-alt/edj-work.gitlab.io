const survey = [
  { id: "experience", question: "¿Qué tipo de activación desea su cliente?", time: 20, options: ["Brand Launch", "Innovation Summit", "Retail Immersive", "Premium Research"] },
  { id: "market", question: "¿Qué región tiene mayor prioridad?", time: 18, options: ["Norteamérica", "Europa", "LATAM", "APAC"] },
  { id: "personalization", question: "Nivel de personalización objetivo", time: 15, options: ["Básico", "Intermedio", "Avanzado", "Hyper-Personalizado"] },
  { id: "channels", question: "Canales con mayor impacto esperado", time: 20, options: ["Tablet In-store", "Video Wall", "Social Live", "CRM Sync"] },
  { id: "kpi", question: "KPI principal para esta operación", time: 20, options: ["Conversión", "NPS", "Engagement", "Insights"] }
];

const state = { current: 0, answers: Array(survey.length).fill(null), timer: null, countdown: 0, simulated: 0 };
const $ = (id) => document.getElementById(id);
const qText = $("questionText"), answersWrap = $("answers"), nextBtn = $("nextBtn"), prevBtn = $("prevBtn");
const stepLabel = $("stepLabel"), progressBar = $("progressBar"), timerLabel = $("questionTimer");
const results = $("results"), surveyCard = $("surveyCard"), charts = $("charts"), insights = $("insights");

function renderQuestion() {
  const currentQ = survey[state.current];
  stepLabel.textContent = `Pregunta ${state.current + 1} de ${survey.length}`;
  progressBar.style.width = `${((state.current + 1) / survey.length) * 100}%`;
  qText.textContent = currentQ.question;
  prevBtn.disabled = state.current === 0;
  nextBtn.disabled = !state.answers[state.current];
  answersWrap.innerHTML = "";
  currentQ.options.forEach((option) => {
    const btn = document.createElement("button");
    btn.className = `answer ${state.answers[state.current] === option ? "selected" : ""}`;
    btn.textContent = option;
    btn.onclick = () => {
      state.answers[state.current] = option;
      renderQuestion();
    };
    answersWrap.appendChild(btn);
  });
  startTimer(currentQ.time);
}

function startTimer(seconds) {
  clearInterval(state.timer);
  state.countdown = seconds;
  timerLabel.textContent = `${seconds}s`;
  state.timer = setInterval(() => {
    state.countdown -= 1;
    timerLabel.textContent = `${state.countdown}s`;
    if (state.countdown <= 0) {
      clearInterval(state.timer);
      if (!state.answers[state.current]) state.answers[state.current] = survey[state.current].options[0];
      goNext();
    }
  }, 1000);
}

function goNext() {
  if (state.current < survey.length - 1) {
    state.current += 1;
    renderQuestion();
  } else {
    showResults();
  }
}

nextBtn.addEventListener("click", goNext);
prevBtn.addEventListener("click", () => {
  if (state.current > 0) {
    state.current -= 1;
    renderQuestion();
  }
});

function showResults() {
  clearInterval(state.timer);
  surveyCard.hidden = true;
  results.hidden = false;
  const counts = {};
  state.answers.forEach((a) => { counts[a] = (counts[a] || 0) + 1; });
  charts.innerHTML = Object.entries(counts).map(([label, count]) => {
    const pct = (count / state.answers.length) * 100;
    return `<article class="chart-item"><strong>${label}</strong><div class="bar"><span style="width:${pct}%"></span></div><small>${pct.toFixed(1)}%</small></article>`;
  }).join("");

  const unique = new Set(state.answers).size;
  insights.innerHTML = `
    <div><strong>${state.answers.length}</strong><p>Respuestas capturadas</p></div>
    <div><strong>${unique}</strong><p>Variedad de preferencia</p></div>
    <div><strong>${Math.round((unique / state.answers.length) * 100)}%</strong><p>Índice de diversidad</p></div>`;
}

$("restartBtn").addEventListener("click", () => location.reload());
$("exportBtn").addEventListener("click", () => {
  const payload = { generatedAt: new Date().toISOString(), answers: state.answers, simulatedResponses: state.simulated };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "pulsemotion-results.json";
  link.click();
  URL.revokeObjectURL(link.href);
});

$("audienceInput").addEventListener("input", (e) => $("audienceTag").textContent = `Segmento: ${e.target.value || "Global Premium"}`);
$("themeMode").addEventListener("change", (e) => {
  const root = document.documentElement.style;
  if (e.target.value === "night") { root.setProperty("--bg-a", "#020613"); root.setProperty("--bg-b", "#101a3d"); }
  else if (e.target.value === "sunrise") { root.setProperty("--bg-a", "#2a1648"); root.setProperty("--bg-b", "#6a2f58"); }
  else { root.setProperty("--bg-a", "#081125"); root.setProperty("--bg-b", "#220f4b"); }
});

$("simulateBtn").addEventListener("click", () => {
  state.simulated += 50;
  const goal = Number($("goalInput").value) || 1200;
  const completion = Math.min(99, Math.round((state.simulated / goal) * 100));
  $("activeSessions").textContent = String(24 + Math.floor(state.simulated / 10)).padStart(3, "0");
  $("avgCompletion").textContent = `${completion}%`;
  $("npsPulse").textContent = `+${65 + Math.floor(completion / 4)}`;
});

function initParticles() {
  const canvas = $("particleCanvas");
  const ctx = canvas.getContext("2d");
  let particles = [];
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = Array.from({ length: 60 }, () => ({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: Math.random() * 2 + 1, vx: Math.random() * 0.6 - 0.3, vy: Math.random() * 0.6 - 0.3 }));
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(120,240,255,.45)";
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  resize();
  draw();
  window.addEventListener("resize", resize);
}

initParticles();
renderQuestion();
