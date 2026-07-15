import React, { useState, useEffect } from 'react';
import { saleService } from '../../api/saleService';
import './SuppliersScreen.css';

const DeliveriesScreen = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await saleService.getSales();
        // Backend returns { message: 'Action done', data: [...] }
        const data = response?.data || (Array.isArray(response) ? response : []);
        setDeliveries(data);
        setFilteredDeliveries(data);
      } catch (err) {
        setError('Error loading deliveries/sales.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeliveries();
  }, []);

  useEffect(() => {
    let result = [...deliveries];
    if (filterQuery) {
      const q = filterQuery.toLowerCase();
      result = result.filter(d =>
        d._id?.toLowerCase().includes(q) ||
        d.city?.toLowerCase().includes(q)
      );
    }
    if (filterStatus === 'paid') result = result.filter(d => d.payment_status === true || d.payment_status === 'true');
    if (filterStatus === 'pending') result = result.filter(d => !d.payment_status || d.payment_status === 'false');
    setFilteredDeliveries(result);
  }, [filterQuery, filterStatus, deliveries]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    if (!status) return 'orange';
    const s = String(status).toLowerCase();
    if (s === 'true' || s.includes('paid') || s.includes('completed')) return 'green';
    if (s.includes('failed') || s.includes('cancelled')) return 'red';
    return 'orange';
  };

  const getStatusLabel = (status) => {
    if (!status) return 'Pending';
    const s = String(status).toLowerCase();
    if (s === 'true' || s.includes('paid')) return 'Paid';
    if (s === 'false' || s.includes('pending')) return 'Pending';
    return status;
  };

  return (
    <div className="suppliers-container">
      <div className="suppliers-header">
        <h1 className="suppliers-title">DELIVERIES & SALES</h1>
        <div className="suppliers-actions">
          <input
            type="text"
            placeholder="Search by ID or city..."
            className="filter-input"
            value={filterQuery}
            onChange={e => setFilterQuery(e.target.value)}
          />
          <button className="btn-filter" onClick={() => setShowFilter(v => !v)}>
            Filters {showFilter ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {showFilter && (
        <div className="filter-bar">
          <div className="filter-group">
            <label>Payment Status</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">All</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <button className="btn-clear-filter" onClick={() => { setFilterQuery(''); setFilterStatus(''); }}>
            Clear Filters
          </button>
        </div>
      )}

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
            ) : filteredDeliveries.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No deliveries found.</td></tr>
            ) : (
              filteredDeliveries.map((delivery) => (
                <tr key={delivery._id}>
                  <td style={{fontSize: '12px', opacity: 0.7}}>{delivery._id.substring(0, 10)}...</td>
                  <td style={{fontSize: '12px'}}>
                    {delivery.id_shoppig_car?.id_client?.full_name || 
                     delivery.id_shoppig_car?.id_client?.email || 
                     '-'}
                  </td>
                  <td>{delivery.delivery_addres || '-'}</td>
                  <td>{delivery.city || '-'}</td>
                  <td>{formatDate(delivery.createdAt)}</td>
                  <td className={`status-${getStatusColor(delivery.payment_status)}`}>
                    {getStatusLabel(delivery.payment_status)}
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
