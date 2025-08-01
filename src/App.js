import React, { useState, useEffect } from 'react';
import './App.css';

// Componente Header
const Header = ({ scrollToSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    scrollToSection('home');
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo">
          <h2 onClick={handleLogoClick}>Admiverde</h2>
        </div>
                 <nav className="nav">
          <ul>
            <li><button onClick={() => scrollToSection('home')}>Home</button></li>
            <li><button onClick={() => scrollToSection('sobre')}>Sobre Nós</button></li>
            <li><button onClick={() => scrollToSection('servicos')}>Serviços</button></li>
            <li><button onClick={() => scrollToSection('porque-escolher')}>Porquê Nós</button></li>
            <li><button onClick={() => scrollToSection('contactos')}>Contactos</button></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

// Componente Hero
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
      <div className="hero-background-image">
        <img 
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80" 
          alt="Profissional da Admiverde" 
          className="hero-bg-image"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
            opacity: Math.max(0.3, 1 - scrollY * 0.002)
          }}
        />
        <div className="hero-background-overlay"></div>
      </div>
      <div className="hero-container">
        <div className="hero-content">
          <h1>Admiverde</h1>
          <p className="hero-subtitle">Especialistas em Gestão de Condomínios</p>
          <p className="hero-description">
            Transformamos a gestão do seu condomínio com soluções profissionais, 
            transparentes e eficientes.
          </p>
          <button 
            className="cta-button"
            onClick={() => scrollToSection('sobre')}
          >
            Saber Mais
          </button>
        </div>
      </div>
    </section>
  );
};

// Componente Sobre Nós
const About = () => {
  return (
    <section id="sobre" className="about">
      <div className="container">
        <h2>Sobre Nós</h2>
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
             <div className="stat">
               <h3>25+</h3>
               <p>Anos de Experiência</p>
             </div>
             <div className="stat">
               <h3>80+</h3>
               <p>Condomínios Geridos</p>
             </div>
             <div className="stat">
               <h3>1500+</h3>
               <p>Condóminos Satisfeitos</p>
             </div>
           </div>
        </div>
      </div>
    </section>
  );
};

// Componente Serviços
const Services = () => {
  const services = [
    {
      icon: "building",
      title: "Gestão de Edifícios",
      description: "Administração completa de condomínios residenciais e comerciais com controlo total de todas as operações."
    },
    {
      icon: "chart",
      title: "Gestão de Despesas",
      description: "Controlo rigoroso das contas, orçamentos, prestações de contas e gestão financeira transparente."
    },
    {
      icon: "communication",
      title: "Comunicação",
      description: "Canais de comunicação eficientes entre administração e condóminos, incluindo plataforma digital."
    },
    {
      icon: "maintenance",
      title: "Manutenção",
      description: "Coordenação de obras, manutenção preventiva e corretiva, e gestão de fornecedores."
    },
    {
      icon: "meeting",
      title: "Assembleias",
      description: "Organização e gestão de assembleias de condóminos com suporte técnico e jurídico."
    },
    {
      icon: "legal",
      title: "Assessoria Jurídica",
      description: "Suporte legal especializado em questões condominiais e representação em tribunais."
    }
  ];

  return (
    <section id="servicos" className="services">
      <div className="container">
        <h2>Os Nossos Serviços</h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className={`service-icon service-icon-${service.icon}`}></div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Componente Porquê Escolher
const WhyChoose = () => {
  const reasons = [
    {
      icon: "experience",
      title: "Experiência Comprovada",
      description: "25 anos de experiência no setor da gestão condominial em Almada e arredores."
    },
    {
      icon: "transparency",
      title: "Transparência Total",
      description: "Relatórios mensais detalhados e acesso online a todas as informações do condomínio."
    },
    {
      icon: "technology",
      title: "Tecnologia Avançada",
      description: "Plataforma digital para comunicação, pagamentos e gestão de documentos."
    },
    {
      icon: "support",
      title: "Suporte 24/7",
      description: "Equipa disponível para emergências e questões urgentes a qualquer hora."
    },
    {
      icon: "local",
      title: "Presença Local",
      description: "Escritório em Almada com conhecimento profundo da região e fornecedores locais."
    },
    {
      icon: "certification",
      title: "Certificações",
      description: "Empresa certificada e segurada, cumprindo todas as normas legais do setor."
    }
  ];

  return (
    <section id="porque-escolher" className="why-choose">
      <div className="container">
        <h2>Porquê Escolher a Admiverde</h2>
        <div className="reasons-grid">
          {reasons.map((reason, index) => (
            <div key={index} className="reason-card">
              <div className={`reason-icon reason-icon-${reason.icon}`}></div>
              <h3>{reason.title}</h3>
              <p>{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Componente Contactos
const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Obrigado pelo seu contacto! Entraremos em contacto consigo brevemente.');
  };

  return (
    <section id="contactos" className="contact">
      <div className="container">
        <h2>Contactos</h2>
        <div className="contact-content">
                     <div className="contact-info">
             <div className="contact-item">
               <h3>Email</h3>
               <p>geral@admiverde.pt</p>
               <p>emergencias@admiverde.pt</p>
             </div>
             <div className="contact-item">
               <h3>Telefone</h3>
               <p>+351 212 456 789</p>
               <p>+351 912 345 678 (Emergências)</p>
             </div>
             <div className="contact-item">
               <h3>Morada</h3>
               <p>Rua da Liberdade, 45<br />2800-000 Almada, Portugal</p>
             </div>
             <div className="contact-item">
               <h3>Horário</h3>
               <p>Segunda a Sexta: 9h - 18h</p>
               <p>Sábado: 9h - 13h</p>
               <p>Emergências: 24h/7 dias</p>
             </div>
             <div className="contact-item">
               <h3>Área de Atuação</h3>
               <p>Almada, Seixal, Barreiro, Montijo</p>
               <p>e concelhos limítrofes</p>
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

// Componente Footer
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
              <li>Gestão de Despesas</li>
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
      <WhyChoose />
      <Contact />
      <Footer />
    </div>
  );
}

export default App; 