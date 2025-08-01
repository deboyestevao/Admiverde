import React from 'react';
import AdminLayout from '../components/AdminLayout';
import UserManagement from '../components/UserManagement';

const AdminUsers = () => {
  return (
    <AdminLayout 
      activeTab="users"
      title="Utilizadores"
      breadcrumb="Dashboard / Utilizadores"
    >
      <UserManagement isAdmin={true} />
    </AdminLayout>
  );
};

export default AdminUsers; 