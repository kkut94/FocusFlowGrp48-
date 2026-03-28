// assets/js/session.js

document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    const currentPath = window.location.pathname;
    
    const isPublicPage = currentPath.includes('login.html') || 
                         currentPath.includes('signup.html') || 
                         currentPath.endsWith('index.html') || 
                         currentPath === '/';
    
    // Check if user clicked the Demo button
    const isGuest = localStorage.getItem('guestMode') === 'true';

    // 1. Protection Logic
    if (!session && !isPublicPage && !isGuest) {
        window.location.href = 'login.html'; 
        return;
    }

    if (session && isPublicPage) {
        window.location.href = currentPath.includes('pages/') ? 'dashboard.html' : 'pages/dashboard.html';
        return;
    }

    // 2. UI Hydration (Runs for logged-in users and guests)
    if ((session || isGuest) && !isPublicPage) {
        const fullName = session ? session.user.user_metadata.full_name : 'Guest User'; 
        const initial = session ? fullName.charAt(0).toUpperCase() : 'G';

        // Update Nav Avatars
        const avatarElements = document.querySelectorAll('.user-avatar');
        avatarElements.forEach(el => {
            el.textContent = initial;
            el.style.backgroundColor = 'var(--primary-color)';
            el.style.color = 'white';
        });

        // Update Dashboard Greeting
        const greeting = document.querySelector('.greeting-section h3');
        if (greeting) {
            const firstName = fullName.split(' ')[0];
            const hour = new Date().getHours();
            let timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
            greeting.textContent = `Good ${timeOfDay}, ${firstName}!`;
            
            if (isGuest) {
                const subtitle = document.querySelector('.greeting-section p');
                if (subtitle) subtitle.textContent = "Viewing in Demo Mode. Data will not be saved.";
            }
        }

        // Handle Logout
        const logoutBtns = document.querySelectorAll('#logout-btn');
        logoutBtns.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault(); 
                localStorage.removeItem('guestMode'); 
                if (session) {
                    await supabaseClient.auth.signOut();
                }
                window.location.href = 'login.html';
            });
        });
    }
});