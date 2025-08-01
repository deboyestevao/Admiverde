import React, { useState, useEffect } from 'react';
import UserManagement from '../components/UserManagement';
import './ClientDashboard.css';

const ClientDashboard = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(true);
  const [userData, setUserData] = useState({
    name: 'João Silva',
    email: 'joao@exemplo.com',
    apartment: 'Apto 3B',
    building: 'Residencial Verde'
  });

  // Simular verificação de primeiro login
  useEffect(() => {
    // Em um cenário real, isto seria verificado na API
    const checkFirstLogin = async () => {
      // Simular delay de verificação
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular que é o primeiro login (password inicial)
      setIsFirstLogin(true);
      setShowPasswordModal(true);
    };

    checkFirstLogin();
  }, []);

  const handlePasswordChanged = () => {
    setIsFirstLogin(false);
    setShowPasswordModal(false);
    // Aqui seria feita a chamada à API para marcar que a password foi alterada
    console.log('Password alterada com sucesso - primeiro login concluído');
  };

  const stats = [
    { label: 'Prestação Mensal', value: '€150,00', status: 'paid' },
    { label: 'Fundo de Reserva', value: '€2.450,00', status: 'info' },
    { label: 'Próxima Assembleia', value: '15 Mar 2024', status: 'warning' },
    { label: 'Manutenções Pendentes', value: '2', status: 'pending' }
  ];

  const recentActivities = [
    { type: 'payment', message: 'Prestação de janeiro paga', date: '2024-01-15', status: 'success' },
    { type: 'maintenance', message: 'Manutenção do elevador agendada', date: '2024-01-12', status: 'info' },
    { type: 'notice', message: 'Nova circular sobre regras do condomínio', date: '2024-01-10', status: 'warning' },
    { type: 'meeting', message: 'Assembleia geral marcada para 15 de março', date: '2024-01-08', status: 'info' }
  ];

  if (isFirstLogin && showPasswordModal) {
    return (
      <div className="client-dashboard">
        <div className="first-login-overlay">
          <div className="first-login-content">
            <div className="welcome-message">
              <h1>Bem-vindo, {userData.name}!</h1>
              <p>Para continuar, é necessário alterar a password inicial definida pelo administrador.</p>
            </div>
            <UserManagement 
              isAdmin={false} 
              showChangePassword={true}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="client-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="user-welcome">
            <h1>Bem-vindo, {userData.name}</h1>
            <p>{userData.apartment} • {userData.building}</p>
          </div>
          <div className="header-actions">
            <button className="notification-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span className="notification-badge">3</span>
            </button>
            <button className="profile-button">
              <div className="profile-avatar">{userData.name.charAt(0)}</div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Stats Grid */}
          <section className="stats-section">
            <h2>Resumo do Condomínio</h2>
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className={`stat-card ${stat.status}`}>
                  <div className="stat-content">
                    <h3>{stat.label}</h3>
                    <p className="stat-value">{stat.value}</p>
                  </div>
                  <div className="stat-icon">
                    {stat.status === 'paid' && '✅'}
                    {stat.status === 'info' && 'ℹ️'}
                    {stat.status === 'warning' && '⚠️'}
                    {stat.status === 'pending' && '⏳'}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Activities */}
          <section className="activities-section">
            <h2>Atividades Recentes</h2>
            <div className="activities-list">
              {recentActivities.map((activity, index) => (
                <div key={index} className={`activity-item ${activity.status}`}>
                  <div className="activity-icon">
                    {activity.type === 'payment' && '💰'}
                    {activity.type === 'maintenance' && '🔧'}
                    {activity.type === 'notice' && '📢'}
                    {activity.type === 'meeting' && '👥'}
                  </div>
                  <div className="activity-content">
                    <p className="activity-message">{activity.message}</p>
                    <span className="activity-date">{activity.date}</span>
                  </div>
                  <div className="activity-status">
                    {activity.status === 'success' && <span className="status-dot success"></span>}
                    {activity.status === 'info' && <span className="status-dot info"></span>}
                    {activity.status === 'warning' && <span className="status-dot warning"></span>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Actions */}
          <section className="actions-section">
            <h2>Ações Rápidas</h2>
            <div className="actions-grid">
              <button className="action-card">
                <div className="action-icon">📄</div>
                <h3>Ver Documentos</h3>
                <p>Aceder a circulares e documentos</p>
              </button>
              <button className="action-card">
                <div className="action-icon">📞</div>
                <h3>Contactar Admin</h3>
                <p>Enviar mensagem ao administrador</p>
              </button>
              <button className="action-card">
                <div className="action-icon">📅</div>
                <h3>Agendar Visita</h3>
                <p>Marcar visita técnica</p>
              </button>
              <button className="action-card">
                <div className="action-icon">⚙️</div>
                <h3>Configurações</h3>
                <p>Gerir preferências da conta</p>
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <UserManagement 
          isAdmin={false} 
          showChangePassword={true}
        />
      )}
    </div>
  );
};

export default ClientDashboard; 