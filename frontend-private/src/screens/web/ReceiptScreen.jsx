import React, { useState } from 'react';
import Header from '../../components/web/Header';
import Sidebar from '../../components/web/Sidebar';
import './ReceiptScreen.css';

const ReceiptScreen = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="receipt-page-container">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      
      <main className="receipt-main">
        <h1 className="receipt-title">RECEIPT</h1>
        
        <div className="receipt-header-row">
          <span className="receipt-date">02/12/2025</span>
          <span className="receipt-dash">-</span>
        </div>
        
        <div className="receipt-ref-row">
          <span className="receipt-ref">Ref: 923HS92</span>
          <span className="receipt-total">$875</span>
        </div>
        
        <div className="receipt-section">
          <h2 className="receipt-section-title">ADDRESS</h2>
          
          <div className="receipt-field">
            <span className="receipt-label">PHONE</span>
            <div className="receipt-value-line">+1 (249) 942-8320</div>
          </div>
          
          <div className="receipt-field">
            <span className="receipt-label">CITY</span>
            <div className="receipt-value-line">New York City</div>
          </div>
          
          <div className="receipt-field">
            <span className="receipt-label">ADDRESS</span>
            <div className="receipt-value-line">100 Main St</div>
          </div>
          
          <div className="receipt-field">
            <span className="receipt-label">POSTAL CODE</span>
            <div className="receipt-value-line">10001</div>
          </div>
        </div>
        
        <div className="receipt-section mt-12">
          <h2 className="receipt-section-title">ITEMS</h2>
          
          <div className="receipt-item">
            <div className="receipt-item-header">
              <span className="receipt-item-name">REFEREE POLO GREY</span>
              <span className="receipt-item-price">$80.00</span>
            </div>
            <span className="receipt-item-size">(size: s)</span>
            <div className="receipt-item-qty">
              <span className="qty-control">-</span>
              <span className="qty-number">3</span>
              <span className="qty-control">+</span>
            </div>
          </div>
          
          <div className="receipt-item">
            <div className="receipt-item-header">
              <span className="receipt-item-name">REFEREE POLO GREY</span>
              <span className="receipt-item-price">$80.00</span>
            </div>
            <span className="receipt-item-size">(size: s)</span>
            <div className="receipt-item-qty">
              <span className="qty-control">-</span>
              <span className="qty-number">3</span>
              <span className="qty-control">+</span>
            </div>
          </div>
          
          <div className="receipt-item">
            <div className="receipt-item-header">
              <span className="receipt-item-name">REFEREE POLO GREY</span>
              <span className="receipt-item-price">$80.00</span>
            </div>
            <span className="receipt-item-size">(size: s)</span>
            <div className="receipt-item-qty">
              <span className="qty-control">-</span>
              <span className="qty-number">3</span>
              <span className="qty-control">+</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReceiptScreen;
