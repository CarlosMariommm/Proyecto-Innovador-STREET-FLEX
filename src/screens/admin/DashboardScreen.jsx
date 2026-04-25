import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import './DashboardScreen.css';

const salesData = [
  { name: 'Jan', purchase: 55000, sales: 50000 },
  { name: 'Feb', purchase: 58000, sales: 48000 },
  { name: 'Mar', purchase: 45000, sales: 53000 },
  { name: 'Apr', purchase: 37000, sales: 44000 },
  { name: 'May', purchase: 44000, sales: 47000 },
  { name: 'Jun', purchase: 29000, sales: 42000 },
  { name: 'Jul', purchase: 55000, sales: 50000 },
  { name: 'Aug', purchase: 45000, sales: 43000 },
  { name: 'Sep', purchase: 45000, sales: 44000 },
  { name: 'Oct', purchase: 37000, sales: 44000 },
];

const orderData = [
  { name: 'Jan', ordered: 3800, delivered: 3300 },
  { name: 'Feb', ordered: 1800, delivered: 2200 },
  { name: 'Mar', ordered: 2800, delivered: 3800 },
  { name: 'Apr', ordered: 2200, delivered: 3500 },
  { name: 'May', ordered: 2600, delivered: 2800 },
  { name: 'Jun', ordered: 1600, delivered: 3800 },
  { name: 'Jul', ordered: 2400, delivered: 3500 },
];

const DashboardScreen = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="admin-main-title">DASHBOARD</h1>
        <div className="dashboard-actions">
          <button className="btn-filter">Filter v</button>
          <button className="btn-filter">Today v</button>
        </div>
      </div>
      
      <div className="dashboard-grid-top">
        <div className="card-section sales-overview">
          <h2 className="card-title">Sales Overview</h2>
          <div className="card-stats-row">
            <div className="stat-box">
              <span className="stat-value">$832</span>
              <span className="stat-label">Sales</span>
            </div>
            <div className="stat-box border-left">
              <span className="stat-value">$18,300</span>
              <span className="stat-label">Revenue</span>
            </div>
            <div className="stat-box border-left">
              <span className="stat-value">$868</span>
              <span className="stat-label">Profit</span>
            </div>
            <div className="stat-box border-left">
              <span className="stat-value">$17,432</span>
              <span className="stat-label">Cost</span>
            </div>
          </div>
        </div>
        
        <div className="card-section inventory-summary">
          <h2 className="card-title">Inventory Summary</h2>
          <div className="card-stats-row">
            <div className="stat-box">
              <span className="stat-value">868</span>
              <span className="stat-label">Quantity in Hand</span>
            </div>
            <div className="stat-box border-left">
              <span className="stat-value">200</span>
              <span className="stat-label">To be received</span>
            </div>
          </div>
        </div>
        
        <div className="card-section purchase-overview">
          <h2 className="card-title">Purchase Overview</h2>
          <div className="card-stats-row">
            <div className="stat-box">
              <span className="stat-value">82</span>
              <span className="stat-label">Purchase</span>
            </div>
            <div className="stat-box border-left">
              <span className="stat-value">$13,573</span>
              <span className="stat-label">Cost</span>
            </div>
            <div className="stat-box border-left">
              <span className="stat-value">5</span>
              <span className="stat-label">Cancel</span>
            </div>
            <div className="stat-box border-left">
              <span className="stat-value">$17,432</span>
              <span className="stat-label">Return</span>
            </div>
          </div>
        </div>
        
        <div className="card-section product-summary">
          <h2 className="card-title">Product Summary</h2>
          <div className="card-stats-row">
            <div className="stat-box">
              <span className="stat-value">31</span>
              <span className="stat-label">Number of Suppliers</span>
            </div>
            <div className="stat-box border-left">
              <span className="stat-value">21</span>
              <span className="stat-label">Number of Categories</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="dashboard-grid-middle">
        <div className="chart-card">
          <div className="chart-header">
            <h2 className="card-title">Sales & Purchase</h2>
            <button className="btn-filter btn-small">Weekly</button>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={salesData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#666'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#666'}} />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{fontSize: '12px', paddingTop: '20px'}} />
                <Bar dataKey="purchase" name="Purchase" fill="#71a8ff" radius={[4, 4, 0, 0]} barSize={8} />
                <Bar dataKey="sales" name="Sales" fill="#4ade80" radius={[4, 4, 0, 0]} barSize={8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="chart-card">
          <div className="chart-header">
            <h2 className="card-title">Order Summary</h2>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={orderData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#666'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#666'}} />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{fontSize: '12px', paddingTop: '20px'}} />
                <Line type="monotone" dataKey="ordered" name="Ordered" stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="delivered" name="Delivered" stroke="#93c5fd" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="dashboard-grid-bottom">
        <div className="table-card">
          <div className="table-header">
            <h2 className="card-title">Top Selling Stock</h2>
            <button className="btn-text">See All</button>
          </div>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Sold Quantity</th>
                <th>Remaining Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Surf Excel</td>
                <td>30</td>
                <td>12</td>
                <td>$100</td>
              </tr>
              <tr>
                <td>Rin</td>
                <td>21</td>
                <td>15</td>
                <td>$207</td>
              </tr>
              <tr>
                <td>Parle G</td>
                <td>19</td>
                <td>17</td>
                <td>$105</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="table-card">
          <div className="table-header">
            <h2 className="card-title">Low Quantity Stock</h2>
            <button className="btn-text">See All</button>
          </div>
          <div className="low-stock-list">
            <div className="low-stock-item">
              <img src="/images/product-1.jpg" alt="Referee Polo Grey" className="low-stock-img" />
              <div className="low-stock-info">
                <h4>REFEREE POLO GREY</h4>
                <p>Remaining Quantity : 10 Shirt</p>
              </div>
              <span className="low-badge">Low</span>
            </div>
            <div className="low-stock-item">
              <img src="/images/coat-1.jpg" alt="Referee Polo Grey" className="low-stock-img" />
              <div className="low-stock-info">
                <h4>REFEREE POLO GREY</h4>
                <p>Remaining Quantity : 15 Shirt</p>
              </div>
              <span className="low-badge">Low</span>
            </div>
            <div className="low-stock-item">
              <img src="/images/product-2.jpg" alt="Referee Polo Grey" className="low-stock-img" />
              <div className="low-stock-info">
                <h4>REFEREE POLO GREY</h4>
                <p>Remaining Quantity : 15 Shirt</p>
              </div>
              <span className="low-badge">Low</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
