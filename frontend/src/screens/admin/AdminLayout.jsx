import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import './AdminLayout.css';

const AdminLayout = () => {
  const adminInfo = localStorage.getItem('adminInfo');
  
  // Si no hay admin autenticado, redirige al login
  if (!adminInfo) {
    return <Navigate to="/admin/login" replace />;
  }

  const admin = JSON.parse(adminInfo);

  return (
    <div className="admin-layout-container">
      <AdminSidebar />
      <div className="admin-main-content">
        <header className="admin-topbar">
          <div className="admin-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" placeholder="Search for anything..." />
          </div>
          <div className="admin-user-profile">
            <div className="user-info">
              <span className="user-name">{admin.full_name || admin.username}</span>
              <span className="user-role">Administrator</span>
            </div>
            <div className="user-avatar" style={{ overflow: 'hidden' }}>
              {admin.image ? <img src={admin.image} alt="avatar" style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : null}
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </header>
        <main className="admin-page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
