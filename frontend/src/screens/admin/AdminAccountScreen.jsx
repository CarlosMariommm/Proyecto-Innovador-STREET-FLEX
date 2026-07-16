import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../api/adminService';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';
import './AdminAccountScreen.css';

const AdminAccountScreen = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  
  const [admin, setAdmin] = useState(user || null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.full_name || '');
  const [newUsername, setNewUsername] = useState(user?.username || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const data = await adminService.getProfile();
        const profile = data.data ? data.data : data;
        if (profile && profile.email) {
            setAdmin(profile);
            setNewName(profile.full_name || '');
            setNewUsername(profile.username || '');
        }
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
    // Forzar recarga de página para limpiar AuthContext
    window.location.href = '/admin/login';
  };

  const handleEditClick = () => {
    setNewName(admin?.full_name || '');
    setNewUsername(admin?.username || '');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewName(admin?.full_name || '');
    setNewUsername(admin?.username || '');
  };

  const handleSave = async () => {
    if (!newName.trim()) {
      showToast('Name cannot be empty.', 'error');
      return;
    }
    try {
      setSaving(true);
      const data = await adminService.updateProfile({ 
        full_name: newName.trim(), 
        username: newUsername.trim() 
      });
      const updated = data.data ? data.data : data;
      setAdmin(updated);
      setIsEditing(false);
      showToast('Name updated successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to update name.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading && !admin) {
    return <div style={{ padding: '20px', color: 'var(--primary-color)' }}>Loading profile...</div>;
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
              {isEditing ? (
                <input
                  type="text"
                  className="account-edit-input"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  autoFocus
                />
              ) : (
                <div className="readonly-input">{admin?.full_name || 'No Admin'}</div>
              )}
            </div>
            <div className="account-form-group">
              <label>USERNAME</label>
              {isEditing ? (
                <input
                  type="text"
                  className="account-edit-input"
                  value={newUsername}
                  onChange={e => setNewUsername(e.target.value)}
                />
              ) : (
                <div className="readonly-input">{admin?.username || 'N/A'}</div>
              )}
            </div>
          </div>
          
          <div className="account-form-row">
            <div className="account-form-group">
              <label>EMAIL</label>
              <div className="readonly-input">{admin?.email || 'N/A'}</div>
            </div>
            <div className="account-form-group">
              <label>ROLE</label>
              <div className="readonly-input">Administrator</div>
            </div>
          </div>

          <div className="account-actions-right">
            {isEditing ? (
              <>
                <button className="btn-text" onClick={handleCancel} disabled={saving}>CANCEL</button>
                <button className="btn-save" onClick={handleSave} disabled={saving}>
                  {saving ? 'SAVING...' : 'SAVE'}
                </button>
              </>
            ) : (
              <button className="btn-text" onClick={handleEditClick}>EDIT</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAccountScreen;
