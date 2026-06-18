import React, { useState, useEffect } from 'react';
import { saleService } from '../../api/saleService';
import './SuppliersScreen.css'; // Mismo layout

const DeliveriesScreen = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await saleService.getSales();
        const data = Array.isArray(response) ? response : response.data || [];
        setDeliveries(data);
      } catch (err) {
        setError("Error al cargar entregas/ventas.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeliveries();
  }, []);

  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Función para determinar color del estado
  const getStatusColor = (status) => {
    if (!status) return 'orange';
    const s = status.toLowerCase();
    if (s.includes('paid') || s.includes('delivered') || s.includes('completed')) return 'green';
    if (s.includes('failed') || s.includes('cancelled')) return 'red';
    return 'orange'; // pending, etc.
  };

  return (
    <div className="suppliers-container">
      <div className="suppliers-header">
        <h1 className="suppliers-title">DELIVERIES & SALES</h1>
        
        <div className="suppliers-actions">
          <button className="btn-filter">Filters</button>
          <button className="btn-download">Download all</button>
        </div>
      </div>
      
      {error && <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>}

      <div className="suppliers-table-container">
        <table className="suppliers-table">
          <thead>
            <tr>
              <th>Tracking ID (Sale)</th>
              <th>Client (Cart ID)</th>
              <th>Delivery Address</th>
              <th>City</th>
              <th>Date</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Loading deliveries...</td></tr>
            ) : deliveries.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No deliveries found.</td></tr>
            ) : (
              deliveries.map((delivery) => (
                <tr key={delivery._id}>
                  <td>{delivery._id.substring(0, 10)}...</td>
                  {/* Si está populado, extraemos id_client, sino mostramos el id del carrito */}
                  <td>{delivery.id_shoppig_car?.id_client || delivery.id_shoppig_car || '-'}</td>
                  <td>{delivery.delivery_addres || '-'}</td>
                  <td>{delivery.city || '-'}</td>
                  <td>{formatDate(delivery.createdAt)}</td>
                  <td className={`status-${getStatusColor(delivery.payment_status)}`}>
                    {delivery.payment_status || 'Pending'}
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
    </div>
  );
};

export default DeliveriesScreen;
