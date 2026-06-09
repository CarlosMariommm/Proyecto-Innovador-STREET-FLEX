import React from 'react';
import './SuppliersScreen.css';

const MOCK_DELIVERIES = [
  { id: 1, tracking: 'TRK-982374', client: 'Alice Johnson', address: '123 Main St, NY', date: '12/10/24', status: 'In Transit', statusColor: 'orange' },
  { id: 2, tracking: 'TRK-982375', client: 'Bob Smith', address: '456 Oak St, CA', date: '12/09/24', status: 'Delivered', statusColor: 'green' },
  { id: 3, tracking: 'TRK-982376', client: 'Charlie Brown', address: '789 Pine St, TX', date: '12/11/24', status: 'Pending', statusColor: 'red' },
  { id: 4, tracking: 'TRK-982377', client: 'Diana Prince', address: '101 Elm St, FL', date: '12/08/24', status: 'Delivered', statusColor: 'green' },
  { id: 5, tracking: 'TRK-982378', client: 'Evan Wright', address: '202 Maple St, WA', date: '12/12/24', status: 'In Transit', statusColor: 'orange' },
];

const DeliveriesScreen = () => {
  return (
    <div className="suppliers-container">
      <div className="suppliers-header">
        <h1 className="suppliers-title">DELIVERIES</h1>
        
        <div className="suppliers-actions">
          <button className="btn-add">New Delivery</button>
          <button className="btn-filter">Filters</button>
          <button className="btn-download">Download all</button>
        </div>
      </div>
      
      <div className="suppliers-table-container">
        <table className="suppliers-table">
          <thead>
            <tr>
              <th>Tracking ID</th>
              <th>Client</th>
              <th>Address</th>
              <th>Est. Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_DELIVERIES.map((delivery) => (
              <tr key={delivery.id}>
                <td>{delivery.tracking}</td>
                <td>{delivery.client}</td>
                <td>{delivery.address}</td>
                <td>{delivery.date}</td>
                <td className={`status-${delivery.statusColor}`}>{delivery.status}</td>
              </tr>
            ))}
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
