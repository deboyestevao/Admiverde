# Componentes de Gestão de Utilizadores - Admiverde

Este conjunto de componentes React fornece uma interface completa para gestão de utilizadores com design inspirado no macOS, incluindo glassmorphism e efeitos "liquid glass".

## Componentes Incluídos

### 1. UserManagement.js
Componente principal que inclui:
- **CreateUserForm**: Formulário para criação de novos utilizadores (apenas para administradores)
- **ChangePasswordModal**: Modal para alteração de password no primeiro login
- **UserList**: Lista de utilizadores com ações de edição/eliminação

### 2. AdminDashboard.js
Dashboard completo para administradores com:
- Sidebar colapsável
- Navegação por abas
- Integração com o componente UserManagement

### 3. ClientDashboard.js
Dashboard para clientes com:
- Modal de alteração de password no primeiro login
- Interface de gestão de condomínio
- Estatísticas e atividades recentes

## Como Usar

### 1. Dashboard do Administrador

```jsx
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return <AdminDashboard />;
}
```

### 2. Dashboard do Cliente

```jsx
import ClientDashboard from './pages/ClientDashboard';

function App() {
  return <ClientDashboard />;
}
```

### 3. Componente UserManagement Isolado

```jsx
import UserManagement from './components/UserManagement';

// Para administradores (com funcionalidade de criação)
<UserManagement isAdmin={true} />

// Para clientes (apenas visualização)
<UserManagement isAdmin={false} />

// Para mostrar modal de alteração de password
<UserManagement isAdmin={false} showChangePassword={true} />
```

## Funcionalidades

### Para Administradores
- ✅ Criar novos utilizadores
- ✅ Definir password inicial
- ✅ Escolher tipo de utilizador (Cliente/Administrador)
- ✅ Visualizar lista de utilizadores
- ✅ Editar e eliminar utilizadores
- ✅ Dashboard completo com navegação

### Para Clientes
- ✅ Alterar password no primeiro login
- ✅ Verificação de força da password
- ✅ Dashboard personalizado
- ✅ Estatísticas do condomínio
- ✅ Atividades recentes

## Características do Design

### Estilo macOS
- Tipografia SF Pro Display
- Cores e gradientes inspirados no macOS
- Animações suaves e naturais
- Ícones e elementos visuais consistentes

### Glassmorphism
- Efeitos de blur e transparência
- Bordas suaves e arredondadas
- Sombras sutis e profundidade
- Efeitos de hover elegantes

### Responsividade
- Design adaptativo para todos os dispositivos
- Sidebar colapsável em mobile
- Grid responsivo para cartões
- Navegação otimizada para touch

## Estrutura de Ficheiros

```
src/
├── components/
│   ├── UserManagement.js          # Componente principal
│   ├── UserManagement.css         # Estilos do componente
│   └── README.md                  # Esta documentação
├── pages/
│   ├── AdminDashboard.js          # Dashboard do admin
│   ├── AdminDashboard.css         # Estilos do dashboard admin
│   ├── ClientDashboard.js         # Dashboard do cliente
│   └── ClientDashboard.css        # Estilos do dashboard cliente
```

## Personalização

### Cores
As cores principais podem ser alteradas no CSS:
- `#4CAF50` - Verde principal
- `#f5f5f7` - Texto principal
- `#a1a1a6` - Texto secundário
- `#0a0e1a` - Fundo escuro

### Tipografia
A fonte pode ser alterada modificando:
```css
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', 'Roboto', sans-serif;
```

### Efeitos Glassmorphism
Os efeitos de blur podem ser ajustados:
```css
backdrop-filter: blur(30px);
background: rgba(255, 255, 255, 0.03);
```

## Integração com Backend

### API Endpoints Necessários

```javascript
// Criar utilizador
POST /api/users
{
  "name": "string",
  "email": "string", 
  "password": "string",
  "userType": "CLIENT|ADMIN"
}

// Alterar password
PUT /api/users/password
{
  "currentPassword": "string",
  "newPassword": "string"
}

// Listar utilizadores
GET /api/users

// Verificar primeiro login
GET /api/users/me/first-login
```

## Acessibilidade

- Suporte a navegação por teclado
- Alto contraste
- Redução de movimento
- Screen readers
- Focus indicators

## Compatibilidade

- React 18+
- Navegadores modernos
- Mobile responsive
- PWA ready

## Licença

Este código foi desenvolvido para o projeto Admiverde e mantém a coerência visual com o resto da aplicação. 