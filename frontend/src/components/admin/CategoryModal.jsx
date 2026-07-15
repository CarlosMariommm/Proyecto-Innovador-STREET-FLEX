import React, { useState, useEffect } from 'react';
import { categoryService } from '../../api/categoryService';
import { supplierService } from '../../api/supplierService';
import { moduleService } from '../../api/moduleService';
import { useToast } from '../../hooks/useToast';
import './CategoryModal.css';

const CategoryModal = ({ isOpen, onClose, onCategorySaved, initialData = null }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    supplier: '',
    id_module: '',
    active: true
  });
  
  const [suppliers, setSuppliers] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          description: initialData.description || '',
          supplier: initialData.supplier?._id || initialData.supplier || '',
          id_module: initialData.id_module?._id || initialData.id_module || '',
          active: initialData.active !== undefined ? initialData.active : true
        });
      } else {
        setFormData({ name: '', description: '', supplier: '', id_module: '', active: true });
      }
      fetchSuppliers();
      fetchModules();
    }
  }, [isOpen, initialData]);

  const fetchSuppliers = async () => {
    try {
      const data = await supplierService.getSuppliers();
      setSuppliers(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
    }
  };

  const fetchModules = async () => {
    try {
      const data = await moduleService.getModules();
      setModules(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error('Error fetching modules:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.supplier) {
      showToast('Name and Supplier are required.', 'error');
      return;
    }

    try {
      setLoading(true);
      if (initialData && initialData._id) {
        await categoryService.updateCategory(initialData._id, formData);
        showToast('Category updated successfully', 'success');
      } else {
        await categoryService.createCategory(formData);
        showToast('Category created successfully', 'success');
      }
      onCategorySaved();
      onClose();
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Error saving category', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">{initialData ? 'Edit Category' : 'Add New Category'}</h2>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Category Name *</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="e.g. Shirts, Sneakers"
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange}
              placeholder="Short description"
            />
          </div>
          
          <div className="form-group">
            <label>Supplier *</label>
            <select 
              name="supplier" 
              value={formData.supplier} 
              onChange={handleChange}
              required
            >
              <option value="">Select a supplier...</option>
              {suppliers.map(s => (
                <option key={s._id} value={s._id}>{s.supp_name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Module</label>
            <select 
              name="id_module" 
              value={formData.id_module} 
              onChange={handleChange}
            >
              <option value="">Select a module... (Optional)</option>
              {modules.map(m => (
                <option key={m._id} value={m._id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input 
                type="checkbox" 
                name="active" 
                checked={formData.active} 
                onChange={handleChange} 
              />
              Active Category
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Saving...' : 'Save Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
