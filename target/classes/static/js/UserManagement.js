const UserManagement = ({ isAdmin }) => {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterRole, setFilterRole] = React.useState('all');
  const [filterBuilding, setFilterBuilding] = React.useState('all');
  const [filterStatus, setFilterStatus] = React.useState('all');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [usersPerPage] = React.useState(8);
  const [sortBy, setSortBy] = React.useState('name');
  const [sortOrder, setSortOrder] = React.useState('asc');
  const [buildings, setBuildings] = React.useState([]);
  const [formData, setFormData] = React.useState({
    fullName: '',
    address: '',
    floorFraction: '',
    buildingId: '',
    email: '',
    phone: '',
    mobile: '',
    nif: '',
    insurancePolicy: '',
    userType: 'CLIENT'
  });
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  React.useEffect(() => {
    fetchUsers();
    fetchBuildings();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Erro ao carregar utilizadores:', error);
      setError('Erro ao carregar utilizadores');
    } finally {
      setLoading(false);
    }
  };

  const fetchBuildings = async () => {
    try {
      const response = await fetch('/api/admin/buildings');
      if (response.ok) {
        const data = await response.json();
        setBuildings(data);
      }
    } catch (error) {
      console.error('Erro ao carregar edifícios:', error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/register-client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setSuccess(`Condómino registado com sucesso! Username: ${result.username}, Password temporária: ${result.tempPassword}`);
        setShowCreateForm(false);
        setFormData({ 
          fullName: '', 
          address: '', 
          floorFraction: '', 
          buildingId: '', 
          email: '', 
          phone: '', 
          mobile: '', 
          nif: '', 
          insurancePolicy: '', 
          userType: 'CLIENT' 
        });
        fetchUsers();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erro ao registar condómino');
      }
    } catch (error) {
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Tem a certeza que deseja eliminar este utilizador?')) {
      try {
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setSuccess('Utilizador eliminado com sucesso');
          fetchUsers();
        } else {
          setError('Erro ao eliminar utilizador');
        }
      } catch (error) {
        setError('Erro de conexão');
      }
    }
  };

  const handleEditUser = (user) => {
    // Implementar edição de utilizador
    console.log('Editar utilizador:', user);
  };

  // Filtrar e ordenar utilizadores
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role.toLowerCase() === filterRole.toLowerCase();
    const matchesBuilding = filterBuilding === 'all' || user.building?.id?.toString() === filterBuilding;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && user.isActive !== false) ||
                         (filterStatus === 'inactive' && user.isActive === false);
    
    return matchesSearch && matchesRole && matchesBuilding && matchesStatus;
  });

  // Ordenar utilizadores
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'name':
        aValue = a.fullName.toLowerCase();
        bValue = b.fullName.toLowerCase();
        break;
      case 'email':
        aValue = a.email.toLowerCase();
        bValue = b.email.toLowerCase();
        break;
      case 'role':
        aValue = a.role.toLowerCase();
        bValue = b.role.toLowerCase();
        break;
      case 'building':
        aValue = a.building?.name || '';
        bValue = b.building?.name || '';
        break;
      case 'status':
        aValue = a.isActive ? 1 : 0;
        bValue = b.isActive ? 1 : 0;
        break;
      default:
        aValue = a.fullName.toLowerCase();
        bValue = b.fullName.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Paginação
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  // Calcular estatísticas
  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    clients: users.filter(u => u.role === 'CLIENT').length,
    active: users.filter(u => u.isActive !== false).length,
    inactive: users.filter(u => u.isActive === false).length
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterRole('all');
    setFilterBuilding('all');
    setFilterStatus('all');
    setCurrentPage(1);
  };

  if (loading) {
    return React.createElement('div', { className: 'loading-container' },
      React.createElement('div', { className: 'loading-spinner' }),
      React.createElement('p', null, 'A carregar utilizadores...')
    );
  }

  return React.createElement('div', { className: 'dashboard-content' },
    // Stats Overview
    React.createElement('div', { className: 'stats-overview' },
      React.createElement('div', { className: 'stat-card' },
        React.createElement('div', { className: 'stat-icon' },
          React.createElement('svg', { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
            React.createElement('path', { d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' }),
            React.createElement('circle', { cx: '9', cy: '7', r: '4' }),
            React.createElement('path', { d: 'M23 21v-2a4 4 0 0 0-3-3.87' }),
            React.createElement('path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' })
          )
        ),
        React.createElement('div', { className: 'stat-content' },
          React.createElement('h3', null, stats.total),
          React.createElement('p', null, 'Total Utilizadores')
        )
      ),
      React.createElement('div', { className: 'stat-card' },
        React.createElement('div', { className: 'stat-icon' },
          React.createElement('svg', { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
            React.createElement('path', { d: 'M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' }),
            React.createElement('circle', { cx: '8.5', cy: '7', r: '4' }),
            React.createElement('line', { x1: '20', y1: '8', x2: '20', y2: '14' }),
            React.createElement('line', { x1: '23', y1: '11', x2: '17', y2: '11' })
          )
        ),
        React.createElement('div', { className: 'stat-content' },
          React.createElement('h3', null, stats.clients),
          React.createElement('p', null, 'Condóminos')
        )
      ),
      React.createElement('div', { className: 'stat-card' },
        React.createElement('div', { className: 'stat-icon' },
          React.createElement('svg', { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
            React.createElement('path', { d: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' }),
            React.createElement('circle', { cx: '12', cy: '7', r: '4' })
          )
        ),
        React.createElement('div', { className: 'stat-content' },
          React.createElement('h3', null, stats.admins),
          React.createElement('p', null, 'Administradores')
        )
      ),
      React.createElement('div', { className: 'stat-card' },
        React.createElement('div', { className: 'stat-icon' },
          React.createElement('svg', { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
            React.createElement('circle', { cx: '12', cy: '12', r: '10' }),
            React.createElement('path', { d: 'M9 12l2 2 4-4' })
          )
        ),
        React.createElement('div', { className: 'stat-content' },
          React.createElement('h3', null, stats.active),
          React.createElement('p', null, 'Ativos')
        )
      )
    ),

    // Users Section
    React.createElement('div', { className: 'users-section' },
      React.createElement('div', { className: 'section-header' },
        React.createElement('h2', null, 'Lista de Utilizadores'),
      isAdmin && React.createElement('button', {
        className: 'create-user-btn',
        onClick: () => setShowCreateForm(true)
        },
          React.createElement('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
            React.createElement('line', { x1: '12', y1: '5', x2: '12', y2: '19' }),
            React.createElement('line', { x1: '5', y1: '12', x2: '19', y2: '12' })
          ),
          'Criar Utilizador'
        )
      ),

      // Advanced Filters
      React.createElement('div', { className: 'advanced-filters' },
        React.createElement('div', { className: 'filters-row' },
          React.createElement('div', { className: 'search-box' },
            React.createElement('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
              React.createElement('circle', { cx: '11', cy: '11', r: '8' }),
              React.createElement('path', { d: 'M21 21l-4.35-4.35' })
            ),
            React.createElement('input', {
              type: 'text',
              placeholder: 'Pesquisar por nome, email ou username...',
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value)
            })
          ),
          React.createElement('div', { className: 'filter-group' },
            React.createElement('select', {
              className: 'filter-select',
              value: filterRole,
              onChange: (e) => setFilterRole(e.target.value)
            },
              React.createElement('option', { value: 'all' }, 'Todos os Roles'),
              React.createElement('option', { value: 'ADMIN' }, 'Administradores'),
              React.createElement('option', { value: 'CLIENT' }, 'Condóminos')
            )
          ),
          React.createElement('div', { className: 'filter-group' },
            React.createElement('select', {
              className: 'filter-select',
              value: filterBuilding,
              onChange: (e) => setFilterBuilding(e.target.value)
            },
              React.createElement('option', { value: 'all' }, 'Todos os Edifícios'),
              ...buildings.map(building => 
                React.createElement('option', { key: building.id, value: building.id.toString() }, building.name)
              )
            )
          ),
          React.createElement('div', { className: 'filter-group' },
            React.createElement('select', {
              className: 'filter-select',
              value: filterStatus,
              onChange: (e) => setFilterStatus(e.target.value)
            },
              React.createElement('option', { value: 'all' }, 'Todos os Estados'),
              React.createElement('option', { value: 'active' }, 'Ativos'),
              React.createElement('option', { value: 'inactive' }, 'Inativos')
            )
          ),
          React.createElement('button', {
            className: 'clear-filters-btn',
            onClick: clearFilters
          },
            React.createElement('svg', { width: '14', height: '14', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
              React.createElement('line', { x1: '18', y1: '6', x2: '6', y2: '18' }),
              React.createElement('line', { x1: '6', y1: '6', x2: '18', y2: '18' })
            ),
            'Limpar Filtros'
          )
        )
      ),

      // Results Summary
      React.createElement('div', { className: 'results-summary' },
        React.createElement('span', { className: 'results-count' }, 
          `${sortedUsers.length} utilizador${sortedUsers.length !== 1 ? 'es' : ''} encontrado${sortedUsers.length !== 1 ? 's' : ''}`
        ),
        React.createElement('div', { className: 'sort-controls' },
          React.createElement('span', { className: 'sort-label' }, 'Ordenar por:'),
          React.createElement('select', {
            className: 'sort-select',
            value: sortBy,
            onChange: (e) => setSortBy(e.target.value)
          },
            React.createElement('option', { value: 'name' }, 'Nome'),
            React.createElement('option', { value: 'email' }, 'Email'),
            React.createElement('option', { value: 'role' }, 'Role'),
            React.createElement('option', { value: 'building' }, 'Edifício'),
            React.createElement('option', { value: 'status' }, 'Estado')
          ),
          React.createElement('button', {
            className: `sort-btn ${sortOrder === 'asc' ? 'asc' : 'desc'}`,
            onClick: () => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
          },
            React.createElement('svg', { width: '14', height: '14', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
              sortOrder === 'asc' ? 
                React.createElement('polyline', { points: '18,15 12,9 6,15' }) :
                React.createElement('polyline', { points: '6,9 12,15 18,9' })
            )
          )
        )
      ),

      // Messages
      error && React.createElement('div', { className: 'error-message' }, error),
    success && React.createElement('div', { className: 'success-message' }, success),

      // Users Table
      React.createElement('div', { className: 'users-table-container' },
        React.createElement('table', { className: 'users-table' },
          React.createElement('thead', null,
            React.createElement('tr', null,
              React.createElement('th', { 
                className: 'sortable',
                onClick: () => handleSort('name')
              },
                'Nome',
                sortBy === 'name' && React.createElement('span', { className: `sort-indicator ${sortOrder}` }, '▼')
              ),
              React.createElement('th', { 
                className: 'sortable',
                onClick: () => handleSort('email')
              },
                'Email',
                sortBy === 'email' && React.createElement('span', { className: `sort-indicator ${sortOrder}` }, '▼')
              ),
              React.createElement('th', { 
                className: 'sortable',
                onClick: () => handleSort('role')
              },
                'Role',
                sortBy === 'role' && React.createElement('span', { className: `sort-indicator ${sortOrder}` }, '▼')
              ),
              React.createElement('th', { 
                className: 'sortable',
                onClick: () => handleSort('building')
              },
                'Edifício',
                sortBy === 'building' && React.createElement('span', { className: `sort-indicator ${sortOrder}` }, '▼')
              ),
              React.createElement('th', { 
                className: 'sortable',
                onClick: () => handleSort('status')
              },
                'Estado',
                sortBy === 'status' && React.createElement('span', { className: `sort-indicator ${sortOrder}` }, '▼')
              ),
              React.createElement('th', null, 'Ações')
            )
          ),
          React.createElement('tbody', null,
            currentUsers.length > 0 ? currentUsers.map(user => 
              React.createElement('tr', { key: user.id, className: 'user-row' },
                React.createElement('td', { className: 'user-name' },
                  React.createElement('div', { className: 'user-info-cell' },
                    React.createElement('div', { className: 'user-avatar' },
                      user.fullName.charAt(0).toUpperCase()
                    ),
                    React.createElement('div', { className: 'user-details' },
                      React.createElement('span', { className: 'name' }, user.fullName),
                      user.username && React.createElement('span', { className: 'username' }, `@${user.username}`)
                    )
                  )
                ),
                React.createElement('td', { className: 'user-email' }, user.email),
                React.createElement('td', { className: 'user-role' },
                  React.createElement('span', { 
                    className: `role-badge ${user.role.toLowerCase()}` 
                  }, user.role === 'ADMIN' ? 'Administrador' : 'Condómino')
                ),
                React.createElement('td', { className: 'user-building' }, 
                  user.building?.name || '-'
                ),
                React.createElement('td', { className: 'user-status' },
                  React.createElement('span', { 
                    className: `status-badge ${user.isActive !== false ? 'active' : 'inactive'}` 
                  }, user.isActive !== false ? 'Ativo' : 'Inativo')
                ),
                React.createElement('td', { className: 'user-actions' },
                  React.createElement('button', {
                    className: 'edit-btn',
                    onClick: () => handleEditUser(user)
                  },
                    React.createElement('svg', { width: '14', height: '14', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
                      React.createElement('path', { d: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' }),
                      React.createElement('path', { d: 'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' })
                    ),
                    'Editar'
                  ),
                  React.createElement('button', {
                    className: 'delete-btn',
                    onClick: () => handleDeleteUser(user.id)
                  },
                    React.createElement('svg', { width: '14', height: '14', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
                      React.createElement('polyline', { points: '3,6 5,6 21,6' }),
                      React.createElement('path', { d: 'M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2' })
                    ),
                    'Eliminar'
                  )
                )
              )
            ) : React.createElement('tr', null,
              React.createElement('td', { colSpan: '6', className: 'empty-state' },
                React.createElement('div', { className: 'empty-content' },
                  React.createElement('svg', { width: '48', height: '48', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
                    React.createElement('path', { d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' }),
                    React.createElement('circle', { cx: '9', cy: '7', r: '4' }),
                    React.createElement('path', { d: 'M23 21v-2a4 4 0 0 0-3-3.87' }),
                    React.createElement('path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' })
                  ),
                  React.createElement('h3', null, 'Nenhum utilizador encontrado'),
                  React.createElement('p', null, 'Não foram encontrados utilizadores com os critérios de pesquisa.')
                )
              )
            )
          )
        )
      ),

      // Pagination
      totalPages > 1 && React.createElement('div', { className: 'pagination' },
        React.createElement('button', {
          className: 'pagination-btn',
          disabled: currentPage === 1,
          onClick: () => setCurrentPage(currentPage - 1)
        },
          React.createElement('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
            React.createElement('polyline', { points: '15,18 9,12 15,6' })
          ),
          'Anterior'
        ),
        React.createElement('div', { className: 'page-numbers' },
          Array.from({ length: totalPages }, (_, i) => i + 1).map(page => 
            React.createElement('button', {
              key: page,
              className: `page-btn ${currentPage === page ? 'active' : ''}`,
              onClick: () => setCurrentPage(page)
            }, page)
          )
        ),
        React.createElement('button', {
          className: 'pagination-btn',
          disabled: currentPage === totalPages,
          onClick: () => setCurrentPage(currentPage + 1)
        },
          'Próximo',
          React.createElement('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
            React.createElement('polyline', { points: '9,18 15,12 9,6' })
          )
        )
      )
    ),

    // Create User Modal
    showCreateForm && React.createElement('div', { className: 'modal-overlay' },
      React.createElement('div', { className: 'modal' },
        React.createElement('div', { className: 'modal-header' },
          React.createElement('h3', null, 'Registar Novo Condómino'),
          React.createElement('button', {
            className: 'close-btn',
            onClick: () => setShowCreateForm(false)
          }, '×')
        ),
        React.createElement('form', { onSubmit: handleCreateUser, className: 'create-user-form' },
          React.createElement('div', { className: 'form-section' },
            React.createElement('h4', { className: 'section-title' }, 'Informações Pessoais'),
            React.createElement('div', { className: 'form-row' },
          React.createElement('div', { className: 'form-group' },
                React.createElement('label', null, 'Nome Completo *'),
            React.createElement('input', {
              type: 'text',
              name: 'fullName',
              value: formData.fullName,
              onChange: handleInputChange,
                  placeholder: 'Nome completo do condómino',
              required: true
            })
          ),
              React.createElement('div', { className: 'form-group' },
                React.createElement('label', null, 'Número de Contribuinte (NIF) *'),
                React.createElement('input', {
                  type: 'text',
                  name: 'nif',
                  value: formData.nif,
                  onChange: handleInputChange,
                  placeholder: 'Ex: 123456789',
                  required: true,
                  maxLength: 9
                })
              )
            )
          ),
          
          React.createElement('div', { className: 'form-section' },
            React.createElement('h4', { className: 'section-title' }, 'Morada e Localização'),
            React.createElement('div', { className: 'form-row' },
              React.createElement('div', { className: 'form-group full-width' },
                React.createElement('label', null, 'Morada *'),
                React.createElement('input', {
                  type: 'text',
                  name: 'address',
                  value: formData.address,
                  onChange: handleInputChange,
                  placeholder: 'Rua, número, código postal, localidade',
                  required: true
                })
              )
            ),
            React.createElement('div', { className: 'form-row' },
              React.createElement('div', { className: 'form-group' },
                React.createElement('label', null, 'Prédio *'),
                React.createElement('select', {
                  name: 'buildingId',
                  value: formData.buildingId,
                  onChange: handleInputChange,
                  required: true
                },
                  React.createElement('option', { value: '' }, 'Selecionar prédio'),
                  ...buildings.map(building => 
                    React.createElement('option', { key: building.id, value: building.id.toString() }, building.name)
                  )
                )
              ),
              React.createElement('div', { className: 'form-group' },
                React.createElement('label', null, 'Andar + Fração *'),
                React.createElement('input', {
                  type: 'text',
                  name: 'floorFraction',
                  value: formData.floorFraction,
                  onChange: handleInputChange,
                  placeholder: 'Ex: 2.º Esq., 3.º Frente, Garagem',
                  required: true
                })
              )
            )
          ),
          
          React.createElement('div', { className: 'form-section' },
            React.createElement('h4', { className: 'section-title' }, 'Contactos (Opcionais)'),
            React.createElement('div', { className: 'form-row' },
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', null, 'Email'),
            React.createElement('input', {
              type: 'email',
              name: 'email',
              value: formData.email,
              onChange: handleInputChange,
                  placeholder: 'email@exemplo.com'
            })
          ),
          React.createElement('div', { className: 'form-group' },
                React.createElement('label', null, 'Telefone Fixo'),
                React.createElement('input', {
                  type: 'tel',
                  name: 'phone',
                  value: formData.phone,
                  onChange: handleInputChange,
                  placeholder: 'Ex: 213456789'
                })
              )
            ),
            React.createElement('div', { className: 'form-row' },
              React.createElement('div', { className: 'form-group' },
                React.createElement('label', null, 'Telemóvel'),
            React.createElement('input', {
                  type: 'tel',
                  name: 'mobile',
                  value: formData.mobile,
              onChange: handleInputChange,
                  placeholder: 'Ex: 912345678'
            })
          ),
          React.createElement('div', { className: 'form-group' },
                React.createElement('label', null, 'Apólice de Seguro *'),
                React.createElement('input', {
                  type: 'text',
                  name: 'insurancePolicy',
                  value: formData.insurancePolicy,
                  onChange: handleInputChange,
                  placeholder: 'Número da apólice de seguro',
                  required: true
                })
              )
            )
          ),
          
          React.createElement('div', { className: 'form-actions' },
            React.createElement('button', {
              type: 'button',
              className: 'cancel-btn',
              onClick: () => setShowCreateForm(false)
            }, 'Cancelar'),
            React.createElement('button', {
              type: 'submit',
              className: 'submit-btn',
              disabled: loading
            }, loading ? 'A registar...' : 'Registar Condómino')
          )
        )
      )
    )
  );
}; 