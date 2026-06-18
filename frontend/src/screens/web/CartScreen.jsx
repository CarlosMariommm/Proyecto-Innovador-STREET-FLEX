import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/web/Header';
import Sidebar from '../../components/web/Sidebar';
import { useCart } from '../../context/CartContext';
import './CartScreen.css';

const CartScreen = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  const handleBuy = () => {
    // Verificamos si hay usuario logueado
    const clientInfo = localStorage.getItem('clientInfo');
    if (!clientInfo) {
      alert("Por favor, inicia sesión para completar tu compra.");
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    navigate('/receipt');
  };

  return (
    <div className="cart-page-container">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      
      <main className="cart-main">
        <h1 className="cart-title">CART</h1>
        
        {cart.length === 0 ? (
          <div style={{ color: 'white', textAlign: 'center', marginTop: '3rem' }}>
            <h2>Your cart is empty.</h2>
            <button 
              className="btn-buy" 
              style={{ marginTop: '2rem', maxWidth: '200px' }} 
              onClick={() => navigate('/')}
            >
              KEEP SHOPPING
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items-container">
              {cart.map((item, index) => (
                <div key={`${item.product._id}-${index}`} className="cart-item-card">
                  <div className="cart-item-image-box">
                    <img src={item.product.image || '/images/product-1.png'} alt={item.product.name} />
                  </div>
                  
                  <div className="cart-item-details">
                    <div className="cart-item-header">
                      <h2 className="cart-item-name">{item.product.name}</h2>
                      <span className="cart-item-price">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <p className="cart-item-size">(size: {item.product.selectedSize} - {item.product.selectedColor})</p>
                    <div className="cart-item-quantity">
                      <button 
                        className="qty-btn" 
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button 
                        className="qty-btn"
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    className="cart-item-remove"
                    onClick={() => removeFromCart(item.product._id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            
            <div className="cart-footer">
              <div style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem', textAlign: 'right' }}>
                Total: ${getCartTotal().toFixed(2)}
              </div>
              <button className="btn-buy" onClick={handleBuy}>CHECKOUT</button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default CartScreen;
