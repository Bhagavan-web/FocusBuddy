// FocusBuddy JavaScript
document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const minutesInput = document.getElementById("minutes-input");
  const startBtn = document.getElementById("start-btn");
  const pauseBtn = document.getElementById("pause-btn");
  const resetBtn = document.getElementById("reset-btn");

  const focusMode = document.getElementById("focus-mode");
  const setupPanel = document.getElementById("setup");
  const currentTaskDisplay = document.getElementById("current-task");
  const timeDisplay = document.getElementById("time-display");

  const focusPauseBtn = document.getElementById("focus-pause-btn");
  const focusResumeBtn = document.getElementById("focus-resume-btn");
  const focusExitBtn = document.getElementById("focus-exit-btn");

  const historyList = document.getElementById("history-list");
  const alarmAudio = document.getElementById("alarm-audio");

  const yearSpan = document.getElementById("year");
  yearSpan.textContent = new Date().getFullYear();

  let countdown;
  let remainingTime = 0;
  let isPaused = false;
  let currentTask = "";

  // Load last task from localStorage
  if (localStorage.getItem("lastTask")) {
    taskInput.value = localStorage.getItem("lastTask");
  }

  function updateDisplay(seconds) {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    timeDisplay.textContent = `${mins}:${secs}`;
  }

  function startTimer() {
    currentTask = taskInput.value.trim();
    if (!currentTask) return alert("Please enter a task.");

    const minutes = parseInt(minutesInput.value, 10);
    if (isNaN(minutes) || minutes < 1) return alert("Enter valid minutes.");

    remainingTime = minutes * 60;
    updateDisplay(remainingTime);

    localStorage.setItem("lastTask", currentTask);

    // Switch to focus mode
    setupPanel.hidden = true;
    focusMode.hidden = false;
    currentTaskDisplay.textContent = currentTask;

    isPaused = false;
    startCountdown();

    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;
  }

  function startCountdown() {
    countdown = setInterval(() => {
      if (!isPaused) {
        remainingTime--;
        updateDisplay(remainingTime);

        if (remainingTime <= 0) {
          clearInterval(countdown);
          alarmAudio.play();
          saveHistory(true);
          alert("Time’s up! 🎉");
          exitFocusMode();
        }
      }
    }, 1000);
  }

  function pauseTimer() {
    isPaused = true;
    pauseBtn.disabled = true;
    focusPauseBtn.hidden = true;
    focusResumeBtn.hidden = false;
  }

  function resumeTimer() {
    isPaused = false;
    pauseBtn.disabled = false;
    focusPauseBtn.hidden = false;
    focusResumeBtn.hidden = true;
  }

  function resetTimer() {
    clearInterval(countdown);
    updateDisplay(0);
    exitFocusMode();
  }

  function exitFocusMode() {
    clearInterval(countdown);
    focusMode.hidden = true;
    setupPanel.hidden = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resetBtn.disabled = true;
  }

  function saveHistory(completed) {
    const li = document.createElement("li");
    li.textContent = `${minutesInput.value}m • ${currentTask} • ${
      completed ? "Completed" : "Stopped"
    }`;
    historyList.prepend(li);
  }

  // Event listeners
  startBtn.addEventListener("click", startTimer);
  pauseBtn.addEventListener("click", pauseTimer);
  resetBtn.addEventListener("click", resetTimer);

  focusPauseBtn.addEventListener("click", pauseTimer);
  focusResumeBtn.addEventListener("click", resumeTimer);
  focusExitBtn.addEventListener("click", () => {
    saveHistory(false);
    exitFocusMode();
  });
});
