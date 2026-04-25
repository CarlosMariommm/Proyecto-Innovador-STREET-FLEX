import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminAccountScreen.css';

const AdminAccountScreen = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/admin/login');
  };

  return (
    <div className="admin-account-container">
      <div className="admin-account-header">
        <h1 className="admin-main-title">ACCOUNT</h1>
        <button className="btn-logout" onClick={handleLogout}>LOG OUT</button>
      </div>
      
      <div className="account-content-container">
        <div className="account-avatar-col">
          <div className="account-large-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="avatar-icon">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        </div>
        
        <div className="account-form-col">
          <div className="account-form-row">
            <div className="account-form-group">
              <label>NAME</label>
              <div className="readonly-input">Ema</div>
            </div>
            <div className="account-form-group">
              <label>EMAIL</label>
              <div className="readonly-input">ema@gmail.com</div>
            </div>
          </div>
          
          <div className="account-actions-right">
            <button className="btn-text">EDIT</button>
          </div>
          
          <div className="account-form-row mt-6">
            <div className="account-form-group">
              <label>CITY</label>
              <div className="readonly-input">New York City</div>
            </div>
            <div className="account-form-group">
              <label>PHONE</label>
              <div className="readonly-input">+1 (249) 942-8320</div>
            </div>
          </div>
          
          <div className="account-form-row">
            <div className="account-form-group full-width">
              <label>ADDRESS</label>
              <div className="readonly-input">100 Main St</div>
            </div>
          </div>
          
          <div className="account-form-row">
            <div className="account-form-group half-width">
              <label>POSTAL CODE</label>
              <div className="readonly-input">10001</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAccountScreen;
