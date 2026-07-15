import React, { useEffect, useState, useRef } from 'react';
import { moduleService } from '../../api/moduleService';
import { useToast } from '../../hooks/useToast';
import { Trash2, Image as ImageIcon } from 'lucide-react';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import './ModulesScreen.css';

const ModulesScreen = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({ name: '', active: true });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, id: null });

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const data = await moduleService.getModules();
      setModules(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Error fetching modules", error);
      showToast("Error fetching modules", "error");
    } finally {
      setLoading(false);
    }
  };

  // No image handlers needed

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      showToast("Name is required", "error");
      return;
    }

    try {
      setIsSubmitting(true);
      await moduleService.createModule(formData);
      showToast("Module created successfully", "success");
      
      // Reset form
      setFormData({ name: '', active: true });
      fetchModules();
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || "Error creating module", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (id) => {
    setConfirmDialog({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    try {
      await moduleService.deleteModule(confirmDialog.id);
      showToast("Module deleted successfully", "success");
      fetchModules();
    } catch (error) {
      console.error(error);
      showToast("Error deleting module", "error");
    } finally {
      setConfirmDialog({ isOpen: false, id: null });
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading modules...</div>;
  }

  return (
    <div className="modules-screen">
      <div className="modules-header">
        <h1 className="modules-title">Manage Modules (Banners)</h1>
      </div>

      <div className="modules-layout">
        <div className="modules-form-card">
          <h2>Add New Module</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Module Name (e.g. Hombres, Verano)*</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
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

            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Uploading...' : 'Create Module'}
            </button>
          </form>
        </div>

        <div className="modules-list">
          <h2>Existing Modules</h2>
          {modules.length === 0 ? (
            <p className="empty-text">No modules created yet.</p>
          ) : (
            <div className="modules-grid">
              {modules.map(module => (
                <div key={module._id} className="module-card">
                  <div className="module-info">
                    <h3>{module.name}</h3>
                    <span className={`status-badge ${module.active ? 'active' : 'inactive'}`}>
                      {module.active ? 'Active' : 'Inactive'}
                    </span>
                    <button 
                      className="btn-icon delete" 
                      onClick={() => handleDeleteClick(module._id)}
                      title="Delete Module"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog 
        isOpen={confirmDialog.isOpen}
        title="Delete Module"
        message="Are you sure you want to delete this module? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, id: null })}
      />
    </div>
  );
};

export default ModulesScreen;
