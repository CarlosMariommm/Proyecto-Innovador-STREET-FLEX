import React, { useState, useEffect } from 'react';
import SupplierModal from '../../components/admin/SupplierModal';
import { supplierService } from '../../api/supplierService';
import './SuppliersScreen.css';

const SuppliersScreen = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supplierService.getSuppliers();
      setSuppliers(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError('Error al cargar proveedores. Verifica la conexión.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return (
    <div className="suppliers-container">
      <div className="suppliers-header">
        <h1 className="suppliers-title">SUPPLIERS</h1>
        
        <div className="suppliers-actions">
          <button className="btn-add" onClick={() => setIsModalOpen(true)}>Add Supplier</button>
          <button className="btn-filter">Filters</button>
          <button className="btn-download">Download all</button>
        </div>
      </div>
      
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
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Loading suppliers...</td></tr>
            ) : suppliers.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No suppliers found.</td></tr>
            ) : (
              suppliers.map((supplier) => (
                <tr key={supplier._id || supplier.id}>
                  <td>{supplier.supp_name}</td>
                  <td>{supplier.direction || '-'}</td>
                  <td>{supplier.email || '-'}</td>
                  <td>{supplier.phone_number || '-'}</td>
                  <td className={`status-${supplier.active ? 'green' : 'red'}`}>
                    {supplier.active ? 'Active' : 'Inactive'}
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
        onClose={() => setIsModalOpen(false)} 
        onSupplierAdded={fetchSuppliers}
      />
    </div>
  );
};

export default SuppliersScreen;
