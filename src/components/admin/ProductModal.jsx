import React from 'react';
import { X } from 'lucide-react';
import './ProductModal.css';

const ProductModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="product-modal-content">
        <div className="modal-header border-none">
          <h3>New Product</h3>
          <button className="close-modal-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="product-image-upload">
            <div className="upload-box-dashed"></div>
            <div className="upload-text">
              <p>Drag image here</p>
              <p>or</p>
              <button type="button" className="browse-btn">Browse image</button>
            </div>
          </div>
          
          <form className="product-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-row">
              <label>Product Name</label>
              <input type="text" placeholder="Enter product name" />
            </div>
            
            <div className="form-row">
              <label>Product ID</label>
              <input type="text" placeholder="Enter product ID" />
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
              <label>Quantity</label>
              <input type="text" placeholder="Enter product quantity" />
            </div>
            
            <div className="form-row">
              <label>Unit</label>
              <input type="text" placeholder="Enter product unit" />
            </div>
            
            <div className="form-row">
              <label>Season</label>
              <input type="text" placeholder="Enter threshold value" />
            </div>
            
            <div className="modal-actions mt-4">
              <button type="button" className="discard-btn" onClick={onClose}>Discard</button>
              <button type="submit" className="add-supplier-btn">Add Product</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
