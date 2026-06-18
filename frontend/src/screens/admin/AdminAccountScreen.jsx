import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../api/adminService';
import './AdminAccountScreen.css';

const AdminAccountScreen = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const data = await adminService.getProfile();
        // data.data o data, según envíe tu backend
        setAdmin(data.data ? data.data : data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, []);

  const handleLogout = async () => {
    try {
      await adminService.logout();
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem('adminInfo');
    navigate('/admin/login');
  };

  if (loading) {
    return <div style={{ padding: '20px', color: '#fff' }}>Cargando perfil...</div>;
  }

  return (
    <div className="admin-account-container">
      <div className="admin-account-header">
        <h1 className="admin-main-title">ACCOUNT</h1>
        <button className="btn-logout" onClick={handleLogout}>LOG OUT</button>
      </div>
      
      <div className="account-content-container">
        <div className="account-avatar-col">
          <div className="account-large-avatar" style={{ overflow: 'hidden' }}>
            {admin?.image ? (
              <img src={admin.image} alt={admin.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="avatar-icon">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            )}
          </div>
        </div>
        
        <div className="account-form-col">
          <div className="account-form-row">
            <div className="account-form-group">
              <label>NAME</label>
              <div className="readonly-input">{admin?.full_name || 'No Admin'}</div>
            </div>
            <div className="account-form-group">
              <label>EMAIL</label>
              <div className="readonly-input">{admin?.email || 'N/A'}</div>
            </div>
          </div>
          
          <div className="account-actions-right">
            <button className="btn-text">EDIT</button>
          </div>
          
          <div className="account-form-row mt-6">
            <div className="account-form-group">
              <label>USERNAME</label>
              <div className="readonly-input">{admin?.username || 'N/A'}</div>
            </div>
            <div className="account-form-group">
              <label>STATUS</label>
              <div className="readonly-input" style={{ color: admin?.active ? 'green' : 'red' }}>
                {admin ? (admin.active ? 'Active' : 'Inactive') : 'N/A'}
              </div>
            </div>
          </div>
          
          <div className="account-form-row">
            <div className="account-form-group full-width">
              <label>ROLE</label>
              <div className="readonly-input">Administrator</div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AdminAccountScreen;
