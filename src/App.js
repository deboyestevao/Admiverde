import React, { useState, useEffect } from 'react';
import './App.css';

// Componente Header com glassmorphism
const Header = ({ scrollToSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo">
          <h2 onClick={() => scrollToSection('home')}>Admiverde</h2>
        </div>
        <nav className="nav">
          <ul>
            <li><button onClick={() => scrollToSection('home')}>Início</button></li>
            <li><button onClick={() => scrollToSection('sobre')}>Sobre</button></li>
            <li><button onClick={() => scrollToSection('servicos')}>Serviços</button></li>
            <li><button onClick={() => scrollToSection('contacto')}>Contacto</button></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

// Componente Hero com design minimalista
const Hero = ({ scrollToSection }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="home" className="hero">
      <div className="hero-background">
        <div 
          className="hero-bg-shape"
          style={{
            transform: `translateY(${scrollY * 0.3}px) rotate(${scrollY * 0.02}deg)`
          }}
        ></div>
        <div 
          className="hero-bg-shape hero-bg-shape-2"
          style={{
            transform: `translateY(${scrollY * -0.2}px) rotate(${scrollY * -0.01}deg)`
          }}
        ></div>
      </div>
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <span>Especialistas desde 1995</span>
          </div>
          <h1 className="hero-title">
            Gestão de Condomínios
            <span className="hero-title-accent">Profissional</span>
          </h1>
          <p className="hero-description">
            Transformamos a gestão do seu condomínio com soluções inovadoras, 
            transparência total e tecnologia de ponta.
          </p>
          <div className="hero-actions">
            <button 
              className="cta-button primary"
              onClick={() => scrollToSection('servicos')}
            >
              Conhecer Serviços
            </button>
            <button 
              className="cta-button secondary"
              onClick={() => scrollToSection('contacto')}
            >
              Falar Connosco
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card">
            <div className="hero-card-icon">🏢</div>
            <h3>80+ Condomínios</h3>
            <p>Geridos com excelência</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Componente Sobre com glassmorphism
const About = () => {
  return (
    <section id="sobre" className="about">
      <div className="container">
        <div className="section-header">
          <h2>Sobre a Admiverde</h2>
          <p>Mais de 25 anos a transformar a gestão condominial</p>
        </div>
        <div className="about-content">
          <div className="about-text">
            <p>
              A <strong>Admiverde</strong> é uma empresa especializada em gestão de condomínios, 
              com mais de 25 anos de experiência no setor. Fundada em 1995 em Almada, 
              a nossa missão é proporcionar uma gestão eficiente, transparente e profissional 
              dos condomínios, garantindo a satisfação dos condóminos e a valorização dos imóveis.
            </p>
            <p>
              Trabalhamos com uma equipa experiente e dedicada, utilizando as melhores 
              práticas do mercado e tecnologia avançada para otimizar todos os processos 
              de gestão condominial na região de Almada e arredores.
            </p>
          </div>
          <div className="about-stats">
            <div className="stat-card">
              <div className="stat-number">25+</div>
              <div className="stat-label">Anos de Experiência</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">80+</div>
              <div className="stat-label">Condomínios Geridos</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">1500+</div>
              <div className="stat-label">Condóminos Satisfeitos</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Componente Serviços com cartões glassmorphism
const Services = () => {
  const services = [
    {
      icon: "🏢",
      title: "Gestão de Edifícios",
      description: "Administração completa de condomínios residenciais e comerciais com controlo total de todas as operações."
    },
    {
      icon: "📊",
      title: "Gestão Financeira",
      description: "Controlo rigoroso das contas, orçamentos, prestações de contas e gestão financeira transparente."
    },
    {
      icon: "💬",
      title: "Comunicação Digital",
      description: "Canais de comunicação eficientes entre administração e condóminos, incluindo plataforma digital."
    },
    {
      icon: "🔧",
      title: "Manutenção",
      description: "Coordenação de obras, manutenção preventiva e corretiva, e gestão de fornecedores."
    },
    {
      icon: "👥",
      title: "Assembleias",
      description: "Organização e gestão de assembleias de condóminos com suporte técnico e jurídico."
    },
    {
      icon: "⚖️",
      title: "Assessoria Jurídica",
      description: "Suporte legal especializado em questões condominiais e representação em tribunais."
    }
  ];

  return (
    <section id="servicos" className="services">
      <div className="container">
        <div className="section-header">
          <h2>Os Nossos Serviços</h2>
          <p>Soluções completas para a gestão do seu condomínio</p>
        </div>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Componente Contacto com formulário elegante
const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Obrigado pelo seu contacto! Entraremos em contacto consigo brevemente.');
  };

  return (
    <section id="contacto" className="contact">
      <div className="container">
        <div className="section-header">
          <h2>Contacte-nos</h2>
          <p>Estamos aqui para ajudar o seu condomínio</p>
        </div>
        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-card">
              <div className="contact-icon">📧</div>
              <h3>Email</h3>
              <p>geral@admiverde.pt</p>
              <p>emergencias@admiverde.pt</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">📞</div>
              <h3>Telefone</h3>
              <p>+351 212 456 789</p>
              <p>+351 912 345 678 (Emergências)</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">📍</div>
              <h3>Morada</h3>
              <p>Rua da Liberdade, 45<br />2800-000 Almada, Portugal</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">🕒</div>
              <h3>Horário</h3>
              <p>Segunda a Sexta: 9h - 18h</p>
              <p>Sábado: 9h - 13h</p>
              <p>Emergências: 24h/7 dias</p>
            </div>
          </div>
          <div className="contact-form">
            <h3>Envie-nos uma mensagem</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input 
                  type="text" 
                  placeholder="Nome completo" 
                  required 
                />
              </div>
              <div className="form-group">
                <input 
                  type="email" 
                  placeholder="Email" 
                  required 
                />
              </div>
              <div className="form-group">
                <input 
                  type="tel" 
                  placeholder="Telefone" 
                />
              </div>
              <div className="form-group">
                <textarea 
                  placeholder="Mensagem" 
                  rows="5" 
                  required
                ></textarea>
              </div>
              <button type="submit" className="submit-button">
                Enviar Mensagem
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

// Componente Footer minimalista
const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Admiverde</h3>
            <p>Especialistas em gestão de condomínios desde 1995.</p>
          </div>
          <div className="footer-section">
            <h4>Serviços</h4>
            <ul>
              <li>Gestão de Edifícios</li>
              <li>Gestão Financeira</li>
              <li>Manutenção</li>
              <li>Assessoria Jurídica</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contacto</h4>
            <p>geral@admiverde.pt</p>
            <p>+351 212 456 789</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Admiverde. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

// Componente principal App
function App() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="App">
      <Header scrollToSection={scrollToSection} />
      <Hero scrollToSection={scrollToSection} />
      <About />
      <Services />
      <Contact />
      <Footer />
    </div>
  );
}

export default App; 