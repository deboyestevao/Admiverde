import React, { useState, useEffect } from 'react';
import './UserManagement.css';

// Componente para criação de conta (Admin)
const CreateUserForm = ({ onClose, onUserCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'CLIENT'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess('Utilizador criado com sucesso!');
      onUserCreated(formData);
      
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError('Erro ao criar utilizador. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Criar Novo Utilizador</h2>
          <button className="close-button" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="user-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-group">
            <label htmlFor="name">Nome Completo</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Nome do utilizador"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="email@exemplo.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password Inicial</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Password definida pelo admin"
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="userType">Tipo de Utilizador</label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              required
            >
              <option value="CLIENT">Cliente</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? (
                <div className="button-loader">
                  <div className="spinner"></div>
                  <span>Criando...</span>
                </div>
              ) : (
                'Criar Utilizador'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componente para alteração de password (Primeiro login)
const ChangePasswordModal = ({ onClose, onPasswordChanged }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'newPassword') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('As passwords não coincidem.');
      return;
    }

    if (passwordStrength < 3) {
      setError('A password deve ter pelo menos 3 critérios de segurança.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onPasswordChanged();
      onClose();
    } catch (err) {
      setError('Erro ao alterar password. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthText = () => {
    const texts = ['Muito fraca', 'Fraca', 'Média', 'Forte', 'Muito forte'];
    return texts[passwordStrength - 1] || '';
  };

  const getPasswordStrengthColor = () => {
    const colors = ['#ff4444', '#ff8800', '#ffaa00', '#00aa00', '#008800'];
    return colors[passwordStrength - 1] || '#666';
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Alterar Password</h2>
          <p className="modal-subtitle">É necessário alterar a password inicial</p>
        </div>

        <form onSubmit={handleSubmit} className="user-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="currentPassword">Password Atual</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              placeholder="Password atual"
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">Nova Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              placeholder="Nova password"
              minLength="8"
            />
            {formData.newPassword && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div 
                    className="strength-fill" 
                    style={{ 
                      width: `${(passwordStrength / 5) * 100}%`,
                      backgroundColor: getPasswordStrengthColor()
                    }}
                  ></div>
                </div>
                <span className="strength-text" style={{ color: getPasswordStrengthColor() }}>
                  {getPasswordStrengthText()}
                </span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Nova Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirmar nova password"
            />
          </div>

          <div className="password-requirements">
            <h4>Requisitos da Password:</h4>
            <ul>
              <li className={formData.newPassword.length >= 8 ? 'met' : ''}>
                Mínimo 8 caracteres
              </li>
              <li className={/[a-z]/.test(formData.newPassword) ? 'met' : ''}>
                Pelo menos uma letra minúscula
              </li>
              <li className={/[A-Z]/.test(formData.newPassword) ? 'met' : ''}>
                Pelo menos uma letra maiúscula
              </li>
              <li className={/[0-9]/.test(formData.newPassword) ? 'met' : ''}>
                Pelo menos um número
              </li>
              <li className={/[^A-Za-z0-9]/.test(formData.newPassword) ? 'met' : ''}>
                Pelo menos um caractere especial
              </li>
            </ul>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? (
                <div className="button-loader">
                  <div className="spinner"></div>
                  <span>Alterando...</span>
                </div>
              ) : (
                'Alterar Password'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componente principal de gestão de utilizadores
const UserManagement = ({ isAdmin = false, showChangePassword = false }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(showChangePassword);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de utilizadores
    setTimeout(() => {
      setUsers([
        { id: 1, name: 'João Silva', email: 'joao@exemplo.com', type: 'CLIENT', status: 'active' },
        { id: 2, name: 'Maria Santos', email: 'maria@exemplo.com', type: 'ADMIN', status: 'active' },
        { id: 3, name: 'Pedro Costa', email: 'pedro@exemplo.com', type: 'CLIENT', status: 'inactive' }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleUserCreated = (newUser) => {
    setUsers([...users, { ...newUser, id: Date.now(), status: 'active' }]);
  };

  const handlePasswordChanged = () => {
    // Lógica para marcar que a password foi alterada
    console.log('Password alterada com sucesso');
  };

  if (isLoading) {
    return (
      <div className="user-management-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>A carregar utilizadores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-management-container">
      {isAdmin && (
        <div className="management-header">
          <h1>Gestão de Utilizadores</h1>
          <button 
            className="create-user-button"
            onClick={() => setShowCreateForm(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Criar Utilizador
          </button>
        </div>
      )}

      <div className="users-grid">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <h3>{user.name}</h3>
              <p className="user-email">{user.email}</p>
              <div className="user-meta">
                <span className={`user-type ${user.type.toLowerCase()}`}>
                  {user.type === 'CLIENT' ? 'Cliente' : 'Administrador'}
                </span>
                <span className={`user-status ${user.status}`}>
                  {user.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
            {isAdmin && (
              <div className="user-actions">
                <button className="action-button edit">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button className="action-button delete">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3,6 5,6 21,6"></polyline>
                    <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                  </svg>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {showCreateForm && (
        <CreateUserForm
          onClose={() => setShowCreateForm(false)}
          onUserCreated={handleUserCreated}
        />
      )}

      {showPasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowPasswordModal(false)}
          onPasswordChanged={handlePasswordChanged}
        />
      )}
    </div>
  );
};

export default UserManagement; 