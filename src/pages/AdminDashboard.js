import React from 'react';
import AdminLayout from '../components/AdminLayout';

const AdminDashboard = () => {
  return (
    <AdminLayout 
      activeTab="dashboard"
      title="Dashboard"
      breadcrumb="Dashboard / Principal"
    >
      <div className="dashboard-content">
        <h2>Dashboard Principal</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
          <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            <h3>Utilizadores Ativos</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>156</p>
          </div>
          <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            <h3>Edifícios Geridos</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>23</p>
          </div>
          <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            <h3>Pagamentos Pendentes</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF9800' }}>12</p>
          </div>
          <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            <h3>Receita Mensal</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>€45.230</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard; 