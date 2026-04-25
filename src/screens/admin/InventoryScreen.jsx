import React, { useState } from 'react';
import ProductModal from '../../components/admin/ProductModal';
import { useNavigate } from 'react-router-dom';
import './InventoryScreen.css';

const MOCK_INVENTORY = [
  { id: 1, name: 'Maggi', buyingPrice: '$430', quantity: '43 Packets', threshold: '12 Packets', expiry: '11/12/22', availability: 'In- stock', availabilityColor: 'green' },
  { id: 2, name: 'Bru', buyingPrice: '$257', quantity: '22 Packets', threshold: '12 Packets', expiry: '21/12/22', availability: 'Out of stock', availabilityColor: 'red' },
  { id: 3, name: 'Red Bull', buyingPrice: '$405', quantity: '36 Packets', threshold: '9 Packets', expiry: '5/12/22', availability: 'In- stock', availabilityColor: 'green' },
  { id: 4, name: 'Bourn Vita', buyingPrice: '$502', quantity: '14 Packets', threshold: '6 Packets', expiry: '8/12/22', availability: 'Out of stock', availabilityColor: 'red' },
  { id: 5, name: 'Horlicks', buyingPrice: '$530', quantity: '5 Packets', threshold: '5 Packets', expiry: '9/1/23', availability: 'In- stock', availabilityColor: 'green' },
  { id: 6, name: 'Harpic', buyingPrice: '$605', quantity: '10 Packets', threshold: '5 Packets', expiry: '9/1/23', availability: 'In- stock', availabilityColor: 'green' },
  { id: 7, name: 'Ariel', buyingPrice: '$408', quantity: '23 Packets', threshold: '7 Packets', expiry: '15/12/23', availability: 'Out of stock', availabilityColor: 'red' },
  { id: 8, name: 'Scotch Brite', buyingPrice: '$359', quantity: '43 Packets', threshold: '8 Packets', expiry: '6/6/23', availability: 'In- stock', availabilityColor: 'green' },
  { id: 9, name: 'Coca cola', buyingPrice: '$205', quantity: '41 Packets', threshold: '10 Packets', expiry: '11/11/22', availability: 'Low stock', availabilityColor: 'orange' },
];

const InventoryScreen = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleRowClick = (id) => {
    navigate(`/admin/inventory/${id}`);
  };

  return (
    <div className="inventory-container">
      <h1 className="inventory-main-title">INVENTORY</h1>
      
      <div className="overall-inventory">
        <h2 className="section-subtitle">Overall Inventory</h2>
        <div className="inventory-stats-grid">
          <div className="stat-card">
            <h3 className="stat-label text-blue">Categories</h3>
            <div className="stat-value">14</div>
            <div className="stat-desc">Last 7 days</div>
          </div>
          
          <div className="stat-card border-left">
            <h3 className="stat-label text-orange">Total Products</h3>
            <div className="stat-value-row">
              <div className="stat-item">
                <div className="stat-value">868</div>
                <div className="stat-desc">Last 7 days</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">$25000</div>
                <div className="stat-desc">Revenue</div>
              </div>
            </div>
          </div>
          
          <div className="stat-card border-left">
            <h3 className="stat-label text-purple">Top Selling</h3>
            <div className="stat-value-row">
              <div className="stat-item">
                <div className="stat-value">5</div>
                <div className="stat-desc">Last 7 days</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">$2500</div>
                <div className="stat-desc">Cost</div>
              </div>
            </div>
          </div>
          
          <div className="stat-card border-left">
            <h3 className="stat-label text-red">Low Stocks</h3>
            <div className="stat-value-row">
              <div className="stat-item">
                <div className="stat-value">12</div>
                <div className="stat-desc">Ordered</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">2</div>
                <div className="stat-desc">Not in stock</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="products-section">
        <div className="products-header">
          <h2 className="section-subtitle">Products</h2>
          <div className="products-actions">
            <button className="btn-add" onClick={() => setIsModalOpen(true)}>Add Product</button>
            <button className="btn-filter">Filters</button>
            <button className="btn-download">Download all</button>
          </div>
        </div>
        
        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Products</th>
                <th>Buying Price</th>
                <th>Quantity</th>
                <th>Threshold Value</th>
                <th>Expiry Date</th>
                <th>Availability</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_INVENTORY.map((product) => (
                <tr key={product.id} onClick={() => handleRowClick(product.id)} className="clickable-row">
                  <td>{product.name}</td>
                  <td>{product.buyingPrice}</td>
                  <td>{product.quantity}</td>
                  <td>{product.threshold}</td>
                  <td>{product.expiry}</td>
                  <td className={`status-${product.availabilityColor}`}>{product.availability}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="inventory-pagination">
          <button className="btn-page">Previous</button>
          <span>Page 1 of 10</span>
          <button className="btn-page">Next</button>
        </div>
      </div>
      
      <ProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default InventoryScreen;
