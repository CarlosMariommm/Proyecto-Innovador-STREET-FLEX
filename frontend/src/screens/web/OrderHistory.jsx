import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/api';
import './OrderHistory.css';

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const res = await api.get(`/sales/client/${user._id}`);
        setOrders(res.data.data || []);
      } catch (err) {
        console.error('Error al cargar historial:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (loading) {
    return <div className="order-history-container"><p>Cargando historial...</p></div>;
  }

  return (
    <div className="order-history-container">
      <h2 className="section-title">ORDER HISTORY</h2>
      
      {orders.length === 0 ? (
        <p style={{ fontWeight: 300, opacity: 0.6 }}>No tienes pedidos aún.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const cart = order.id_shoppig_car;
            const date = new Date(order.createdAt).toLocaleDateString('es-MX');
            const total = cart?.total || 0;
            const refId = order._id.slice(-6).toUpperCase();

            return (
              <div className="order-row" key={order._id}>
                <div className="order-info">
                  <span className="order-date">{date}</span>
                  <div className="order-details">
                    <span>Ref: {refId}</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="order-actions">
                  <span className="order-status">{order.payment_status || 'Completado'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;

