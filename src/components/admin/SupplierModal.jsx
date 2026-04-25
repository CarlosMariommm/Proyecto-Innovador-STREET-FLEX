import React from 'react';
import { User, X } from 'lucide-react';
import './SupplierModal.css';

const SupplierModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>New Supplier</h3>
          <button className="close-modal-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="image-upload-area">
            <div className="upload-avatar">
              <User size={32} color="#cccccc" />
            </div>
            <div className="upload-text">
              <p>Drag image here</p>
              <p>or</p>
              <button type="button" className="browse-btn">Browse image</button>
            </div>
          </div>
          
          <form className="supplier-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-row">
              <label>Supplier Name</label>
              <input type="text" placeholder="Enter supplier name" />
            </div>
            
            <div className="form-row">
              <label>Product</label>
              <input type="text" placeholder="Enter product" />
            </div>
            
            <div className="form-row">
              <label>Category</label>
              <input type="text" placeholder="Select product category" />
            </div>
            
            <div className="form-row">
              <label>Buying Price</label>
              <input type="text" placeholder="Enter buying price" />
            </div>
            
            <div className="form-row">
              <label>Contact Number</label>
              <input type="text" placeholder="Enter supplier contact number" />
            </div>
            
            <div className="form-row">
              <label>Type</label>
              <div className="type-buttons">
                <button type="button" className="type-btn">Not taking return</button>
                <button type="button" className="type-btn active">Taking return</button>
              </div>
            </div>
            
            <div className="modal-actions">
              <button type="button" className="discard-btn" onClick={onClose}>Discard</button>
              <button type="submit" className="add-supplier-btn">Add Supplier</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupplierModal;
