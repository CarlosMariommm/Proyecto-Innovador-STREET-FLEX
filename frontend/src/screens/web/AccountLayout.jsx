import React from 'react';
import { Outlet, NavLink, Navigate, useLocation } from 'react-router-dom';
import Header from '../../components/web/Header';
import Sidebar from '../../components/web/Sidebar';
import { useAuth } from '../../hooks/useAuth';
import './AccountLayout.css';

const AccountLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: '100px', textAlign: 'center' }}>Loading account details...</div>;
  }

  if (!user || user.role !== 'client') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const client = user;

  return (
    <div className="account-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      
      <main className="account-layout">
        <div className="account-sidebar-left">
          <div className="account-hero-content">
            <h1 className="account-title">Hi, {client.full_name?.split(' ')[0] || client.username}</h1>
            <p className="account-subtitle">
              You can manage your account here. Please, choose what you'd like to do.
            </p>
            
            <nav className="account-nav">
              <NavLink 
                to="/account/information" 
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                ACCOUNT INFORMATION
              </NavLink>
              <NavLink 
                to="/account/saved"
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                SAVED ITEMS
              </NavLink>
              <NavLink 
                to="/account/orders"
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                ORDER HISTORY
              </NavLink>
            </nav>
          </div>
          <div className="account-hero-overlay"></div>
          <img 
            src="https://images.unsplash.com/photo-1511556820780-d912e42b4980?q=80&w=1000&auto=format&fit=crop" 
            alt="Account background" 
            className="account-bg-img"
          />
        </div>
        
        <div className="account-content-right">
          <Outlet context={{ client }} />
        </div>
      </main>
    </div>
  );
};

export default AccountLayout;
