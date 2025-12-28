const checklist = document.querySelectorAll("input[type='checkbox']");
const completedCountEl = document.getElementById("completedCount");
const streakEl = document.getElementById("streak");
const messageEl = document.getElementById("message");
const alarm = document.getElementById("alarmSound");
const todayDateEl = document.getElementById("todayDate");

const today = new Date().toDateString();
todayDateEl.textContent = today;

// Load data
let data = JSON.parse(localStorage.getItem("tracker")) || {};
if (!data[today]) {
  data[today] = {};
}

checklist.forEach(cb => {
  cb.checked = data[today][cb.dataset.task] || false;

  cb.addEventListener("change", () => {
    data[today][cb.dataset.task] = cb.checked;
    localStorage.setItem("tracker", JSON.stringify(data));
    updateStats();
  });
});

function updateStats() {
  let completed = Object.values(data[today]).filter(Boolean).length;
  completedCountEl.textContent = completed;

  if (completed === checklist.length) {
    messageEl.textContent = "🔥 All tasks completed! Legend!";
    updateStreak(true);
  }
}

function updateStreak(success) {
  let streak = parseInt(localStorage.getItem("streak")) || 0;
  if (success) {
    streak++;
    localStorage.setItem("streak", streak);
  }
  streakEl.textContent = streak;
}

// Alarm check at 12 AM
setInterval(() => {
  const now = new Date();
  if (now.getHours() === 23 && now.getMinutes() === 59) {
    let completed = Object.values(data[today]).filter(Boolean).length;
    if (completed < checklist.length) {
      alarm.play();
      alert("⚠️ Complete your checklist before 12 AM!");
    }
  }
}, 60000);

updateStats();
streakEl.textContent = localStorage.getItem("streak") || 0;
