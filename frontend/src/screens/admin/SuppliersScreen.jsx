import React, { useState, useEffect } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import SupplierModal from '../../components/admin/SupplierModal';
import { supplierService } from '../../api/supplierService';
import './SuppliersScreen.css';

const SuppliersScreen = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supplierService.getSuppliers();
      const list = Array.isArray(data) ? data : data.data || [];
      setSuppliers(list);
      setFilteredSuppliers(list);
    } catch (err) {
      setError('Error loading suppliers. Check connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSuppliers(); }, []);

  useEffect(() => {
    let result = [...suppliers];
    if (filterQuery) {
      const q = filterQuery.toLowerCase();
      result = result.filter(s =>
        s.supp_name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q)
      );
    }
    if (filterStatus === 'active') result = result.filter(s => s.active);
    if (filterStatus === 'inactive') result = result.filter(s => !s.active);
    setFilteredSuppliers(result);
  }, [filterQuery, filterStatus, suppliers]);

  const handleEditClick = (supplier) => {
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSupplier(null);
  };

  return (
    <div className="suppliers-container">
      <div className="suppliers-header">
        <h1 className="suppliers-title">SUPPLIERS</h1>
        <div className="suppliers-actions">
          <input
            type="text"
            placeholder="Search suppliers..."
            className="filter-input"
            value={filterQuery}
            onChange={e => setFilterQuery(e.target.value)}
          />
          <button className="btn-filter" onClick={() => setShowFilter(v => !v)}>
            Filters {showFilter ? '▲' : '▼'}
          </button>
          <button className="btn-add" onClick={() => { setSelectedSupplier(null); setIsModalOpen(true); }}>Add Supplier</button>
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

      {error && <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>}

      <div className="suppliers-table-container">
        <table className="suppliers-table">
          <thead>
            <tr>
              <th>Supplier Name</th>
              <th>Direction</th>
              <th>Email</th>
              <th>Contact Number</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Loading suppliers...</td></tr>
            ) : filteredSuppliers.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No suppliers found.</td></tr>
            ) : (
              filteredSuppliers.map((supplier) => (
                <tr key={supplier._id || supplier.id}>
                  <td>{supplier.supp_name}</td>
                  <td>{supplier.direction || '-'}</td>
                  <td>{supplier.email || '-'}</td>
                  <td>{supplier.phone_number || '-'}</td>
                  <td className={`status-${supplier.active ? 'green' : 'red'}`}>
                    {supplier.active ? 'Active' : 'Inactive'}
                  </td>
                  <td>
                    <div style={{display: 'flex', gap: '8px'}}>
                      <button 
                        className="btn-icon edit" 
                        onClick={() => handleEditClick(supplier)}
                        title="Edit Supplier"
                        style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-color)'}}
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="suppliers-pagination">
        <button className="btn-page">Previous</button>
        <span>Page 1 of 1</span>
        <button className="btn-page">Next</button>
      </div>

      <SupplierModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSupplierAdded={fetchSuppliers}
        initialData={selectedSupplier}
      />
    </div>
  );
};

export default SuppliersScreen;
