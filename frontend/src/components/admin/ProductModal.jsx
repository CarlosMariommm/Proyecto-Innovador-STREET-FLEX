import React, { useState, useRef } from 'react';
import { X } from 'lucide-react';
import { productService } from '../../api/productService';
import './ProductModal.css';

const ProductModal = ({ isOpen, onClose, onProductAdded }) => {
  const [formData, setFormData] = useState({
    product_name: '',
    price: '',
    category: '',
    stock: '',
    units: '',
    seson: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Crear URL temporal para previsualizar la imagen
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
      data.append('product_name', formData.product_name);
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('stock', formData.stock);
      data.append('units', formData.units);
      data.append('seson', formData.seson);
      
      if (imageFile) {
        data.append('image', imageFile);
      }

      await productService.createProduct(data);
      
      // Limpiar el formulario
      setFormData({
        product_name: '',
        price: '',
        category: '',
        stock: '',
        units: '',
        seson: ''
      });
      setImageFile(null);
      setImagePreview(null);
      
      // Notificar al padre y cerrar
      if (onProductAdded) onProductAdded();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar el producto. Verifica tu conexión o los datos ingresados.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="product-modal-content">
        <div className="modal-header border-none">
          <h3>New Product</h3>
          <button className="close-modal-btn" onClick={onClose} aria-label="Close" disabled={loading}>
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
          
          <div className="product-image-upload" onClick={triggerFileInput} style={{ cursor: 'pointer', overflow: 'hidden', position: 'relative' }}>
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
              <div className="upload-box-dashed"></div>
            )}
            {!imagePreview && (
              <div className="upload-text">
                <p>Drag image here</p>
                <p>or</p>
                <button type="button" className="browse-btn" onClick={(e) => { e.stopPropagation(); triggerFileInput(); }}>Browse image</button>
              </div>
            )}
          </div>
          
          <form className="product-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label>Product Name</label>
              <input 
                type="text" 
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                placeholder="Enter product name" 
                required
              />
            </div>
            
            <div className="form-row">
              <label>Price</label>
              <input 
                type="number" 
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter buying price" 
                required
              />
            </div>
            
            <div className="form-row">
              <label>Category</label>
              <input 
                type="text" 
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Select product category" 
              />
            </div>
            
            <div className="form-row">
              <label>Stock (Quantity)</label>
              <input 
                type="number" 
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Enter product quantity" 
              />
            </div>
            
            <div className="form-row">
              <label>Units</label>
              <input 
                type="number" 
                name="units"
                value={formData.units}
                onChange={handleChange}
                placeholder="Enter product unit" 
              />
            </div>
            
            <div className="form-row">
              <label>Season</label>
              <input 
                type="text" 
                name="seson"
                value={formData.seson}
                onChange={handleChange}
                placeholder="Enter season" 
              />
            </div>
            
            <div className="modal-actions mt-4">
              <button type="button" className="discard-btn" onClick={onClose} disabled={loading}>Discard</button>
              <button type="submit" className="add-supplier-btn" disabled={loading}>
                {loading ? 'Saving...' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
