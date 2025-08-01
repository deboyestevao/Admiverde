import React, { useState } from 'react';
import '../pages/AdminDashboard.css';

const AdminLayout = ({ children, activeTab, title, breadcrumb }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'users', label: 'Utilizadores', icon: '👥' },
    { id: 'buildings', label: 'Edifícios', icon: '🏢' },
    { id: 'payments', label: 'Pagamentos', icon: '💰' },
    { id: 'reports', label: 'Relatórios', icon: '📈' },
    { id: 'settings', label: 'Configurações', icon: '⚙️' }
  ];

  const handleTabClick = (tabId) => {
    // Navegar para as páginas correspondentes
    switch (tabId) {
      case 'dashboard':
        window.location.href = '/admin/dashboard';
        break;
      case 'users':
        window.location.href = '/admin/users';
        break;
      case 'buildings':
        window.location.href = '/admin/buildings';
        break;
      case 'payments':
        window.location.href = '/admin/payments';
        break;
      case 'reports':
        window.location.href = '/admin/reports';
        break;
      case 'settings':
        window.location.href = '/admin/settings';
        break;
      default:
        break;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🏢</span>
            {!sidebarCollapsed && <h2>Admiverde</h2>}
          </div>
          <button 
            className="collapse-button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`nav-item ${tab.id === activeTab ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.id)}
            >
              <span className="nav-icon">{tab.icon}</span>
              {!sidebarCollapsed && <span className="nav-label">{tab.label}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">A</div>
            {!sidebarCollapsed && (
              <div className="user-details">
                <p className="user-name">Administrador</p>
                <p className="user-role">Admin</p>
              </div>
            )}
          </div>
          <button className="logout-button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16,17 21,12 16,7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            {!sidebarCollapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <header className="content-header">
          <div className="header-left">
            <h1>{title}</h1>
            <p className="breadcrumb">{breadcrumb}</p>
          </div>
          <div className="header-right">
            <button className="notification-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </button>
            <button className="profile-button">
              <div className="profile-avatar">A</div>
            </button>
          </div>
        </header>

        <div className="content-area">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout; 