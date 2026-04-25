import React, { useState } from 'react';
import SupplierModal from '../../components/admin/SupplierModal';
import './SuppliersScreen.css';

const MOCK_SUPPLIERS = [
  { id: 1, name: 'Richard Martin', product: 'REFEREE POLO GREY', direction: 'Times Square', email: 'richard@gmail.com', active: 'Taking Return', activeColor: 'green', onTheWay: '13' },
  { id: 2, name: 'Tom Homan', product: 'REFEREE POLO GREY', direction: 'Times Square', email: 'tomhoman@gmail.com', active: 'Taking Return', activeColor: 'green', onTheWay: '-' },
  { id: 3, name: 'Veandir', product: 'REFEREE POLO GREY', direction: 'Times Square', email: 'veandir@gmail.com', active: 'Not Taking Return', activeColor: 'red', onTheWay: '-' },
  { id: 4, name: 'Charin', product: 'REFEREE POLO GREY', direction: 'Times Square', email: 'charin@gmail.com', active: 'Taking Return', activeColor: 'green', onTheWay: '12' },
  { id: 5, name: 'Hoffman', product: 'REFEREE POLO GREY', direction: 'Times Square', email: 'hoffman@gmail.com', active: 'Taking Return', activeColor: 'green', onTheWay: '-' },
  { id: 6, name: 'Fainden Juke', product: 'REFEREE POLO GREY', direction: 'Times Square', email: 'fainden@gmail.com', active: 'Not Taking Return', activeColor: 'red', onTheWay: '9' },
  { id: 7, name: 'Martin', product: 'REFEREE POLO GREY', direction: 'Times Square', email: 'martin@gmail.com', active: 'Taking Return', activeColor: 'green', onTheWay: '-' },
  { id: 8, name: 'Joe Nike', product: 'REFEREE POLO GREY', direction: 'Times Square', email: 'joenike@gmail.com', active: 'Taking Return', activeColor: 'green', onTheWay: '-' },
];

const SuppliersScreen = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="suppliers-container">
      <div className="suppliers-header">
        <h1 className="suppliers-title">SUPPLIERS</h1>
        
        <div className="suppliers-actions">
          <button className="btn-add" onClick={() => setIsModalOpen(true)}>Add Product</button>
          <button className="btn-filter">Filters</button>
          <button className="btn-download">Download all</button>
        </div>
      </div>
      
      <div className="suppliers-table-container">
        <table className="suppliers-table">
          <thead>
            <tr>
              <th>Supplier Name</th>
              <th>Product</th>
              <th>Direction</th>
              <th>Email</th>
              <th>Active</th>
              <th>On the way</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_SUPPLIERS.map((supplier) => (
              <tr key={supplier.id}>
                <td>{supplier.name}</td>
                <td className="product-col">{supplier.product}</td>
                <td>{supplier.direction}</td>
                <td>{supplier.email}</td>
                <td className={`status-${supplier.activeColor}`}>{supplier.active}</td>
                <td>{supplier.onTheWay}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="suppliers-pagination">
        <button className="btn-page">Previous</button>
        <span>Page 1 of 10</span>
        <button className="btn-page">Next</button>
      </div>

      <SupplierModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default SuppliersScreen;
