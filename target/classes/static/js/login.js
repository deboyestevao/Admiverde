document.addEventListener('DOMContentLoaded', function() {
    try {
        const loginForm = document.getElementById('loginForm');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const submitButton = loginForm.querySelector('button[type="submit"]');
        const buttonText = submitButton.querySelector('span');
        const buttonLoader = submitButton.querySelector('.button-loader');
        const showPasswordCheckbox = document.getElementById('showPassword');
        const loadingOverlay = document.getElementById('loadingOverlay');
        const rememberMeCheckbox = document.getElementById('rememberMe');
        
        // Validate that all required elements exist
        if (!loginForm || !usernameInput || !passwordInput || !submitButton || !buttonText || !buttonLoader || !loadingOverlay) {
            console.error('Required login form elements not found');
            return;
        }

    // Show password functionality
    if (showPasswordCheckbox) {
        try {
            showPasswordCheckbox.addEventListener('change', function() {
                const type = this.checked ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
            });
        } catch (showPasswordError) {
            console.warn('Could not add show password functionality:', showPasswordError);
        }
    }

    // Remember me functionality
    if (rememberMeCheckbox) {
        // Load saved state
        try {
            const savedUsername = localStorage.getItem('rememberedUsername');
            if (savedUsername) {
                usernameInput.value = savedUsername;
                rememberMeCheckbox.checked = true;
            }
        } catch (storageError) {
            console.warn('Could not load remembered username:', storageError);
        }

        rememberMeCheckbox.addEventListener('change', function() {
            try {
                if (this.checked) {
                    localStorage.setItem('rememberMe', 'true');
                } else {
                    localStorage.removeItem('rememberMe');
                    localStorage.removeItem('rememberedUsername');
                }
            } catch (storageError) {
                console.warn('Could not save remember me preference:', storageError);
            }
        });
    }

    // Input focus effects
    try {
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
    } catch (inputError) {
        console.warn('Could not add input effects:', inputError);
    }

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
        
        if (password.length < 1) {
            hideLoading();
            showError('A palavra-passe é obrigatória.');
            return;
        }
        
        try {
            // Send login data as JSON
            const loginRequest = {
                username: username,
                password: password
            };
            
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginRequest),
                credentials: 'include'
            });
            
            if (response.ok) {
                let loginResponse;
                try {
                    loginResponse = await response.json();
                } catch (parseError) {
                    console.error('Error parsing response:', parseError);
                    hideLoading();
                    showError('Erro ao processar resposta do servidor.');
                    return;
                }
                
                // Save username if remember me is checked
                if (rememberMeCheckbox && rememberMeCheckbox.checked) {
                    try {
                        localStorage.setItem('rememberedUsername', username);
                    } catch (storageError) {
                        console.warn('Could not save remembered username:', storageError);
                    }
                }
                
                // Store user info in localStorage
                try {
                    localStorage.setItem('userRole', loginResponse.role);
                    localStorage.setItem('username', loginResponse.username);
                    localStorage.setItem('fullName', loginResponse.fullName);
                } catch (storageError) {
                    console.warn('Could not save to localStorage:', storageError);
                }
                
                try {
                    console.log('Login successful for user:', loginResponse.username);
                    console.log('User role:', loginResponse.role);
                    console.log('User full name:', loginResponse.fullName);
                } catch (logError) {
                    console.warn('Could not log login details:', logError);
                }
                
                // Show success message briefly
                showSuccess('Login realizado com sucesso! A redirecionar...');
                
                // Redirect based on user role after a short delay
                setTimeout(() => {
                    try {
                        const redirectUrl = loginResponse.redirectUrl || (loginResponse.role === 'ADMIN' ? '/admin/dashboard' : '/client/dashboard');
                        try {
                            console.log('Redirecting to:', redirectUrl);
                        } catch (logError) {
                            console.warn('Could not log redirect URL:', logError);
                        }
                        window.location.href = redirectUrl;
                    } catch (redirectError) {
                        console.error('Could not redirect:', redirectError);
                        // Fallback redirect
                        try {
                            const fallbackUrl = loginResponse.role === 'ADMIN' ? '/admin/dashboard' : '/client/dashboard';
                            try {
                                console.log('Fallback redirecting to:', fallbackUrl);
                            } catch (logError) {
                                console.warn('Could not log fallback redirect URL:', logError);
                            }
                            window.location.href = fallbackUrl;
                        } catch (fallbackError) {
                            console.error('Fallback redirect also failed:', fallbackError);
                        }
                    }
                }, 1500);
            } else {
                hideLoading();
                let errorMessage = 'Nome de utilizador ou palavra-passe incorretos.';
                try {
                    const errorData = await response.text();
                    if (errorData) {
                        errorMessage = errorData;
                    }
                } catch (parseError) {
                    console.error('Error parsing error response:', parseError);
                }
                showError(errorMessage);
            }
        } catch (error) {
            console.error('Login error:', error);
            hideLoading();
            let errorMessage = 'Erro de conexão. Tente novamente.';
            
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                errorMessage = 'Erro de conexão com o servidor. Verifique a sua ligação à internet.';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            showError(errorMessage);
        }
    });
    
    // Loading functions
    function showLoading() {
        try {
            submitButton.disabled = true;
            buttonText.style.display = 'none';
            buttonLoader.style.display = 'flex';
            loadingOverlay.classList.add('show');
        } catch (loadingError) {
            console.warn('Could not show loading state:', loadingError);
        }
    }
    
    function hideLoading() {
        try {
            submitButton.disabled = false;
            buttonText.style.display = 'inline';
            buttonLoader.style.display = 'none';
            loadingOverlay.classList.remove('show');
        } catch (loadingError) {
            console.warn('Could not hide loading state:', loadingError);
        }
    }
    
    function showError(message) {
        try {
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
        } catch (error) {
            console.warn('Could not show error message:', error);
            alert(message); // Fallback to alert
        }
    }
    
    function showSuccess(message) {
        try {
            // Remove existing messages
            removeMessages();
            
            // Create and show new success message
            const successDiv = document.createElement('div');
            successDiv.className = 'success-message';
            successDiv.textContent = message;
            
            loginForm.insertBefore(successDiv, loginForm.firstChild);
        } catch (error) {
            console.warn('Could not show success message:', error);
            alert(message); // Fallback to alert
        }
    }
    
    function removeMessages() {
        try {
            const existingError = document.querySelector('.error-message');
            const existingSuccess = document.querySelector('.success-message');
            
            if (existingError) {
                existingError.remove();
            }
            if (existingSuccess) {
                existingSuccess.remove();
            }
        } catch (removeError) {
            console.warn('Could not remove messages:', removeError);
        }
    }
    
    // Add shake animation CSS
    try {
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
    } catch (styleError) {
        console.warn('Could not add custom styles:', styleError);
    }
    
    // Add keyboard shortcuts
    try {
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
    } catch (keyboardError) {
        console.warn('Could not add keyboard shortcuts:', keyboardError);
    }
    
    // Add form validation feedback
    function validateForm() {
        try {
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
        } catch (validationError) {
            console.warn('Could not validate form:', validationError);
            return false;
        }
    }
    
    // Add validation on input
    try {
        [usernameInput, passwordInput].forEach(input => {
            input.addEventListener('input', validateForm);
            input.addEventListener('blur', validateForm);
        });
        
        // Initial validation
        validateForm();
    } catch (validationError) {
        console.warn('Could not add validation listeners:', validationError);
    }
    
    // Add particle interaction
    try {
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
    } catch (particleError) {
        console.warn('Could not add particle interactions:', particleError);
    }
    
    // Add smooth scroll to top when page loads
    try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (scrollError) {
        console.warn('Could not scroll to top:', scrollError);
        // Fallback to instant scroll
        window.scrollTo(0, 0);
    }
    
    // Add focus management
    try {
        usernameInput.focus();
    } catch (focusError) {
        console.warn('Could not focus username input:', focusError);
    }
    
    // Add accessibility improvements
    try {
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
             } catch (accessibilityError) {
             console.warn('Could not add accessibility improvements:', accessibilityError);
         }
    } catch (initError) {
        console.error('Failed to initialize login form:', initError);
    }
});  