import React, { useEffect, useState, useRef } from 'react';
import { bannerService } from '../../api/bannerService';
import { moduleService } from '../../api/moduleService';
import { useToast } from '../../hooks/useToast';
import { Trash2, Edit2, Image as ImageIcon } from 'lucide-react';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import './AdminBannersScreen.css';

const AdminBannersScreen = () => {
  const [banners, setBanners] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({ id_module: '', active: true });
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);
  
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, id: null });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const bannerData = await bannerService.getBanners();
      setBanners(Array.isArray(bannerData) ? bannerData : bannerData.data || []);

      const moduleData = await moduleService.getModules();
      setModules(Array.isArray(moduleData) ? moduleData : moduleData.data || []);
    } catch (error) {
      console.error("Error fetching data", error);
      showToast("Error fetching data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id_module) {
      showToast("Module is required", "error");
      return;
    }
    if (!editingId && !imageFile) {
      showToast("Image is required when creating", "error");
      return;
    }

    try {
      setIsSubmitting(true);
      const data = new FormData();
      data.append('id_module', formData.id_module);
      data.append('active', formData.active);
      if (imageFile) {
        data.append('image', imageFile);
      }

      if (editingId) {
        await bannerService.updateBanner(editingId, data);
        showToast("Banner updated successfully", "success");
      } else {
        await bannerService.createBanner(data);
        showToast("Banner created successfully", "success");
      }
      
      // Reset form
      setFormData({ id_module: '', active: true });
      setImageFile(null);
      setImagePreview('');
      setEditingId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      fetchData();
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || "Error creating banner", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (banner) => {
    setFormData({ id_module: banner.id_module?._id || banner.id_module, active: banner.active });
    setImagePreview(banner.image || '');
    setImageFile(null);
    setEditingId(banner._id);
  };

  const cancelEdit = () => {
    setFormData({ id_module: '', active: true });
    setImagePreview('');
    setImageFile(null);
    setEditingId(null);
  };

  const handleDeleteClick = (id) => {
    setConfirmDialog({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    try {
      await bannerService.deleteBanner(confirmDialog.id);
      showToast("Banner deleted successfully", "success");
      fetchData();
    } catch (error) {
      console.error(error);
      showToast("Error deleting banner", "error");
    } finally {
      setConfirmDialog({ isOpen: false, id: null });
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading banners...</div>;
  }

  return (
    <div className="modules-screen">
      <div className="modules-header">
        <h1 className="modules-title">Manage Banners</h1>
      </div>

      <div className="modules-layout">
        <div className="modules-form-card">
          <h2>{editingId ? 'Edit Banner' : 'Add New Banner'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select Module (Link to)*</label>
              <select 
                value={formData.id_module}
                onChange={(e) => setFormData({...formData, id_module: e.target.value})}
                required
                style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border-color)' }}
              >
                <option value="">-- Select Module --</option>
                {modules.map(mod => (
                  <option key={mod._id} value={mod._id}>{mod.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Banner Image {editingId ? '(Optional, leave blank to keep current)' : '*'}</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
                id="banner-image-upload"
              />
              <div 
                className="image-upload-area" 
                onClick={() => fileInputRef.current.click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                ) : (
                  <div className="upload-placeholder">
                    <ImageIcon size={48} />
                    <p>Click to upload image</p>
                  </div>
                )}
              </div>
              <p style={{ fontSize: '12px', color: 'var(--accent-color)', marginTop: '8px', opacity: 0.7 }}>
                📐 Dimensiones recomendadas: <strong>1920 × 600 px</strong> (proporción 16:5). La imagen se mostrará completa en el banner.
              </p>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input 
                  type="checkbox" 
                  checked={formData.active}
                  onChange={(e) => setFormData({...formData, active: e.target.checked})}
                />
                Active
              </label>
            </div>

            <div style={{display: 'flex', gap: '10px'}}>
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : (editingId ? 'Save Changes' : 'Create Banner')}
              </button>
              {editingId && (
                <button type="button" className="btn-secondary" onClick={cancelEdit} disabled={isSubmitting}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="modules-list">
          <h2>Existing Banners</h2>
          {banners.length === 0 ? (
            <p className="empty-text">No banners created yet.</p>
          ) : (
            <div className="modules-grid">
              {banners.map(banner => (
                <div key={banner._id} className="module-card">
                  <div className="module-image-wrapper">
                    <img src={banner.image} alt="Banner" />
                  </div>
                  <div className="module-info">
                    <h3>{banner.id_module?.name || 'Unknown Module'}</h3>
                    <span className={`status-badge ${banner.active ? 'active' : 'inactive'}`}>
                      {banner.active ? 'Active' : 'Inactive'}
                    </span>
                    <div style={{display: 'flex', gap: '8px', marginTop: '10px'}}>
                      <button 
                        className="btn-icon edit" 
                        onClick={() => handleEditClick(banner)}
                        title="Edit Banner"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        className="btn-icon delete" 
                        onClick={() => handleDeleteClick(banner._id)}
                        title="Delete Banner"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog 
        isOpen={confirmDialog.isOpen}
        title="Delete Banner"
        message="Are you sure you want to delete this banner? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, id: null })}
      />
    </div>
  );
};

export default AdminBannersScreen;
