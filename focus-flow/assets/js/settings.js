// assets/js/settings.js

const pomodoroSlider = document.getElementById('pomodoro-slider');
const shortBreakSlider = document.getElementById('short-break-slider');
const longBreakSlider = document.getElementById('long-break-slider');
const saveBtn = document.querySelector('.settings-actions .btn-primary');

function attachSliderListener(slider) {
    if (!slider) return;
    const label = slider.nextElementSibling; 
    slider.addEventListener('input', (e) => {
        label.textContent = `${e.target.value}m`;
    });
}

attachSliderListener(pomodoroSlider);
attachSliderListener(shortBreakSlider);
attachSliderListener(longBreakSlider);

function loadSettings() {
    const saved = JSON.parse(localStorage.getItem('focusSettings')) || {
        pomodoro: 25, shortBreak: 5, longBreak: 15
    };

    if(pomodoroSlider) {
        pomodoroSlider.value = saved.pomodoro;
        pomodoroSlider.nextElementSibling.textContent = `${saved.pomodoro}m`;
    }
    if(shortBreakSlider) {
        shortBreakSlider.value = saved.shortBreak;
        shortBreakSlider.nextElementSibling.textContent = `${saved.shortBreak}m`;
    }
    if(longBreakSlider) {
        longBreakSlider.value = saved.longBreak;
        longBreakSlider.nextElementSibling.textContent = `${saved.longBreak}m`;
    }
}

if(saveBtn) {
    saveBtn.addEventListener('click', () => {
        const settings = {
            pomodoro: parseInt(pomodoroSlider.value),
            shortBreak: parseInt(shortBreakSlider.value),
            longBreak: parseInt(longBreakSlider.value)
        };
        
        localStorage.setItem('focusSettings', JSON.stringify(settings));
        
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = '<i data-feather="check"></i> Saved!';
        saveBtn.style.backgroundColor = 'var(--success-green)';
        if(window.renderIcons) window.renderIcons();
        
        setTimeout(() => {
            saveBtn.innerHTML = originalText;
            saveBtn.style.backgroundColor = ''; 
        }, 2000);
    });
}

loadSettings();