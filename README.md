# Portal Admiverde - Gestão de Condomínios

Um portal completo para gestão de condomínios desenvolvido com Spring Boot, Spring Security e React, permitindo que clientes acedam às informações dos seus condomínios e administradores gerem todo o sistema.

## 🚀 Funcionalidades

### Para Clientes
- **Dashboard Personalizado**: Visualização de estatísticas e informações do condomínio
- **Gestão de Apartamentos**: Lista de apartamentos próprios com detalhes
- **Histórico de Pagamentos**: Consulta de pagamentos realizados e pendentes
- **Portal Seguro**: Autenticação JWT com acesso protegido

### Para Administradores
- **Gestão de Prédios**: Adicionar, editar e remover prédios/condomínios
- **Gestão de Apartamentos**: Controlo de apartamentos e proprietários
- **Gestão de Pagamentos**: Criação e controlo de pagamentos
- **Gestão de Utilizadores**: Administração de clientes e contas
- **Dashboard Administrativo**: Estatísticas e relatórios

## 🛠️ Tecnologias Utilizadas

### Backend
- **Spring Boot 3.2.0**: Framework principal
- **Spring Security**: Autenticação e autorização
- **Spring Data JPA**: Persistência de dados
- **MySQL**: Base de dados
- **JWT**: Autenticação stateless
- **Thymeleaf**: Templates HTML

### Frontend
- **HTML5/CSS3**: Interface responsiva
- **JavaScript ES6+**: Interatividade
- **Bootstrap-like**: Design system customizado

## 📋 Pré-requisitos

- Java 17 ou superior
- MySQL 8.0 ou superior
- Maven 3.6 ou superior

## 🔧 Instalação e Configuração

### 1. Clone o Repositório
```bash
git clone <url-do-repositorio>
cd admiverde-portal
```

### 2. Configurar Base de Dados

1. Crie uma base de dados MySQL:
```sql
CREATE DATABASE admiverde_db;
```

2. Configure as credenciais no arquivo `src/main/resources/application.properties`:
```properties
spring.datasource.username=seu_usuario
spring.datasource.password=sua_password
```

### 3. Executar a Aplicação

1. **Compilar e executar com Maven:**
```bash
mvn clean install
mvn spring-boot:run
```

2. **Ou executar o JAR:**
```bash
mvn clean package
java -jar target/admiverde-portal-1.0.0.jar
```

### 4. Aceder à Aplicação

- **Landing Page**: http://localhost:8080
- **Portal Cliente**: http://localhost:8080/client/dashboard (após login)

## 👤 Utilizadores de Exemplo

### Administrador
- **Username**: admin
- **Password**: password
- **Email**: admin@admiverde.pt

### Cliente
- **Username**: cliente1
- **Password**: password
- **Email**: cliente1@email.com

## 📁 Estrutura do Projeto

```
src/
├── main/
│   ├── java/pt/admiverde/
│   │   ├── controller/          # Controladores REST e MVC
│   │   ├── model/              # Entidades JPA
│   │   ├── repository/         # Repositórios Spring Data
│   │   ├── security/           # Configurações de segurança
│   │   ├── service/            # Lógica de negócio
│   │   └── AdmiverdePortalApplication.java
│   └── resources/
│       ├── static/             # Ficheiros estáticos (CSS, JS)
│       ├── templates/          # Templates Thymeleaf
│       ├── application.properties
│       └── data.sql            # Dados de exemplo
```

## 🔐 Segurança

### Endpoints Protegidos
- `/client/**`: Acesso apenas para utilizadores com role CLIENT
- `/admin/**`: Acesso apenas para utilizadores com role ADMIN
- `/api/auth/**`: Endpoints públicos para autenticação

### Autenticação JWT
- Tokens com validade de 24 horas
- Refresh automático de sessão
- Logout seguro com invalidação de token

## 📊 Base de Dados

### Tabelas Principais
- **users**: Utilizadores do sistema (clientes e administradores)
- **buildings**: Prédios/condomínios
- **apartments**: Apartamentos dos clientes
- **payments**: Pagamentos e quotas

### Relacionamentos
- Um utilizador pode ter múltiplos apartamentos
- Um prédio tem múltiplos apartamentos
- Um apartamento tem múltiplos pagamentos

## 🎨 Interface

### Landing Page
- Design moderno e responsivo
- Seções: Home, Sobre Nós, Serviços, Porquê Nós, Contactos
- Modais de login e registo
- Scroll suave entre secções

### Dashboard Cliente
- Estatísticas em tempo real
- Lista de apartamentos
- Histórico de pagamentos
- Interface intuitiva e moderna

## 🔧 Configurações Avançadas

### Variáveis de Ambiente
```bash
export SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/admiverde_db
export SPRING_DATASOURCE_USERNAME=seu_usuario
export SPRING_DATASOURCE_PASSWORD=sua_password
export JWT_SECRET=seu_jwt_secret
```

### Configurações de Produção
1. Altere `spring.jpa.hibernate.ddl-auto` para `validate`
2. Configure um servidor MySQL de produção
3. Ajuste as configurações de logging
4. Configure HTTPS

## 🚀 Deployment

### Docker (Opcional)
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/admiverde-portal-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]
```

### Executar com Docker
```bash
docker build -t admiverde-portal .
docker run -p 8080:8080 admiverde-portal
```

## 📝 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login de utilizador
- `POST /api/auth/register` - Registo de novo cliente

### Cliente
- `GET /api/client/profile` - Perfil do utilizador
- `GET /api/client/apartments` - Apartamentos do cliente
- `GET /api/client/payments` - Pagamentos do cliente
- `GET /api/client/payments/pending` - Pagamentos pendentes

### Administrador
- `GET /api/admin/buildings` - Listar prédios
- `POST /api/admin/buildings` - Criar prédio
- `GET /api/admin/apartments` - Listar apartamentos
- `POST /api/admin/apartments` - Criar apartamento
- `GET /api/admin/payments` - Listar pagamentos
- `POST /api/admin/payments` - Criar pagamento
- `GET /api/admin/users` - Listar utilizadores
- `GET /api/admin/dashboard/stats` - Estatísticas do dashboard

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de Conexão à Base de Dados**
   - Verifique se o MySQL está a executar
   - Confirme as credenciais no `application.properties`

2. **Erro de Compilação**
   - Certifique-se de que tem Java 17 instalado
   - Execute `mvn clean install`

3. **Erro de Autenticação**
   - Verifique se os utilizadores foram criados corretamente
   - Confirme se o JWT_SECRET está configurado

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para a sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit as suas alterações (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

Para questões ou suporte, contacte:
- **Email**: geral@admiverde.pt
- **Telefone**: +351 212 123 456

---

**Desenvolvido com ❤️ pela equipa Admiverde** 