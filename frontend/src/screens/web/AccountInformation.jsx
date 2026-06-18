import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import { clientService } from '../../api/clientService';
import './AccountInformation.css';

const AccountInformation = () => {
  const { client } = useOutletContext();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: client.full_name || '',
    email: client.email || '',
    phone: client.phone_number || '',
    city: 'New York City',
    address: '100 Main St',
    postalCode: '10001'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log('Saved data:', formData);
    // TODO: implement profile update if needed
  };

  const handleLogout = async () => {
    try {
      await clientService.logout();
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem('clientInfo');
    navigate('/login');
  };

  return (
    <div className="account-info-container">
      <h2 className="section-title">ACCOUNT INFORMATION</h2>
      
      <div className="profile-icon-container">
        {client.image ? (
          <img src={client.image} alt="Profile" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover' }} />
        ) : (
          <UserCircle size={100} strokeWidth={1} color="#ccc" />
        )}
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>NAME</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange}
            readOnly={!isEditing}
            className={isEditing ? 'editable' : ''}
          />
        </div>
        <div className="form-group">
          <label>EMAIL</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange}
            readOnly={!isEditing}
            className={isEditing ? 'editable' : ''}
          />
        </div>
        <div className="form-group">
          <label>PHONE</label>
          <input 
            type="text" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange}
            readOnly={!isEditing}
            className={isEditing ? 'editable' : ''}
          />
        </div>
        <div className="form-group">
          <label>CITY</label>
          <input 
            type="text" 
            name="city" 
            value={formData.city} 
            onChange={handleChange}
            readOnly={!isEditing}
            className={isEditing ? 'editable' : ''}
          />
        </div>
        <div className="form-group">
          <label>ADDRESS</label>
          <input 
            type="text" 
            name="address" 
            value={formData.address} 
            onChange={handleChange}
            readOnly={!isEditing}
            className={isEditing ? 'editable' : ''}
          />
        </div>
        <div className="form-group">
          <label>POSTAL CODE</label>
          <input 
            type="text" 
            name="postalCode" 
            value={formData.postalCode} 
            onChange={handleChange}
            readOnly={!isEditing}
            className={isEditing ? 'editable' : ''}
          />
        </div>
      </div>

      <div className="form-actions">
        {isEditing ? (
          <button className="action-btn" onClick={handleSave}>SAVE</button>
        ) : (
          <button className="action-btn" onClick={() => setIsEditing(true)}>EDIT</button>
        )}
      </div>

      <div className="logout-container">
        <button className="logout-btn" onClick={handleLogout}>LOG OUT</button>
      </div>
    </div>
  );
};

export default AccountInformation;
