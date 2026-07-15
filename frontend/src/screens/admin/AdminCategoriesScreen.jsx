import React, { useState, useEffect } from 'react';
import CategoryModal from '../../components/admin/CategoryModal';
import { categoryService } from '../../api/categoryService';
import { useToast } from '../../hooks/useToast';
import './AdminCategoriesScreen.css';

const AdminCategoriesScreen = () => {
  const { showToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryService.getCategories();
      const list = Array.isArray(data) ? data : data.data || [];
      setCategories(list);
      setFilteredCategories(list);
    } catch (err) {
      setError('Error loading categories. Check connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  useEffect(() => {
    let result = [...categories];
    if (filterQuery) {
      const q = filterQuery.toLowerCase();
      result = result.filter(c =>
        c.name?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
      );
    }
    if (filterStatus === 'active') result = result.filter(c => c.active);
    if (filterStatus === 'inactive') result = result.filter(c => !c.active);
    setFilteredCategories(result);
  }, [filterQuery, filterStatus, categories]);

  const handleAddClick = () => { setSelectedCategory(null); setIsModalOpen(true); };
  const handleEditClick = (cat) => { setSelectedCategory(cat); setIsModalOpen(true); };
  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryService.deleteCategory(id);
        showToast('Category deleted successfully', 'success');
        fetchCategories();
      } catch {
        showToast('Failed to delete category', 'error');
      }
    }
  };

  return (
    <div className="admin-categories-container">
      <div className="categories-header">
        <h1 className="categories-title">CATEGORIES</h1>
        <div className="categories-actions">
          <input
            type="text"
            placeholder="Search categories..."
            className="filter-input"
            value={filterQuery}
            onChange={e => setFilterQuery(e.target.value)}
          />
          <button className="btn-filter" onClick={() => setShowFilter(v => !v)}>
            Filters {showFilter ? '▲' : '▼'}
          </button>
          <button className="btn-add-cat" onClick={handleAddClick}>Add Category</button>
        </div>
      </div>

      {showFilter && (
        <div className="filter-bar">
          <div className="filter-group">
            <label>Status</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <button className="btn-clear-filter" onClick={() => { setFilterQuery(''); setFilterStatus(''); }}>
            Clear Filters
          </button>
        </div>
      )}

      {error && <div style={{ color: '#ff4444', margin: '10px 0' }}>{error}</div>}

      <div className="categories-table-container">
        <table className="categories-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Supplier</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Loading categories...</td></tr>
            ) : filteredCategories.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No categories found.</td></tr>
            ) : (
              filteredCategories.map((category) => (
                <tr key={category._id || category.id}>
                  <td>{category.name}</td>
                  <td>{category.description || '-'}</td>
                  <td>{category.supplier?.supp_name || category.supplier?.name || '-'}</td>
                  <td className={`status-${category.active ? 'green' : 'red'}`}>
                    {category.active ? 'Active' : 'Inactive'}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-action-edit" onClick={() => handleEditClick(category)}>Edit</button>
                      <button className="btn-action-delete" onClick={() => handleDeleteClick(category._id || category.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCategorySaved={fetchCategories}
        initialData={selectedCategory}
      />
    </div>
  );
};

export default AdminCategoriesScreen;
