/**
 * FocusFlow — Focus Engine & Minimalist UI
 * Vanilla JS — No frameworks
 */

// ============================================================
// STATE
// ============================================================
const MODES = {
  focus: { label: 'Focus',       duration: 25 * 60 },
  short: { label: 'Short Break', duration: 5  * 60 },
  long:  { label: 'Long Break',  duration: 15 * 60 },
};

// Mode cycle: focus → short → focus → long → focus → short → ...
const MODE_CYCLE = ['focus', 'short', 'focus', 'long'];

const state = {
  currentMode: 'focus',
  cycleIndex: 0,
  timeLeft: MODES.focus.duration,   // 25 * 60 = 1500 → displays 25:00
  totalTime: MODES.focus.duration,
  isRunning: false,
  intervalId: null,
  taskModeActive: false,
  totalXP: 1240,
  // User profile data — populated when merged with auth/profile screen
  user: {
    id: '',
    name: '',
    avatar: '',
  },
};

// ============================================================
// DOM REFS
// ============================================================
const timerDisplay    = document.getElementById('timerDisplay');
const ringProgress    = document.getElementById('ringProgress');
const startPauseBtn   = document.getElementById('startPauseBtn');
const startPauseLabel = document.getElementById('startPauseLabel');
const resetBtn        = document.getElementById('resetBtn');
const skipBtn         = document.getElementById('skipBtn');
const modeTabs        = document.querySelectorAll('.mode-tab');
const taskModeBtn     = document.getElementById('taskModeBtn');
const taskOverlay     = document.getElementById('taskOverlay');
const overlayMinutes  = document.getElementById('overlayMinutes');
const overlaySeconds  = document.getElementById('overlaySeconds');
const overlayPauseBtn = document.getElementById('overlayPauseBtn');
const overlayPauseLabel = document.getElementById('overlayPauseLabel');
const overlayEndBtn   = document.getElementById('overlayEndBtn');
const totalXPEl       = document.getElementById('totalXP');
const settingsBtn     = document.getElementById('settingsBtn');
const userAvatar      = document.getElementById('userAvatar');

// SVG ring circumference: 2 * PI * r = 2 * 3.14159 * 100 ≈ 628.3
const CIRCUMFERENCE = 2 * Math.PI * 100;

// ============================================================
// TIMER CORE
// ============================================================

/** Format seconds into MM:SS string */
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** Update all timer displays (main + overlay) */
function updateDisplay() {
  const formatted = formatTime(state.timeLeft);
  timerDisplay.textContent = formatted;

  // Overlay split display
  const m = Math.floor(state.timeLeft / 60);
  const s = state.timeLeft % 60;
  overlayMinutes.textContent = String(m).padStart(2, '0');
  overlaySeconds.textContent = String(s).padStart(2, '0');

  // Ring progress
  const progress = state.timeLeft / state.totalTime;
  const offset = CIRCUMFERENCE * (1 - progress);
  ringProgress.style.strokeDashoffset = offset;
}

/** Start the countdown */
function startTimer() {
  if (state.isRunning) return;
  state.isRunning = true;

  // Update button to Pause state
  setStartPauseUI('pause');

  state.intervalId = setInterval(() => {
    if (state.timeLeft <= 0) {
      clearInterval(state.intervalId);
      state.isRunning = false;
      onSessionComplete();
      return;
    }
    state.timeLeft--;
    updateDisplay();
  }, 1000);
}

/** Pause the countdown */
function pauseTimer() {
  if (!state.isRunning) return;
  clearInterval(state.intervalId);
  state.isRunning = false;
  setStartPauseUI('start');
}

/** Reset to beginning of current mode */
function resetTimer() {
  clearInterval(state.intervalId);
  state.isRunning = false;
  state.timeLeft = MODES[state.currentMode].duration;
  state.totalTime = MODES[state.currentMode].duration;
  setStartPauseUI('start');
  updateDisplay();
}

/** Skip to next mode in cycle */
function skipMode() {
  clearInterval(state.intervalId);
  state.isRunning = false;
  state.cycleIndex = (state.cycleIndex + 1) % MODE_CYCLE.length;
  switchMode(MODE_CYCLE[state.cycleIndex]);
}

/** Switch to a named mode */
function switchMode(modeName) {
  state.currentMode = modeName;
  state.timeLeft = MODES[modeName].duration;
  state.totalTime = MODES[modeName].duration;
  state.isRunning = false;
  clearInterval(state.intervalId);

  // Sync cycle index if tab was clicked directly
  const idx = MODE_CYCLE.indexOf(modeName);
  if (idx !== -1) state.cycleIndex = idx;

  // Update active tab
  modeTabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.mode === modeName);
  });

  setStartPauseUI('start');
  updateDisplay();
}

