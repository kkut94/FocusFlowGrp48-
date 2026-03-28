// assets/js/timer.js

const timeDisplay = document.querySelector('.time-display');
const startBtn = document.querySelector('.start-btn');
const resetBtn = document.querySelector('.control-btn[title="Reset Session"]');
const skipBtn = document.querySelector('.control-btn[title="Skip Session"]');
const toggleBtns = document.querySelectorAll('.toggle-btn');
const xpBadge = document.querySelector('.topbar-actions div:first-child'); 
const focusHoursDisplay = document.querySelector('.t-stat-card:nth-child(1) .t-stat-value');

let isRunning = false;
let timerInterval = null;
let currentMode = 'focus';
let currentUser = null;
let currentProfile = null; 

const savedSettings = JSON.parse(localStorage.getItem('focusSettings')) || {
    pomodoro: 25, shortBreak: 5, longBreak: 15
};

const modes = {
    focus: savedSettings.pomodoro * 60,
    shortBreak: savedSettings.shortBreak * 60,
    longBreak: savedSettings.longBreak * 60
};

let timeLeft = modes[currentMode];

async function initTimer() {
    // 1. Restore the mode the user was last in
    currentMode = localStorage.getItem('timerMode') || 'focus';
    
    // Update Mode Buttons Visually
    toggleBtns.forEach(btn => btn.classList.remove('active'));
    if (currentMode === 'focus') toggleBtns[0].classList.add('active');
    else if (currentMode === 'shortBreak') toggleBtns[1].classList.add('active');
    else if (currentMode === 'longBreak') toggleBtns[2].classList.add('active');

    // 2. Check for Persistent Background Timers
    const savedState = localStorage.getItem('timerState');
    if (savedState === 'running') {
        const endTime = parseInt(localStorage.getItem('timerEndTime'), 10);
        timeLeft = Math.round((endTime - Date.now()) / 1000);
        
        if (timeLeft > 0) {
            // Pick up where we left off
            isRunning = true;
            startBtn.innerHTML = '<i data-feather="pause" style="margin-right:8px;"></i> Pause';
            timerInterval = setInterval(tick, 1000);
        } else {
            // Timer finished while we were away!
            timeLeft = 0;
            localStorage.removeItem('timerState');
            localStorage.removeItem('timerEndTime');
            handleSessionEnd(); 
        }
    } else if (savedState === 'paused') {
        timeLeft = parseInt(localStorage.getItem('timeLeft'), 10) || modes[currentMode];
    } else {
        timeLeft = modes[currentMode];
    }

    // 3. Authenticate and get stats
    const isGuest = localStorage.getItem('guestMode') === 'true';
    if(isGuest) {
        updateDisplay();
        return;
    }

    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) return;
    currentUser = session.user;

    const { data: profile } = await supabaseClient
        .from('profiles').select('*').eq('id', currentUser.id).single();

    if (profile) {
        currentProfile = profile;
        updateStatsUI();
    }
    updateDisplay();
}

function updateStatsUI() {
    if (!currentProfile) return;
    if(xpBadge) xpBadge.innerHTML = `<i data-feather="award" style="width: 14px; margin-right:4px;"></i> ${currentProfile.xp} XP`;
    if(focusHoursDisplay) {
        focusHoursDisplay.innerHTML = `${Number(currentProfile.focus_hours).toFixed(1)} <span style="font-size: 14px; color: var(--text-muted); font-weight: normal;">hrs</span>`;
    }
    if(window.renderIcons) window.renderIcons();
}

function updateDisplay() {
    const minutes = Math.floor(Math.max(0, timeLeft) / 60);
    const seconds = Math.max(0, timeLeft) % 60;
    const formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    if(timeDisplay) timeDisplay.textContent = formatted;
    document.title = `${formatted} - Focus Flow`;
    
    const totalTimeForMode = modes[currentMode];
    const percentageLeft = (Math.max(0, timeLeft) / totalTimeForMode) * 100;
    const ringColor = percentageLeft <= 20 ? 'var(--danger-red)' : 'var(--primary-color)';
    
    const circleWrapper = document.querySelector('.timer-circle-wrapper');
    if (circleWrapper) {
        circleWrapper.style.background = `conic-gradient(${ringColor} ${percentageLeft}%, #e5e7eb 0%)`;
    }
}

