// assets/js/analytics.js

async function initAnalytics() {
    if(localStorage.getItem('guestMode') === 'true') {
        renderEmptyState();
        return; 
    }

    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) return;
    const currentUser = session.user;

    // Fetch user profile and all their tasks
    const { data: profile } = await supabaseClient.from('profiles').select('*').eq('id', currentUser.id).single();
    const { data: tasks } = await supabaseClient.from('tasks').select('*').eq('user_id', currentUser.id);

    if (profile && tasks) {
        updateStats(profile, tasks);
        updateLevelBanner(profile.xp);
        renderWeeklyChart();
        renderBadges(profile, tasks);
    }
}

function updateStats(profile, tasks) {
    // Count both DONE and CLAIMED tasks
    const completedTasks = tasks.filter(task => task.status === 'DONE' || task.status === 'CLAIMED').length;
    
    // Get customized timer settings to calculate accurate session counts
    const savedSettings = JSON.parse(localStorage.getItem('focusSettings')) || { pomodoro: 25 };
    const totalSessions = Math.floor(profile.focus_hours / (savedSettings.pomodoro / 60));

    const statValues = document.querySelectorAll('.stats-row .stat-card h2');
    if(statValues.length >= 3) {
        statValues[0].textContent = completedTasks;
        statValues[1].textContent = totalSessions;
        statValues[2].textContent = `${Number(profile.focus_hours).toFixed(1)}h`;
    }
}

function updateLevelBanner(totalXP) {
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

    const bannerTitle = document.querySelector('.level-info h3');
    const bannerSubtitle = document.querySelector('.level-info p');
    const bannerRemaining = document.querySelector('.level-info span');
    const progressBar = document.querySelector('.progress-fill.dark');

    if(bannerTitle) bannerTitle.textContent = title;
    if(bannerSubtitle) bannerSubtitle.textContent = `Level ${currentLevel} • ${totalXP} Total XP`;
    if(bannerRemaining) bannerRemaining.textContent = `${xpRemaining} XP to go`;
    if(progressBar) progressBar.style.width = `${progressPercentage}%`;
}

function renderWeeklyChart() {
    const chartContainer = document.querySelector('.chart-card');
    if(!chartContainer) return;

    // Grab the history we saved from the timer
    const history = JSON.parse(localStorage.getItem('focusHistory')) || {};
    const maxHoursScale = 4; // Chart visually caps at 4 hours a day

    let chartHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 24px;">
            <div>
                <h4 style="font-size: 16px;">Weekly Focus Hours</h4>
                <p style="font-size: 13px; color: var(--text-muted);">Hours spent in deep work per day</p>
            </div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: flex-end; height: 180px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
    `;

    // Generate bars for the last 7 days
    for(let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayName = d.toLocaleDateString('en-US', {weekday: 'short'});
        
        const hoursLogged = history[dateStr] || 0;
        const heightPct = Math.min((hoursLogged / maxHoursScale) * 100, 100);

        chartHTML += `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; width: 100%; max-width: 40px;">
                <div title="${hoursLogged.toFixed(1)} hrs" style="width: 100%; height: 130px; background: #f3f4f6; border-radius: 6px; position: relative; display: flex; align-items: flex-end; cursor: pointer;">
                    <div style="width: 100%; height: ${heightPct}%; background: var(--primary-color); border-radius: 6px; transition: height 1s ease-out;"></div>
                </div>
                <span style="font-size: 11px; color: var(--text-muted); font-weight: 600;">${dayName}</span>
            </div>
        `;
    }

    chartHTML += `</div>`;
    chartContainer.innerHTML = chartHTML;
}

function renderBadges(profile, tasks) {
    const badgeContainer = document.querySelector('.streak-card');
    if(!badgeContainer) return;

    const completedTasks = tasks.filter(task => task.status === 'DONE' || task.status === 'CLAIMED').length;

    // Define the unlock conditions for the badges
    const achievements = [
        { title: 'First Step', desc: 'Complete 1 Task', icon: 'check-square', unlocked: completedTasks >= 1 },
        { title: 'Task Master', desc: 'Complete 10 Tasks', icon: 'layers', unlocked: completedTasks >= 10 },
        { title: 'Deep Worker', desc: 'Reach 2 Focus Hours', icon: 'clock', unlocked: profile.focus_hours >= 2 },
        { title: 'Consistency', desc: '3-Day Streak', icon: 'zap', unlocked: profile.current_streak >= 3 }
    ];

    const unlockedCount = achievements.filter(a => a.unlocked).length;

    let html = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
            <div>
                <h4 style="font-size: 12px; color: var(--badge-text); letter-spacing: 1px; margin-bottom: 4px; text-transform: uppercase; font-weight: 700;">Achievements</h4>
                <h3 style="font-size: 20px; font-weight: 700;">${unlockedCount} / ${achievements.length} Unlocked</h3>
            </div>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
    `;

    achievements.forEach(badge => {
        const bg = badge.unlocked ? 'var(--badge-bg)' : 'rgba(255,255,255,0.05)';
        const color = badge.unlocked ? 'var(--primary-color)' : 'rgba(255,255,255,0.3)';
        const textColor = badge.unlocked ? 'white' : 'rgba(255,255,255,0.5)';
        
        html += `
            <div style="background: ${badge.unlocked ? 'rgba(255,255,255,0.1)' : 'transparent'}; border: 1px solid ${badge.unlocked ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)'}; padding: 16px; border-radius: 12px; display: flex; align-items: center; gap: 16px; transition: transform 0.2s;">
                <div style="width: 48px; height: 48px; border-radius: 50%; background: ${bg}; color: ${color}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <i data-feather="${badge.unlocked ? badge.icon : 'lock'}"></i>
                </div>
                <div>
                    <h4 style="font-size: 14px; font-weight: 600; color: ${textColor}; margin-bottom: 2px;">${badge.title}</h4>
                    <p style="font-size: 11px; color: rgba(255,255,255,0.4);">${badge.desc}</p>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    badgeContainer.innerHTML = html;
    
    if(window.renderIcons) window.renderIcons();
}

function renderEmptyState() {
    // Failsafe for Demo Mode
    console.log("Analytics disabled in Demo Mode");
}

initAnalytics();