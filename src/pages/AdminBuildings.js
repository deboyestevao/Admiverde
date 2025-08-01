import React from 'react';
import AdminLayout from '../components/AdminLayout';

const AdminBuildings = () => {
  return (
    <AdminLayout 
      activeTab="buildings"
      title="Edifícios"
      breadcrumb="Dashboard / Edifícios"
    >
      <div className="dashboard-content">
        <h2>Gestão de Edifícios</h2>
        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', margin: '20px 0' }}>
          <h3>Lista de Edifícios</h3>
          <p>Conteúdo da gestão de edifícios...</p>
          <button 
            style={{
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '16px'
            }}
            onClick={() => alert('Funcionalidade de criar edifício')}
          >
            Adicionar Edifício
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBuildings; 