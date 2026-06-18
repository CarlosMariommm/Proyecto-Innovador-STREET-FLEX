import React, { useState, useRef } from 'react';
import { User, X } from 'lucide-react';
import { employeeService } from '../../api/employeeService';
// Usamos el mismo CSS del SupplierModal porque la estructura es igual
import './SupplierModal.css';

const EmployeeModal = ({ isOpen, onClose, onEmployeeAdded }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    single_document: '',
    phone_number: '',
    active: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append('username', formData.username);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('full_name', formData.full_name);
      data.append('single_document', formData.single_document);
      data.append('phone_number', formData.phone_number);
      data.append('active', formData.active);
      
      if (imageFile) {
        data.append('image', imageFile);
      }

      await employeeService.createEmployee(data);
      
      setFormData({
        username: '',
        email: '',
        password: '',
        full_name: '',
        single_document: '',
        phone_number: '',
        active: true
      });
      setImageFile(null);
      setImagePreview(null);
      
      if (onEmployeeAdded) onEmployeeAdded();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar el empleado.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>New Employee</h3>
          <button className="close-modal-btn" onClick={onClose} disabled={loading}>
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

          <div className="image-upload-area" onClick={triggerFileInput} style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              style={{ display: 'none' }} 
              accept="image/*"
            />
            {imagePreview ? (
               <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute', top: 0, left: 0 }} />
            ) : (
              <>
                <div className="upload-avatar">
                  <User size={32} color="#cccccc" />
                </div>
                <div className="upload-text">
                  <p>Drag image here</p>
                  <p>or</p>
                  <button type="button" className="browse-btn" onClick={(e) => { e.stopPropagation(); triggerFileInput(); }}>Browse image</button>
                </div>
              </>
            )}
          </div>
          
          <form className="supplier-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label>Full Name</label>
              <input 
                type="text" 
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter full name" 
                required
              />
            </div>

            <div className="form-row">
              <label>Username</label>
              <input 
                type="text" 
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username" 
                required
              />
            </div>
            
            <div className="form-row">
              <label>Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email" 
                required
              />
            </div>

            <div className="form-row">
              <label>Password</label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password" 
                required
              />
            </div>
            
            <div className="form-row">
              <label>Phone Number</label>
              <input 
                type="text" 
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Enter phone number" 
              />
            </div>

            <div className="form-row">
              <label>Document (ID)</label>
              <input 
                type="text" 
                name="single_document"
                value={formData.single_document}
                onChange={handleChange}
                placeholder="Enter document ID" 
              />
            </div>
            
            <div className="form-row">
              <label>Status</label>
              <div className="type-buttons" style={{ display: 'flex', gap: '10px' }}>
                <button 
                  type="button" 
                  className={`type-btn ${!formData.active ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, active: false }))}
                >
                  Inactive
                </button>
                <button 
                  type="button" 
                  className={`type-btn ${formData.active ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, active: true }))}
                >
                  Active
                </button>
              </div>
            </div>
            
            <div className="modal-actions">
              <button type="button" className="discard-btn" onClick={onClose} disabled={loading}>Discard</button>
              <button type="submit" className="add-supplier-btn" disabled={loading}>
                {loading ? 'Saving...' : 'Add Employee'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;
