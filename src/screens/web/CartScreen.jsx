import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/web/Header';
import Sidebar from '../../components/web/Sidebar';
import './CartScreen.css';

const MOCK_CART_ITEMS = [
  { id: 1, name: 'REFEREE POLO GREY', size: 's', price: 80.00, quantity: 3, image: '/images/product-1.png' },
  { id: 2, name: 'REFEREE POLO RED', size: 's', price: 80.00, quantity: 3, image: '/images/product-2.png' },
  { id: 3, name: 'REFEREE POLO BLUE', size: 's', price: 80.00, quantity: 3, image: '/images/product-3.png' },
];

const CartScreen = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleBuy = () => {
    navigate('/receipt');
  };

  return (
    <div className="cart-page-container">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      
      <main className="cart-main">
        <h1 className="cart-title">CART</h1>
        
        <div className="cart-items-container">
          {MOCK_CART_ITEMS.map((item) => (
            <div key={item.id} className="cart-item-card">
              <div className="cart-item-image-box">
                <img src={item.image} alt={item.name} />
              </div>
              
              <div className="cart-item-details">
                <div className="cart-item-header">
                  <h2 className="cart-item-name">{item.name}</h2>
                  <span className="cart-item-price">${item.price.toFixed(2)}</span>
                </div>
                <p className="cart-item-size">(size: {item.size})</p>
                <div className="cart-item-quantity">
                  <button className="qty-btn">-</button>
                  <span className="qty-value">{item.quantity}</span>
                  <button className="qty-btn">+</button>
                </div>
              </div>
              
              <button className="cart-item-remove">-</button>
            </div>
          ))}
        </div>
        
        <div className="cart-footer">
          <button className="btn-buy" onClick={handleBuy}>BUY</button>
        </div>
      </main>
    </div>
  );
};

export default CartScreen;
