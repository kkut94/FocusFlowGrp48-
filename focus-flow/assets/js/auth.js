// assets/js/auth.js
const authForm = document.getElementById('auth-form');

if (authForm) {
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        localStorage.removeItem('guestMode');

        const emailInput = document.querySelector('input[type="email"]');
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        const submitBtn = authForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        const isSignup = passwordInputs.length === 2;
        const email = emailInput.value;
        const password = passwordInputs[0].value;

        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;

        if (isSignup) {
            const fullNameInput = document.querySelector('input[type="text"]');
            const confirmPassword = passwordInputs[1].value;

            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                return;
            }

            // Create user
            const { data, error } = await supabaseClient.auth.signUp({
                email: email, password: password,
                options: { data: { full_name: fullNameInput.value } }
            });

            if (error) {
                alert("Error: " + error.message);
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            } else {
                // INSTANT LOGIN: Route straight to the dashboard!
                window.location.href = 'dashboard.html';
            }
        } else {
            // Login Flow
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email, password: password,
            });

            if (error) {
                alert("Invalid login credentials.");
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            } else {
                window.location.href = 'dashboard.html';
            }
        }
    });
}