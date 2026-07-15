import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { clientService } from '../../api/clientService';
import './SupplierModal.css'; // Reusing supplier modal CSS

const ClientModal = ({ isOpen, onClose, onClientUpdated, initialData }) => {
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && initialData) {
      setActive(initialData.active !== false); // Default to true if undefined
      setError(null);
    }
  }, [isOpen, initialData]);

  if (!isOpen || !initialData) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await clientService.updateClient(initialData._id, { active });
      if (onClientUpdated) onClientUpdated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating client.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h3>Edit Client Status</h3>
          <button className="close-modal-btn" onClick={onClose} disabled={loading}>
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
          
          <div style={{ marginBottom: '20px' }}>
            <p><strong>Client:</strong> {initialData.full_name || initialData.email}</p>
          </div>

          <form className="supplier-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label>Status</label>
              <div className="type-buttons" style={{ display: 'flex', gap: '10px' }}>
                <button 
                  type="button" 
                  className={`type-btn ${!active ? 'active' : ''}`}
                  onClick={() => setActive(false)}
                >
                  Inactive
                </button>
                <button 
                  type="button" 
                  className={`type-btn ${active ? 'active' : ''}`}
                  onClick={() => setActive(true)}
                >
                  Active
                </button>
              </div>
            </div>
            
            <div className="modal-actions">
              <button type="button" className="discard-btn" onClick={onClose} disabled={loading}>Cancel</button>
              <button type="submit" className="add-supplier-btn" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientModal;
