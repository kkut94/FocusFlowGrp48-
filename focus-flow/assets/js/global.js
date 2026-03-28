// assets/js/global.js
function renderIcons() {
    if (typeof feather !== 'undefined') {
        feather.replace();
    } else {
        setTimeout(renderIcons, 50); 
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderIcons();

    const sidebar = document.getElementById('app-sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                // Mobile behavior
                sidebar.classList.toggle('open');
            } else {
                // Desktop behavior
                sidebar.classList.toggle('collapsed');
            }
        });
    }

    // Close sidebar if clicking outside of it on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && sidebar && sidebar.classList.contains('open')) {
            if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
});

window.renderIcons = renderIcons;