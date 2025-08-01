// Dashboard JavaScript

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    loadDashboardData();
});

// Check if user is authenticated
async function checkAuthStatus() {
    try {
        const response = await fetch('/api/auth/check-auth', {
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.authenticated && data.role === 'CLIENT') {
                console.log('Client authenticated:', data.fullName);
                // Update user info in localStorage
                localStorage.setItem('userRole', data.role);
                localStorage.setItem('username', data.username);
                localStorage.setItem('fullName', data.fullName);
            } else {
                console.log('User not client, redirecting to login');
                window.location.href = '/login';
            }
        } else {
            console.log('Not authenticated, redirecting to login');
            window.location.href = '/login';
        }
    } catch (error) {
        console.error('Authentication check failed:', error);
        window.location.href = '/login';
    }
}

// Load dashboard data
async function loadDashboardData() {
    try {
        // Load user profile
        const profileResponse = await makeAuthenticatedRequest('/api/client/profile');
        if (profileResponse.ok) {
            const profile = await profileResponse.json();
            updateWelcomeMessage(profile.fullName);
        }

        // Load apartments
        const apartmentsResponse = await makeAuthenticatedRequest('/api/client/apartments');
        if (apartmentsResponse.ok) {
            const apartments = await apartmentsResponse.json();
            updateApartmentsStats(apartments);
            displayApartments(apartments);
        }

        // Load payments
        const paymentsResponse = await makeAuthenticatedRequest('/api/client/payments');
        if (paymentsResponse.ok) {
            const payments = await paymentsResponse.json();
            updatePaymentsStats(payments);
            displayRecentPayments(payments);
        }

    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        showError('Erro ao carregar dados do dashboard');
    }
}

// Update welcome message
function updateWelcomeMessage(fullName) {
    const welcomeTitle = document.querySelector('.welcome-section h1');
    if (welcomeTitle) {
        welcomeTitle.textContent = `Bem-vindo, ${fullName}`;
    }
}

// Update apartments statistics
function updateApartmentsStats(apartments) {
    const totalApartments = document.getElementById('totalApartments');
    if (totalApartments) {
        totalApartments.textContent = apartments.length;
    }
}

// Update payments statistics
function updatePaymentsStats(payments) {
    const pendingPayments = document.getElementById('pendingPayments');
    const totalAmount = document.getElementById('totalAmount');
    const paidPayments = document.getElementById('paidPayments');

    const pending = payments.filter(p => p.status === 'PENDING').length;
    const overdue = payments.filter(p => p.status === 'OVERDUE').length;
    const paid = payments.filter(p => p.status === 'PAID').length;

    const totalPendingAmount = payments
        .filter(p => p.status === 'PENDING' || p.status === 'OVERDUE')
        .reduce((sum, p) => sum + parseFloat(p.amount), 0);

    if (pendingPayments) {
        pendingPayments.textContent = pending + overdue;
    }
    if (totalAmount) {
        totalAmount.textContent = `€${totalPendingAmount.toFixed(2)}`;
    }
    if (paidPayments) {
        paidPayments.textContent = paid;
    }
}

// Display apartments list
function displayApartments(apartments) {
    const apartmentsList = document.getElementById('myApartments');
    if (!apartmentsList) return;

    if (apartments.length === 0) {
        apartmentsList.innerHTML = `
            <div class="empty-state">
                <div class="icon">🏠</div>
                <h3>Nenhum apartamento encontrado</h3>
                <p>Contacte a administração para mais informações.</p>
            </div>
        `;
        return;
    }

    const apartmentsHTML = apartments.slice(0, 3).map(apartment => `
        <div class="apartment-item">
            <div class="apartment-info">
                <h4>Apartamento ${apartment.number}</h4>
                <p>${apartment.building.name} - ${apartment.building.address}</p>
            </div>
            <div class="apartment-details">
                <div class="fee">€${apartment.monthlyFee}</div>
                <div class="details">Quota mensal</div>
            </div>
        </div>
    `).join('');

    apartmentsList.innerHTML = apartmentsHTML;
}

// Display recent payments
function displayRecentPayments(payments) {
    const paymentsList = document.getElementById('recentPayments');
    if (!paymentsList) return;

    if (payments.length === 0) {
        paymentsList.innerHTML = `
            <div class="empty-state">
                <div class="icon">💰</div>
                <h3>Nenhum pagamento encontrado</h3>
                <p>Não há pagamentos registados.</p>
            </div>
        `;
        return;
    }

    const recentPayments = payments.slice(0, 5);
    const paymentsHTML = recentPayments.map(payment => {
        const statusClass = payment.status.toLowerCase();
        const statusText = getStatusText(payment.status);
        const dueDate = new Date(payment.dueDate).toLocaleDateString('pt-PT');
        
        return `
            <div class="payment-item">
                <div class="payment-info">
                    <h4>${payment.description}</h4>
                    <p>Vencimento: ${dueDate}</p>
                </div>
                <div class="payment-amount">
                    <div class="amount">€${payment.amount}</div>
                    <div class="status ${statusClass}">${statusText}</div>
                </div>
            </div>
        `;
    }).join('');

    paymentsList.innerHTML = paymentsHTML;
}

// Get status text in Portuguese
function getStatusText(status) {
    switch (status) {
        case 'PENDING':
            return 'Pendente';
        case 'PAID':
            return 'Pago';
        case 'OVERDUE':
            return 'Vencido';
        case 'CANCELLED':
            return 'Cancelado';
        default:
            return status;
    }
}

// Load apartments page
function loadApartments() {
    // This would load a dedicated apartments page
    // For now, we'll just show an alert
    alert('Funcionalidade de apartamentos em desenvolvimento');
}

// Load payments page
function loadPayments() {
    // This would load a dedicated payments page
    // For now, we'll just show an alert
    alert('Funcionalidade de pagamentos em desenvolvimento');
}

// Load profile page
function loadProfile() {
    // This would load a dedicated profile page
    // For now, we'll just show an alert
    alert('Funcionalidade de perfil em desenvolvimento');
}

// Make authenticated request
async function makeAuthenticatedRequest(url, options = {}) {
    const defaultOptions = {
        credentials: 'include', // Include cookies for session
        headers: {
            'Content-Type': 'application/json',
        },
        ...options
    };
    
    return fetch(url, defaultOptions);
}

// Logout function
async function logout() {
    try {
        await fetch('/api/auth/logout', {
            method: 'GET',
            credentials: 'include'
        });
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        // Clear localStorage
        localStorage.removeItem('userRole');
        localStorage.removeItem('username');
        localStorage.removeItem('fullName');
        // Redirect to home
        window.location.href = '/';
    }
}

// Show error message
function showError(message) {
    // You can implement a proper error notification system here
    console.error(message);
    alert(message);
}

// Add logout function to global scope
window.logout = logout; 