const AdminLayout = ({ children, activeTab, title, breadcrumb }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

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

  return React.createElement('div', { className: 'admin-dashboard' },
    // Sidebar
    React.createElement('aside', { className: `sidebar ${sidebarCollapsed ? 'collapsed' : ''}` },
      React.createElement('div', { className: 'sidebar-header' },
        React.createElement('div', { className: 'logo' },
          React.createElement('span', { className: 'logo-icon' }, '🏢'),
          !sidebarCollapsed && React.createElement('h2', null, 'Admiverde')
        ),
        React.createElement('button', {
          className: 'collapse-button',
          onClick: () => setSidebarCollapsed(!sidebarCollapsed)
        },
          React.createElement('svg', { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
            React.createElement('polyline', { points: '15,18 9,12 15,6' })
          )
        )
      ),
      React.createElement('nav', { className: 'sidebar-nav' },
        tabs.map(tab => React.createElement('button', {
          key: tab.id,
          className: `nav-item ${tab.id === activeTab ? 'active' : ''}`,
          onClick: () => handleTabClick(tab.id)
        },
          React.createElement('span', { className: 'nav-icon' }, tab.icon),
          !sidebarCollapsed && React.createElement('span', { className: 'nav-label' }, tab.label)
        ))
      ),
      React.createElement('div', { className: 'sidebar-footer' },
        React.createElement('div', { className: 'user-info' },
          React.createElement('div', { className: 'user-avatar' }, 'A'),
          !sidebarCollapsed && React.createElement('div', { className: 'user-details' },
            React.createElement('p', { className: 'user-name' }, 'Administrador'),
            React.createElement('p', { className: 'user-role' }, 'Admin')
          )
        ),
        React.createElement('button', { className: 'logout-button' },
          React.createElement('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
            React.createElement('path', { d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' }),
            React.createElement('polyline', { points: '16,17 21,12 16,7' }),
            React.createElement('line', { x1: '21', y1: '12', x2: '9', y2: '12' })
          ),
          !sidebarCollapsed && React.createElement('span', null, 'Sair')
        )
      )
    ),
    // Main content
    React.createElement('main', { className: 'main-content' },
      React.createElement('header', { className: 'content-header' },
        React.createElement('div', { className: 'header-left' },
          React.createElement('h1', null, title),
          React.createElement('p', { className: 'breadcrumb' }, breadcrumb)
        ),
        React.createElement('div', { className: 'header-right' },
          React.createElement('button', { className: 'notification-button' },
            React.createElement('svg', { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
              React.createElement('path', { d: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9' }),
              React.createElement('path', { d: 'M13.73 21a2 2 0 0 1-3.46 0' })
            )
          ),
          React.createElement('button', { className: 'profile-button' },
            React.createElement('div', { className: 'profile-avatar' }, 'A')
          )
        )
      ),
      React.createElement('div', { className: 'content-area' }, children)
    )
  );
}; 