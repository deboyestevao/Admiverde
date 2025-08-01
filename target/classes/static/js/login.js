document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const submitButton = loginForm.querySelector('button[type="submit"]');
    const buttonText = submitButton.querySelector('span');
    const buttonLoader = submitButton.querySelector('.button-loader');
    const passwordToggle = document.getElementById('passwordToggle');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const rememberMeCheckbox = document.getElementById('rememberMe');

    // Password toggle functionality
    if (passwordToggle) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            passwordToggle.classList.toggle('show-password');
        });
    }

    // Remember me functionality
    if (rememberMeCheckbox) {
        // Load saved state
        const savedUsername = localStorage.getItem('rememberedUsername');
        if (savedUsername) {
            usernameInput.value = savedUsername;
            rememberMeCheckbox.checked = true;
        }

        rememberMeCheckbox.addEventListener('change', function() {
            if (this.checked) {
                localStorage.setItem('rememberMe', 'true');
            } else {
                localStorage.removeItem('rememberMe');
                localStorage.removeItem('rememberedUsername');
            }
        });
    }

    // Input focus effects
    [usernameInput, passwordInput].forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });

        // Add floating label effect
        input.addEventListener('input', function() {
            if (this.value.length > 0) {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
    });

    // Form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state
        showLoading();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        
        if (!username || !password) {
            hideLoading();
            showError('Por favor, preencha todos os campos.');
            return;
        }
        
        try {
            // Use Spring Security form login
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);
            
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });
            
            if (response.ok) {
                // Save username if remember me is checked
                if (rememberMeCheckbox && rememberMeCheckbox.checked) {
                    localStorage.setItem('rememberedUsername', username);
                }
                
                // Get user info after successful login
                const userResponse = await fetch('/api/auth/check-auth', {
                    credentials: 'include'
                });
                
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    
                    // Store user info in localStorage
                    localStorage.setItem('userRole', userData.role);
                    localStorage.setItem('username', userData.username);
                    localStorage.setItem('fullName', userData.fullName);
                    
                    console.log('Login successful for user:', userData.username);
                    console.log('User role:', userData.role);
                    console.log('User full name:', userData.fullName);
                    
                    // Show success message briefly
                    showSuccess('Login realizado com sucesso! A redirecionar...');
                    
                    // Redirect based on user role after a short delay
                    setTimeout(() => {
                        if (userData.role === 'ADMIN') {
                            console.log('Redirecting to admin dashboard...');
                            window.location.href = '/admin/dashboard';
                        } else {
                            console.log('Redirecting to client dashboard...');
                            window.location.href = '/client/dashboard';
                        }
                    }, 1500);
                } else {
                    hideLoading();
                    showError('Erro ao obter informações do utilizador.');
                }
            } else {
                hideLoading();
                showError('Nome de utilizador ou palavra-passe incorretos.');
            }
        } catch (error) {
            console.error('Login error:', error);
            hideLoading();
            showError('Erro de conexão. Tente novamente.');
        }
    });
    
    // Loading functions
    function showLoading() {
        submitButton.disabled = true;
        buttonText.style.display = 'none';
        buttonLoader.style.display = 'flex';
        loadingOverlay.classList.add('show');
    }
    
    function hideLoading() {
        submitButton.disabled = false;
        buttonText.style.display = 'inline';
        buttonLoader.style.display = 'none';
        loadingOverlay.classList.remove('show');
    }
    
    function showError(message) {
        // Remove existing messages
        removeMessages();
        
        // Create and show new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        loginForm.insertBefore(errorDiv, loginForm.firstChild);
        
        // Add shake animation to form
        loginForm.classList.add('shake');
        setTimeout(() => {
            loginForm.classList.remove('shake');
        }, 500);
        
        // Remove error after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }
    
    function showSuccess(message) {
        // Remove existing messages
        removeMessages();
        
        // Create and show new success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        
        loginForm.insertBefore(successDiv, loginForm.firstChild);
    }
    
    function removeMessages() {
        const existingError = document.querySelector('.error-message');
        const existingSuccess = document.querySelector('.success-message');
        
        if (existingError) {
            existingError.remove();
        }
        if (existingSuccess) {
            existingSuccess.remove();
        }
    }
    
    // Add shake animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .shake {
            animation: shake 0.5s ease-in-out;
        }
        
        .form-group.focused input {
            border-color: #4CAF50;
            box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.1);
        }
        
        .form-group input.has-value {
            border-color: #4CAF50;
        }
    `;
    document.head.appendChild(style);
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Enter key to submit form
        if (e.key === 'Enter' && (e.target === usernameInput || e.target === passwordInput)) {
            if (!submitButton.disabled) {
                loginForm.dispatchEvent(new Event('submit'));
            }
        }
        
        // Escape key to clear form
        if (e.key === 'Escape') {
            loginForm.reset();
            removeMessages();
            [usernameInput, passwordInput].forEach(input => {
                input.classList.remove('has-value');
            });
        }
    });
    
    // Add form validation feedback
    function validateForm() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        
        // Remove previous validation states
        usernameInput.classList.remove('valid', 'invalid');
        passwordInput.classList.remove('valid', 'invalid');
        
        // Validate username
        if (username.length > 0) {
            usernameInput.classList.add('valid');
        }
        
        // Validate password
        if (password.length > 0) {
            passwordInput.classList.add('valid');
        }
        
        // Check if form is valid
        const isValid = username.length > 0 && password.length > 0;
        submitButton.disabled = !isValid;
        
        return isValid;
    }
    
    // Add validation on input
    [usernameInput, passwordInput].forEach(input => {
        input.addEventListener('input', validateForm);
        input.addEventListener('blur', validateForm);
    });
    
    // Initial validation
    validateForm();
    
    // Add particle interaction
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => {
        particle.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.5)';
            this.style.background = 'rgba(76, 175, 80, 0.6)';
        });
        
        particle.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.background = 'rgba(76, 175, 80, 0.3)';
        });
    });
    
    // Add smooth scroll to top when page loads
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Add focus management
    usernameInput.focus();
    
    // Add accessibility improvements
    loginForm.setAttribute('aria-label', 'Formulário de login');
    usernameInput.setAttribute('aria-describedby', 'username-help');
    passwordInput.setAttribute('aria-describedby', 'password-help');
    
    // Add help text
    const usernameHelp = document.createElement('div');
    usernameHelp.id = 'username-help';
    usernameHelp.className = 'help-text';
    usernameHelp.textContent = 'Insira o seu nome de utilizador ou email';
    usernameHelp.style.cssText = 'font-size: 12px; color: #6b7280; margin-top: 4px; display: none;';
    usernameInput.parentNode.appendChild(usernameHelp);
    
    const passwordHelp = document.createElement('div');
    passwordHelp.id = 'password-help';
    passwordHelp.className = 'help-text';
    passwordHelp.textContent = 'A palavra-passe deve ter pelo menos 6 caracteres';
    passwordHelp.style.cssText = 'font-size: 12px; color: #6b7280; margin-top: 4px; display: none;';
    passwordInput.parentNode.appendChild(passwordHelp);
    
    // Show help text on focus
    usernameInput.addEventListener('focus', () => usernameHelp.style.display = 'block');
    usernameInput.addEventListener('blur', () => usernameHelp.style.display = 'none');
    passwordInput.addEventListener('focus', () => passwordHelp.style.display = 'block');
    passwordInput.addEventListener('blur', () => passwordHelp.style.display = 'none');
}); 