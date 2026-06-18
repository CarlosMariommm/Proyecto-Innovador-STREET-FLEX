import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/web/Header';
import Sidebar from '../../components/web/Sidebar';
import { useCart } from '../../context/CartContext';
import { shopService } from '../../api/shopService';
import './ReceiptScreen.css';

const ReceiptScreen = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const clientInfo = JSON.parse(localStorage.getItem('clientInfo') || '{}');
  
  const [addressData, setAddressData] = useState({
    phone: clientInfo.phone_number || '',
    city: 'New York City',
    address: '100 Main St',
    postalCode: '10001'
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!clientInfo._id) {
      navigate('/login', { replace: true });
    }
    if (cart.length === 0 && !success) {
      navigate('/cart', { replace: true });
    }
  }, [clientInfo, cart, navigate, success]);

  const handleInputChange = (e) => {
    setAddressData({ ...addressData, [e.target.name]: e.target.value });
  };

  const handleConfirmOrder = async () => {
    setLoading(true);
    try {
      const total = getCartTotal();
      
      const productsPayload = cart.map(item => ({
        id_product: item.product._id,
        quantity: item.quantity,
        price_unit: item.product.price
      }));

      // 1. Crear el carrito en la DB
      const cartResponse = await shopService.createShoppingCar({
        products: productsPayload,
        id_client: clientInfo._id,
        total: total,
        discount: 0,
        total_w_discount: total
      });

      const cartId = cartResponse.cartId;

      if (!cartId) throw new Error("No cart ID returned from server");

      // 2. Crear la Venta simulando el pago
      await shopService.createSale({
        id_shoppig_car: cartId,
        delivery_addres: addressData.address,
        city: addressData.city,
        payment_method: 'Wompi (Simulated)',
        payment_status: true
      });

      // 3. Éxito
      clearCart();
      setSuccess(true);

    } catch (error) {
      console.error("Error creating order:", error);
      alert("There was an error processing your order.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="receipt-page-container">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="receipt-main" style={{ textAlign: 'center', marginTop: '4rem' }}>
          <h1 className="receipt-title" style={{ color: '#4CAF50' }}>ORDER CONFIRMED</h1>
          <p style={{ color: 'white', marginTop: '1rem', fontSize: '1.2rem' }}>
            Thank you for your purchase! Your order is being processed.
          </p>
          <button 
            className="btn-buy" 
            style={{ marginTop: '3rem', maxWidth: '300px' }}
            onClick={() => navigate('/account/orders')}
          >
            VIEW ORDER HISTORY
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="receipt-page-container">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      
      <main className="receipt-main">
        <h1 className="receipt-title">CHECKOUT</h1>
        
        <div className="receipt-header-row">
          <span className="receipt-date">{new Date().toLocaleDateString()}</span>
        </div>
        
        <div className="receipt-ref-row">
          <span className="receipt-ref">Total Amount</span>
          <span className="receipt-total">${getCartTotal().toFixed(2)}</span>
        </div>
        
        <div className="receipt-section">
          <h2 className="receipt-section-title">DELIVERY DETAILS</h2>
          
          <div className="receipt-field">
            <span className="receipt-label">PHONE</span>
            <input 
              type="text" 
              name="phone"
              value={addressData.phone} 
              onChange={handleInputChange}
              className="receipt-input"
              style={{ background: 'transparent', border: '1px solid #333', color: 'white', padding: '0.5rem', width: '100%', marginTop: '0.5rem' }}
            />
          </div>
          
          <div className="receipt-field">
            <span className="receipt-label">CITY</span>
            <input 
              type="text" 
              name="city"
              value={addressData.city} 
              onChange={handleInputChange}
              className="receipt-input"
              style={{ background: 'transparent', border: '1px solid #333', color: 'white', padding: '0.5rem', width: '100%', marginTop: '0.5rem' }}
            />
          </div>
          
          <div className="receipt-field">
            <span className="receipt-label">ADDRESS</span>
            <input 
              type="text" 
              name="address"
              value={addressData.address} 
              onChange={handleInputChange}
              className="receipt-input"
              style={{ background: 'transparent', border: '1px solid #333', color: 'white', padding: '0.5rem', width: '100%', marginTop: '0.5rem' }}
            />
          </div>
          
          <div className="receipt-field">
            <span className="receipt-label">POSTAL CODE</span>
            <input 
              type="text" 
              name="postalCode"
              value={addressData.postalCode} 
              onChange={handleInputChange}
              className="receipt-input"
              style={{ background: 'transparent', border: '1px solid #333', color: 'white', padding: '0.5rem', width: '100%', marginTop: '0.5rem' }}
            />
          </div>
        </div>
        
        <div className="receipt-section mt-12">
          <h2 className="receipt-section-title">ITEMS</h2>
          
          {cart.map((item, index) => (
            <div key={index} className="receipt-item">
              <div className="receipt-item-header">
                <span className="receipt-item-name">{item.product.name}</span>
                <span className="receipt-item-price">${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
              <span className="receipt-item-size">(size: {item.product.selectedSize} - {item.product.selectedColor})</span>
              <div className="receipt-item-qty">
                <span className="qty-number">Qty: {item.quantity}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <button 
            className="btn-buy" 
            onClick={handleConfirmOrder}
            disabled={loading}
            style={{ width: '100%', padding: '1rem', background: 'white', color: 'black', fontWeight: 'bold' }}
          >
            {loading ? 'PROCESSING...' : 'CONFIRM ORDER & SIMULATE PAYMENT'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default ReceiptScreen;
