document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const passwordBtn = document.getElementById('passwordBtn');
    const popupOverlay = document.getElementById('popupOverlay');
    const closeBtn = document.getElementById('closeBtn');
    const subscribeForm = document.getElementById('subscribeForm');
    const passwordForm = document.getElementById('passwordForm');
    const passwordInput = document.getElementById('passwordInput');

    // Replace with your actual Google Apps Script web app URL
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyo0D6wZMhuGViBh9JEkJDS5DQc0izJ3OcUEf2y02i6Z27rhzV1yyVxh8KmSKAAd685sA/exec';

    // Open popup when password button is clicked
    passwordBtn.addEventListener('click', function() {
        popupOverlay.classList.add('active');
        // Focus on password input after animation completes
        setTimeout(() => {
            passwordInput.focus();
        }, 300);
    });

    // Close popup when close button is clicked
    closeBtn.addEventListener('click', function() {
        popupOverlay.classList.remove('active');
        passwordInput.value = '';
    });

    // Close popup when clicking outside the popup panel
    popupOverlay.addEventListener('click', function(e) {
        if (e.target === popupOverlay) {
            popupOverlay.classList.remove('active');
            passwordInput.value = '';
        }
    });

    // Close popup when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && popupOverlay.classList.contains('active')) {
            popupOverlay.classList.remove('active');
            passwordInput.value = '';
        }
    });

    // Handle subscribe form submission
    subscribeForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('.email-input');
        const submitBtn = this.querySelector('.subscribe-btn');
        const email = emailInput.value.trim();
        
        if (!email) {
            alert('Please enter a valid email address.');
            return;
        }

        // Disable button and show loading state
        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'JOINING...';
        
        try {
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    action: 'subscribe'
                })
            });

            // Since we're using no-cors, we can't read the response
            // We'll assume success and show the message
            alert("✅ Subscription successful! Check your email for the access password.");
            this.reset();

        } catch (error) {
            console.error("Error:", error);
            alert("🚨 Subscription failed! Please try again.");
        } finally {
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });

    // Handle password form submission
    passwordForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const password = passwordInput.value.trim();
        const submitBtn = this.querySelector('.enter-store-btn');
        
        if (!password) {
            alert('Please enter the password.');
            return;
        }

        // Disable button and show loading state
        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'VERIFYING...';
        
        try {
            // Verify password with Google Apps Script
            const response = await fetch(`${SCRIPT_URL}?password=${encodeURIComponent(password)}`, {
                method: 'GET',
                mode: 'cors' // We need to read the response for password verification
            });

            if (response.ok) {
                const result = await response.json();
                
                if (result.success) {
                    alert('✅ Access granted! Redirecting to the store...');
                    // Redirect to the store
                    window.location.href = result.redirectUrl || 'https://thedistinguishedsociety.com/the-manly-tee/';
                } else {
                    alert('❌ Invalid password. Please check your email for the correct password.');
                    passwordInput.value = '';
                    passwordInput.focus();
                }
            } else {
                throw new Error('Network response was not ok');
            }

        } catch (error) {
            console.error("Error:", error);
            alert("🚨 Unable to verify password. Please try again.");
        } finally {
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });

    // Prevent popup from closing when clicking inside the panel
    document.querySelector('.popup-panel').addEventListener('click', function(e) {
        e.stopPropagation();
    });
});