import React, { useState } from 'react';
import './InventoryDetailsScreen.css';

const InventoryDetailsScreen = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Purchases', 'Adjustments', 'History'];

  return (
    <div className="inventory-details-container">
      <h1 className="inventory-main-title">INVENTORY</h1>
      
      <div className="details-header">
        <h2 className="product-name-title">REFEREE POLO GREY</h2>
        <div className="details-actions">
          <button className="btn-edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit
          </button>
          <button className="btn-download-small">Download</button>
        </div>
      </div>
      
      <div className="details-tabs">
        {tabs.map(tab => (
          <button 
            key={tab} 
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      
      <div className="details-content-grid">
        <div className="details-left">
          <div className="details-section">
            <h3 className="details-section-title">Primary Details</h3>
            <div className="detail-row">
              <span className="detail-label">Product name</span>
              <span className="detail-value">REFEREE POLO GREY</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Product ID</span>
              <span className="detail-value">456567</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Product category</span>
              <span className="detail-value">T-SHIRT</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Threshold Value</span>
              <span className="detail-value">12</span>
            </div>
          </div>
          
          <div className="details-section mt-8">
            <h3 className="details-section-title">Supplier Details</h3>
            <div className="detail-row">
              <span className="detail-label">Supplier name</span>
              <span className="detail-value">Ronald Martin</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Contact Number</span>
              <span className="detail-value">98789 86757</span>
            </div>
          </div>
          
          <div className="details-section mt-8">
            <h3 className="details-section-title">Stock Locations</h3>
            <table className="locations-table">
              <thead>
                <tr>
                  <th>Store Name</th>
                  <th className="text-right">Stock in hand</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Sulur Branch</td>
                  <td className="text-right text-blue">15</td>
                </tr>
                <tr>
                  <td>Singanallur Branch</td>
                  <td className="text-right text-blue">19</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="details-right">
          <div className="product-image-box">
            <img src="/images/product-1.png" alt="Referee Polo Grey" />
          </div>
          
          <div className="stock-summary">
            <div className="stock-row">
              <span className="stock-label">Opening Stock</span>
              <span className="stock-value">40</span>
            </div>
            <div className="stock-row">
              <span className="stock-label">Remaining Stock</span>
              <span className="stock-value">34</span>
            </div>
            <div className="stock-row">
              <span className="stock-label">On the way</span>
              <span className="stock-value">15</span>
            </div>
            <div className="stock-row">
              <span className="stock-label">Threshold value</span>
              <span className="stock-value">12</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryDetailsScreen;
