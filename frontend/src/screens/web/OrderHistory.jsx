import React from 'react';
import './OrderHistory.css';

const MOCK_ORDERS = [
  {
    id: '923HS92_1',
    date: '04/17/2025',
    ref: '923HS92',
    price: '875'
  },
  {
    id: '923HS92_2',
    date: '03/24/2025',
    ref: '923HS92',
    price: '875'
  },
  {
    id: '923HS92_3',
    date: '02/12/2025',
    ref: '923HS92',
    price: '875'
  }
];

const OrderHistory = () => {
  return (
    <div className="order-history-container">
      <h2 className="section-title">ORDER HISTORY</h2>
      
      <div className="orders-list">
        {MOCK_ORDERS.map((order) => (
          <div className="order-row" key={order.id}>
            <div className="order-info">
              <span className="order-date">{order.date}</span>
              <div className="order-details">
                <span>Ref: {order.ref}</span>
                <span>${order.price}</span>
              </div>
            </div>
            
            <div className="order-actions">
              <button className="action-btn">VIEW</button>
              <button className="action-btn">RATE</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