/** Called when a session timer reaches 0 */
function onSessionComplete() {
  setStartPauseUI('start');

  if (state.currentMode === 'focus') {
    // Award XP
    state.totalXP += 50;
    totalXPEl.textContent = state.totalXP.toLocaleString() + ' XP';
    showXPToast('+50 XP earned! Great focus session 🎉');
  }

  // Auto-advance to next mode
  state.cycleIndex = (state.cycleIndex + 1) % MODE_CYCLE.length;
  switchMode(MODE_CYCLE[state.cycleIndex]);
}

/** Toggle start/pause button UI */
function setStartPauseUI(mode) {
  const playIcon  = startPauseBtn.querySelector('.btn-icon-play');
  const pauseIcon = startPauseBtn.querySelector('.btn-icon-pause');

  if (mode === 'pause') {
    playIcon.style.display  = 'none';
    pauseIcon.style.display = 'inline';
    startPauseLabel.textContent = 'Pause';
    overlayPauseLabel.textContent = 'Pause Session';
    overlayPauseBtn.querySelector('svg').style.display = 'inline';
  } else {
    playIcon.style.display  = 'inline';
    pauseIcon.style.display = 'none';
    startPauseLabel.textContent = 'Start';
    overlayPauseLabel.textContent = 'Resume Session';
  }
}

// ============================================================
// XP TOAST
// ============================================================
function showXPToast(message) {
  // Create or reuse toast element
  let toast = document.querySelector('.xp-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'xp-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ============================================================
// TASK MODE OVERLAY
// ============================================================
function enterTaskMode() {
  state.taskModeActive = true;
  taskOverlay.style.display = 'flex';
  // Trigger transition on next frame
  requestAnimationFrame(() => taskOverlay.classList.add('visible'));
  taskModeBtn.textContent = '✕ Exit Task Mode';

  // Auto-start timer when entering task mode
  if (!state.isRunning) startTimer();
}

function exitTaskMode() {
  state.taskModeActive = false;
  taskOverlay.classList.remove('visible');
  setTimeout(() => { taskOverlay.style.display = 'none'; }, 300);
  taskModeBtn.textContent = '⚡ Enter Task Mode';
}

// ============================================================
// EVENT LISTENERS
// ============================================================

// Start / Pause toggle
startPauseBtn.addEventListener('click', () => {
  if (state.isRunning) pauseTimer();
  else startTimer();
});

// Reset
resetBtn.addEventListener('click', resetTimer);

// Skip
skipBtn.addEventListener('click', skipMode);

// Mode tabs
modeTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    if (tab.dataset.mode !== state.currentMode) {
      switchMode(tab.dataset.mode);
    }
  });
});

// Task Mode toggle
taskModeBtn.addEventListener('click', () => {
  if (state.taskModeActive) exitTaskMode();
  else enterTaskMode();
});

// Overlay pause/resume
overlayPauseBtn.addEventListener('click', () => {
  if (state.isRunning) pauseTimer();
  else startTimer();
});

// Overlay end session
overlayEndBtn.addEventListener('click', () => {
  pauseTimer();
  exitTaskMode();
  resetTimer();
});

// ============================================================
// NAVIGATION — ready for merge with other screen files
// ============================================================

/**
 * navigateTo(screen)
 * Central routing function. When this timer screen is merged into a
 * multi-screen app, replace the href assignments below with your
 * router's navigate() call (e.g. router.push('/settings')).
 */
function navigateTo(screen) {
  window.location.href = `${screen}.html`;
}

// Settings button → settings screen
settingsBtn.addEventListener('click', (e) => {
  e.preventDefault();
  navigateTo('settings');
});

// Avatar → profile screen
userAvatar.addEventListener('click', () => navigateTo('profile'));
userAvatar.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') navigateTo('profile');
});

/**
 * loadUserProfile(user)
 * Call this after fetching user data to populate the avatar and XP.
 * Example: loadUserProfile({ id: '123', name: 'Alex', avatar: 'alex.jpg', xp: 1240 })
 */
function loadUserProfile(user) {
  state.user = { ...state.user, ...user };
  if (user.avatar) {
    userAvatar.style.backgroundImage = `url('${user.avatar}')`;
    userAvatar.style.backgroundSize = 'cover';
  }
  if (user.xp !== undefined) {
    state.totalXP = user.xp;
    totalXPEl.textContent = state.totalXP.toLocaleString() + ' XP';
  }
  if (user.id) userAvatar.dataset.userId = user.id;
}

// ============================================================
// INIT
// ============================================================
function init() {
  updateDisplay();
}

init();
