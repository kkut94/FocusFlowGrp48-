// assets/js/dashboard.js

const tasksCompletedEl = document.querySelector('.stats-row .stat-card:nth-child(1) h2');
const focusSessionsEl = document.querySelector('.stats-row .stat-card:nth-child(2) h2');
const focusHoursEl = document.querySelector('.stats-row .stat-card:nth-child(3) h2');
const xpLevelHeader = document.querySelector('.xp-header h3');
const xpTitle = document.querySelector('.xp-header p');
const xpProgressFill = document.querySelector('.progress-fill');
const xpProgressText = document.querySelector('.xp-card > div:nth-child(2) span:nth-child(2)');
const xpRemainingText = document.querySelector('.xp-card > p');
const nextTasksContainer = document.querySelector('.tasks-card');

async function initDashboard() {
    if(localStorage.getItem('guestMode') === 'true') return; 

    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) return;
    const currentUser = session.user;

    const { data: profile } = await supabaseClient.from('profiles').select('*').eq('id', currentUser.id).single();
    const { data: tasks } = await supabaseClient.from('tasks').select('*').eq('user_id', currentUser.id).order('created_at', { ascending: false });

    if (profile && tasks) {
        updateStats(profile, tasks);
        updateXP(profile.xp);
        renderNextTasks(tasks);
        updateStreak(profile);
    }
}

function updateStats(profile, tasks) {
    // --- NEW: Count both DONE and CLAIMED tasks ---
    const completedTasks = tasks.filter(task => task.status === 'DONE' || task.status === 'CLAIMED').length;
    
    // Check custom timer length for accurate sessions count
    const savedSettings = JSON.parse(localStorage.getItem('focusSettings')) || { pomodoro: 25 };
    const totalSessions = Math.floor(profile.focus_hours / (savedSettings.pomodoro / 60));

    if(tasksCompletedEl) tasksCompletedEl.innerHTML = `${completedTasks} <span style="font-size: 14px; color: var(--text-muted); font-weight: normal;">total</span>`;
    if(focusSessionsEl) focusSessionsEl.textContent = totalSessions;
    if(focusHoursEl) focusHoursEl.textContent = Number(profile.focus_hours).toFixed(1);
}

function updateXP(totalXP) {
    const xpPerLevel = 200;
    const currentLevel = Math.floor(totalXP / xpPerLevel) + 1;
    const currentLevelBaseXP = (currentLevel - 1) * xpPerLevel;
    const xpIntoCurrentLevel = totalXP - currentLevelBaseXP;
    const progressPercentage = Math.floor((xpIntoCurrentLevel / xpPerLevel) * 100);
    const xpRemaining = xpPerLevel - xpIntoCurrentLevel;

    let title = "Novice";
    if (currentLevel >= 5) title = "Focus Apprentice";
    if (currentLevel >= 10) title = "Focus Master";
    if (currentLevel >= 20) title = "Productivity Guru";

    if(xpLevelHeader) xpLevelHeader.textContent = `XP Level ${currentLevel}`;
    if(xpTitle) xpTitle.textContent = title;
    if(xpProgressFill) xpProgressFill.style.width = `${progressPercentage}%`;
    if(xpProgressText) xpProgressText.textContent = `${progressPercentage}%`;
    if(xpRemainingText) xpRemainingText.textContent = `${xpRemaining} XP more to reach Level ${currentLevel + 1}`;
}

function updateStreak(profile) {
    const streakTitle = document.querySelector('.streak-card h4');
    const streakSubtitle = document.querySelector('.streak-card p');
    const dayCircles = document.querySelectorAll('.day-circle');
    const streakCount = profile.current_streak || 0;

    if(streakTitle && streakSubtitle) {
        if (streakCount > 0) {
            streakTitle.innerHTML = `Daily Streak! 🔥`;
            streakSubtitle.textContent = `You've hit your focus goal for ${streakCount} days in a row.`;
        } else {
            streakTitle.innerHTML = `Daily Streak 🧊`;
            streakSubtitle.textContent = `Complete a session today to start your streak!`;
        }
    }

    let currentDayIndex = new Date().getDay() - 1;
    if (currentDayIndex === -1) currentDayIndex = 6; 

    dayCircles.forEach((circle, index) => {
        circle.classList.remove('active');
        if (index <= currentDayIndex && index > currentDayIndex - streakCount) {
            circle.classList.add('active');
        }
    });
}

function renderNextTasks(tasks) {
    // Exclude both DONE and CLAIMED from the pending list
    const pendingTasks = tasks.filter(t => t.status !== 'DONE' && t.status !== 'CLAIMED').slice(0, 3);
    
    const headerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
            <h4 style="font-size: 16px;">Next Tasks</h4>
            <a href="task-board.html" style="font-size: 13px; color: var(--primary-color); font-weight: 600;">View All</a>
        </div>
    `;

    if (pendingTasks.length === 0) {
        if(nextTasksContainer) nextTasksContainer.innerHTML = headerHTML + `
            <div class="empty-state" style="padding: 16px 0;">
                <i data-feather="check-circle" class="empty-state-icon" style="width: 32px; height: 32px;"></i>
                <p>All caught up!</p>
                <a href="task-board.html" class="btn btn-secondary" style="font-size: 12px; padding: 6px 12px;">Add a Task</a>
            </div>
        `;
        if(window.renderIcons) window.renderIcons();
        return;
    }

    let tasksHTML = headerHTML;
    pendingTasks.forEach(task => {
        tasksHTML += `
            <div class="task-item">
                <div style="display: flex; gap: 12px; align-items: center;">
                    <div class="task-info">
                        <h4>${task.title}</h4>
                        <p>${task.priority}</p>
                    </div>
                </div>
                <span class="task-time">${task.status}</span>
            </div>
        `;
    });

    if(nextTasksContainer) nextTasksContainer.innerHTML = tasksHTML;
}

initDashboard();