// The core countdown logic
function tick() {
    const endTime = parseInt(localStorage.getItem('timerEndTime'), 10);
    timeLeft = Math.round((endTime - Date.now()) / 1000);
    
    if (timeLeft > 0) {
        updateDisplay();
    } else {
        timeLeft = 0;
        updateDisplay();
        clearInterval(timerInterval);
        isRunning = false;
        startBtn.innerHTML = '<i data-feather="play" style="margin-right:8px;"></i> Start';
        
        // Clean up persistent memory
        localStorage.removeItem('timerState');
        localStorage.removeItem('timerEndTime');
        handleSessionEnd();
    }
}

function toggleTimer() {
    if (isRunning) {
        // Pause
        clearInterval(timerInterval);
        startBtn.innerHTML = '<i data-feather="play" style="margin-right:8px;"></i> Start';
        isRunning = false;
        
        localStorage.setItem('timerState', 'paused');
        localStorage.setItem('timeLeft', timeLeft);
        localStorage.removeItem('timerEndTime');
    } else {
        // Start
        startBtn.innerHTML = '<i data-feather="pause" style="margin-right:8px;"></i> Pause';
        isRunning = true;
        
        localStorage.setItem('timerState', 'running');
        localStorage.setItem('timerEndTime', Date.now() + (timeLeft * 1000));
        localStorage.setItem('timerMode', currentMode);
        
        timerInterval = setInterval(tick, 1000);
    }
    if(window.renderIcons) window.renderIcons();
}

async function handleSessionEnd() {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(e => console.log("Audio blocked"));

    if (currentMode === 'focus' && currentProfile && localStorage.getItem('guestMode') !== 'true') {
        const xpGained = 50;
        const hoursGained = savedSettings.pomodoro / 60; 

        const todayStr = new Date().toISOString().split('T')[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak = currentProfile.current_streak || 0;

        if (currentProfile.last_session_date !== todayStr) {
            if (currentProfile.last_session_date === yesterdayStr) newStreak += 1; 
            else newStreak = 1; 
        }

        const newXp = currentProfile.xp + xpGained;
        const newHours = Number(currentProfile.focus_hours) + hoursGained;

        currentProfile.xp = newXp;
        currentProfile.focus_hours = newHours;
        currentProfile.current_streak = newStreak;
        currentProfile.last_session_date = todayStr;
        updateStatsUI();
        
        await supabaseClient.from('profiles').update({ 
            xp: newXp, focus_hours: newHours, current_streak: newStreak, last_session_date: todayStr
        }).eq('id', currentUser.id);
    }

    if (currentMode === 'focus') {
        alert("Focus complete! Take a short break.");
        if(toggleBtns[1]) toggleBtns[1].click();
    } else {
        alert("Break over! Ready to focus?");
        if(toggleBtns[0]) toggleBtns[0].click();
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    if(startBtn) startBtn.innerHTML = '<i data-feather="play" style="margin-right:8px;"></i> Start';
    timeLeft = modes[currentMode];
    
    // Wipe persistent memory for this session
    localStorage.removeItem('timerState');
    localStorage.removeItem('timerEndTime');
    localStorage.setItem('timeLeft', timeLeft);
    
    updateDisplay();
    if(window.renderIcons) window.renderIcons();
}

function switchMode(event) {
    toggleBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    const modeText = event.target.textContent.toLowerCase();
    if (modeText.includes('focus')) currentMode = 'focus';
    else if (modeText.includes('short')) currentMode = 'shortBreak';
    else if (modeText.includes('long')) currentMode = 'longBreak';

    localStorage.setItem('timerMode', currentMode);
    resetTimer();
}

if(startBtn) startBtn.addEventListener('click', toggleTimer);
if(resetBtn) resetBtn.addEventListener('click', resetTimer);
if(skipBtn) skipBtn.addEventListener('click', () => { 
    timeLeft = 0; 
    tick(); // Force immediate tick to trigger session end properly
});

toggleBtns.forEach(btn => {
    btn.addEventListener('click', switchMode);
});

initTimer();