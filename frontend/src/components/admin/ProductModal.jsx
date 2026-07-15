import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { productService } from '../../api/productService';
import { categoryService } from '../../api/categoryService';
import { moduleService } from '../../api/moduleService';
import './SupplierModal.css'; // Reuse same modal styles

const ProductModal = ({ isOpen, onClose, onProductAdded }) => {
  const [formData, setFormData] = useState({
    product_name: '',
    price: '',
    id_module: '',
    category: '',
    stock: '',
    units: '',
    seson: '',
    material: '',
    care_instructions: '',
    shipping_returns: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [modules, setModules] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      categoryService.getCategories()
        .then(data => {
          const list = data?.data || data || [];
          setCategories(list);
        })
        .catch(err => console.error('Error fetching categories:', err));
        
      moduleService.getModules()
        .then(data => {
          const list = Array.isArray(data) ? data : data.data || [];
          setModules(list);
        })
        .catch(err => console.error('Error fetching modules:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const triggerFileInput = () => fileInputRef.current.click();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (val !== '') data.append(key, val);
      });
      if (imageFile) data.append('image', imageFile);

      await productService.createProduct(data);

      setFormData({
        product_name: '', price: '', id_module: '', category: '', stock: '',
        units: '', seson: '', material: '', care_instructions: '', shipping_returns: ''
      });
      setImageFile(null);
      setImagePreview(null);

      if (onProductAdded) onProductAdded();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving product.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>New Product</h3>
          <button className="close-modal-btn" onClick={onClose} disabled={loading}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {error && <div style={{ color: 'red', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}

          {/* Image upload */}
          <div className="image-upload-area" onClick={triggerFileInput}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
              accept="image/*"
            />
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
              />
            ) : (
              <div className="upload-avatar" style={{ borderRadius: '8px' }}>
                <span style={{ fontSize: '24px', opacity: 0.4 }}>📷</span>
              </div>
            )}
            <div className="upload-text">
              <p>Drag image here</p>
              <p>or</p>
              <button type="button" className="browse-btn" onClick={e => { e.stopPropagation(); triggerFileInput(); }}>
                Browse image
              </button>
            </div>
          </div>

          <form className="supplier-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label>Product Name *</label>
              <input type="text" name="product_name" value={formData.product_name}
                onChange={handleChange} placeholder="E.g. Oversized T-Shirt" required />
            </div>

            <div className="form-row">
              <label>Price *</label>
              <input type="number" name="price" value={formData.price}
                onChange={handleChange} placeholder="E.g. 29.99" required />
            </div>

            <div className="form-row">
              <label>Module (Gender/Category) *</label>
              <select name="id_module" value={formData.id_module} onChange={handleChange} className="form-select" required>
                <option value="">-- Select a module --</option>
                {modules.map(mod => (
                  <option key={mod._id} value={mod._id}>{mod.name}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="form-select">
                <option value="">-- Select a category --</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label>Stock Qty</label>
              <input type="number" name="stock" value={formData.stock}
                onChange={handleChange} placeholder="E.g. 100" />
            </div>

            <div className="form-row">
              <label>Units</label>
              <input type="number" name="units" value={formData.units}
                onChange={handleChange} placeholder="E.g. 1" />
            </div>

            <div className="form-row">
              <label>Season</label>
              <input type="text" name="seson" value={formData.seson}
                onChange={handleChange} placeholder="E.g. Summer" />
            </div>

            <div className="form-row" style={{ alignItems: 'flex-start', paddingTop: '4px' }}>
              <label style={{ paddingTop: '8px' }}>Material</label>
              <textarea name="material" value={formData.material}
                onChange={handleChange} placeholder="E.g. 100% Cotton" rows="2" />
            </div>

            <div className="form-row" style={{ alignItems: 'flex-start', paddingTop: '4px' }}>
              <label style={{ paddingTop: '8px' }}>Care Instructions</label>
              <textarea name="care_instructions" value={formData.care_instructions}
                onChange={handleChange} placeholder="E.g. Machine wash cold" rows="2" />
            </div>

            <div className="form-row" style={{ alignItems: 'flex-start', paddingTop: '4px' }}>
              <label style={{ paddingTop: '8px' }}>Shipping & Returns</label>
              <textarea name="shipping_returns" value={formData.shipping_returns}
                onChange={handleChange} placeholder="E.g. Free shipping over $50" rows="2" />
            </div>

            <div className="modal-actions">
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
