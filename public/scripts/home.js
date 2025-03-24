$(document).ready(function() {
    // Show home section by default
    navigateTo('home');
    
    // Navigation handling with jQuery
    $('[data-page]').click(function(e) {
        e.preventDefault();
        navigateTo($(this).data('page'));
    });
    
    // Toggle navigation on mobile
    $('.navbar-toggler').click(function() {
        $('#navbarContent').toggleClass('show');
    });
    
    // Handle contact form submission
    $('#contact-form').submit(function(e) {
        e.preventDefault();
        alert('Thank you! Your message has been sent.');
        $(this)[0].reset();
    });
    
    // Add some interactive effects to the try button
    $('#try-button').click(function() {
        $(this).text('Nice!');
        setTimeout(function() {
            $('#try-button').text('Try It');
        }, 1500);
    });
    
    // Social icons interaction
    $('.social-icon').click(function() {
        const platform = $(this).data('icon');
        alert(`Redirecting to ${platform === 'f' ? 'Facebook' : platform === 'in' ? 'LinkedIn' : 'Twitter'}`);
    });
    
    // Style social icons
    $('.social-icons').css({
        'margin-top': '20px', 
        'display': 'flex', 
        'gap': '15px', 
        'justify-content': 'center'
    });
    
    $('.social-icon').css({
        'width': '50px', 
        'height': '50px', 
        'border-radius': '50%', 
        'display': 'flex', 
        'align-items': 'center', 
        'justify-content': 'center', 
        'background': 'var(--background)', 
        'box-shadow': '4px 4px 8px var(--shadow-dark), -4px -4px 8px var(--shadow-light)', 
        'cursor': 'pointer',
        'color': 'var(--accent-color)',
        'font-weight': 'bold'
    });
    
    // Add hover effect to social icons
    $('.social-icon').hover(
        function() {
            $(this).css('transform', 'scale(1.1)');
        },
        function() {
            $(this).css('transform', 'scale(1)');
        }
    );
    
    // Animate feature badges on home page
    $('.feature-badge').each(function(index) {
        $(this).css({
            'opacity': 0,
            'transform': 'translateY(20px)'
        });
        
        setTimeout(() => {
            $(this).animate({
                'opacity': 1,
                'transform': 'translateY(0)'
            }, 300);
        }, 300 + (index * 100));
    });
    
    // Navigation function
    function navigateTo(page) {
        // Update active navigation link
        $('.nav-link').removeClass('active');
        $(`.nav-link[data-page="${page}"]`).addClass('active');
        
        // Hide all sections and show the selected one with animation
        $('.content-section').hide();
        $(`#${page}-section`)
            .show()
            .addClass('section-transition');
        
        // Remove animation class after it completes
        setTimeout(function() {
            $(`#${page}-section`).removeClass('section-transition');
        }, 500);
        
        // Close mobile menu if open
        if ($('#navbarContent').hasClass('show')) {
            $('#navbarContent').removeClass('show');
        }
    }
    
    // Authentication Modal Functionality
    
    // Open login modal
    $('#loginBtn').click(function() {
        showAuthModal('login');
    });
    
    // Open signup modal
    $('#signupBtn').click(function() {
        showAuthModal('signup');
    });
    
    // Close modal
    $('#closeModal').click(function() {
        hideAuthModal();
    });
    
    // Close modal when clicking outside
    $('#authModal').click(function(e) {
        if ($(e.target).is('#authModal')) {
            hideAuthModal();
        }
    });
    
    // Switch between login and signup tabs
    $('#loginTab').click(function() {
        switchAuthTab('login');
    });
    
    $('#signupTab').click(function() {
        switchAuthTab('signup');
    });
    
    // Switch to signup from login footer
    $('#switchToSignup').click(function(e) {
        e.preventDefault();
        switchAuthTab('signup');
    });
    
    // Switch to login from signup footer
    $('#switchToLogin').click(function(e) {
        e.preventDefault();
        switchAuthTab('login');
    });
    
    // Handle login form submission
    $('#loginForm').submit(function(e) {
        e.preventDefault();
        // Simulate successful login
        loginUser();
    });
    
    // Handle signup form submission
    $('#signupForm').submit(function(e) {
        e.preventDefault();
        // Simulate successful signup
        loginUser();
    });
    
    // User dropdown functionality
    $('#userAvatar').click(function() {
        $('#userDropdown').toggleClass('show');
    });
    
    // Close dropdown when clicking outside
    $(document).click(function(e) {
        if (!$(e.target).closest('.user-profile').length) {
            $('#userDropdown').removeClass('show');
        }
    });
    
    // Handle logout
    $('#logoutBtn').click(function(e) {
        e.preventDefault();
        logoutUser();
    });
    
    // Social authentication buttons
    $('.social-auth-btn').click(function() {
        const platform = $(this).attr('title');
        alert(`Authenticating with ${platform}...`);
        setTimeout(function() {
            loginUser();
        }, 1000);
    });
    
    // Helper functions for auth
    function showAuthModal(tab) {
        switchAuthTab(tab);
        $('#authModal').addClass('show');
        $('#modalTitle').text(tab === 'login' ? 'Login' : 'Create Account');
    }
    
    function hideAuthModal() {
        $('#authModal').removeClass('show');
    }
    
    function switchAuthTab(tab) {
        $('.tab-button').removeClass('active');
        $('.tab-content').removeClass('active');
        
        if (tab === 'login') {
            $('#loginTab').addClass('active');
            $('#loginContent').addClass('active');
            $('#modalTitle').text('Login');
        } else {
            $('#signupTab').addClass('active');
            $('#signupContent').addClass('active');
            $('#modalTitle').text('Create Account');
        }
    }
    
    function loginUser() {
        // This would normally validate credentials with a server
        // For demo purposes, we'll just simulate a successful login
        hideAuthModal();
        $('#authButtons').hide();
        $('#userProfileSection').show();
        
        // Display success message
        alert('You have successfully logged in!');
    }
    
    function logoutUser() {
        $('#userProfileSection').hide();
        $('#authButtons').show();
        $('#userDropdown').removeClass('show');
        
        // Display logout message
        alert('You have been logged out.');
    }
    
    // Password strength indicator (for signup form)
    $('input[type="password"]').on('input', function() {
        const password = $(this).val();
        if ($(this).closest('form').attr('id') === 'signupForm' && 
            $(this).closest('.form-group').find('label').text() === 'Password') {
            const strength = getPasswordStrength(password);
            
            // Update or create strength indicator
            let strengthIndicator = $(this).closest('.form-group').find('.password-strength');
            if (strengthIndicator.length === 0) {
                strengthIndicator = $('<div class="password-strength" style="margin-top: 10px; font-size: 14px;"></div>');
                $(this).closest('.form-group').append(strengthIndicator);
            }
            
            // Set indicator text and color
            if (password.length === 0) {
                strengthIndicator.text('').hide();
            } else {
                let color, text;
                if (strength < 2) {
                    color = '#e74c3c';
                    text = 'Weak password';
                } else if (strength < 4) {
                    color = '#f39c12';
                    text = 'Medium strength password';
                } else {
                    color = '#27ae60';
                    text = 'Strong password';
                }
                
                strengthIndicator.text(text).css('color', color).show();
            }
        }
    });
    
    // Password matching validation for signup
    $('#signupForm input[type="password"]').on('input', function() {
        const passwords = $('#signupForm input[type="password"]');
        if (passwords.length === 2 && passwords.eq(0).val() && passwords.eq(1).val()) {
            const match = passwords.eq(0).val() === passwords.eq(1).val();
            let matchIndicator = passwords.eq(1).closest('.form-group').find('.password-match');
            
            if (matchIndicator.length === 0) {
                matchIndicator = $('<div class="password-match" style="margin-top: 10px; font-size: 14px;"></div>');
                passwords.eq(1).closest('.form-group').append(matchIndicator);
            }
            
            if (match) {
                matchIndicator.text('Passwords match').css('color', '#27ae60').show();
            } else {
                matchIndicator.text('Passwords do not match').css('color', '#e74c3c').show();
            }
        }
    });
    
    // Helper function to calculate password strength
    function getPasswordStrength(password) {
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        
        // Character variety checks
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        return strength;
    }
});