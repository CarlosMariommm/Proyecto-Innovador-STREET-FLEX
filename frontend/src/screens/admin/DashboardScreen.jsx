import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { productService } from '../../api/productService';
import { supplierService } from '../../api/supplierService';
import { saleService } from '../../api/saleService';
import './DashboardScreen.css';

// Mock data para los gráficos hasta que tengamos endpoints históricos
const salesData = [
  { name: 'Jan', purchase: 55000, sales: 50000 },
  { name: 'Feb', purchase: 58000, sales: 48000 },
  { name: 'Mar', purchase: 45000, sales: 53000 },
  { name: 'Apr', purchase: 37000, sales: 44000 },
  { name: 'May', purchase: 44000, sales: 47000 },
  { name: 'Jun', purchase: 29000, sales: 42000 },
];

const orderData = [
  { name: 'Jan', ordered: 3800, delivered: 3300 },
  { name: 'Feb', ordered: 1800, delivered: 2200 },
  { name: 'Mar', ordered: 2800, delivered: 3800 },
  { name: 'Apr', ordered: 2200, delivered: 3500 },
];

const DashboardScreen = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSuppliers: 0,
    totalSalesCount: 0,
    totalRevenue: 0,
    totalStockQuantity: 0,
    uniqueCategories: 0,
    lowStockProducts: [],
    topSellingProducts: [] // Mock por ahora
  });
  const [loading, setLoading] = useState(true);

  const downloadPDF = async () => {
    try {
      const doc = new jsPDF();
      
      // Título
      doc.setFontSize(20);
      doc.text("Street Flex - Dashboard Report", 14, 22);
      
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      
      // Resumen
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text("Executive Summary", 14, 45);
      
      autoTable(doc, {
        startY: 50,
        head: [['Metric', 'Value']],
        body: [
          ['Total Sales', stats.totalSalesCount.toString()],
          ['Est. Revenue', `$${stats.totalSalesCount * 120}`],
          ['Items in DB', stats.totalProducts.toString()],
          ['Total Stock Quantity', stats.totalStockQuantity.toString()],
          ['Total Suppliers', stats.totalSuppliers.toString()]
        ],
        theme: 'striped',
        headStyles: { fillColor: [0, 0, 0] }
      });
      
      // Top Selling Products
      const finalY = doc.lastAutoTable.finalY || 50;
      doc.text("Top Selling Stock", 14, finalY + 15);
      
      const topProductsBody = stats.topSellingProducts.map(p => [
        p.product_name,
        `$${p.price}`,
        p.stock.toString(),
        p.category || 'N/A'
      ]);
      
      autoTable(doc, {
        startY: finalY + 20,
        head: [['Name', 'Price', 'Remaining Stock', 'Category']],
        body: topProductsBody.length ? topProductsBody : [['No data', '-', '-', '-']],
        theme: 'striped',
        headStyles: { fillColor: [0, 0, 0] }
      });
      
      // Low Stock
      const finalY2 = doc.lastAutoTable.finalY || finalY + 20;
      doc.text("Low Quantity Stock", 14, finalY2 + 15);
      
      const lowStockBody = stats.lowStockProducts.map(p => [
        p.product_name,
        p.stock.toString()
      ]);
      
      autoTable(doc, {
        startY: finalY2 + 20,
        head: [['Name', 'Remaining Quantity']],
        body: lowStockBody.length ? lowStockBody : [['All stocks healthy', '-']],
        theme: 'striped',
        headStyles: { fillColor: [220, 53, 69] } // Rojo para low stock
      });

      doc.save('street_flex_dashboard_report.pdf');
    } catch (err) {
      console.error('PDF Generation Error:', err);
      // Wait to see if we can use toast here? If not, just alert
      alert('Could not generate PDF. ' + err.message);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Traemos datos concurrentemente
        const [productsRes, suppliersRes, salesRes] = await Promise.all([
          productService.getProducts(),
          supplierService.getSuppliers(),
          saleService.getSales()
        ]);

        const products = Array.isArray(productsRes) ? productsRes : productsRes.data || [];
        const suppliers = Array.isArray(suppliersRes) ? suppliersRes : suppliersRes.data || [];
        const sales = Array.isArray(salesRes) ? salesRes : salesRes.data || [];

        // Cálculos
        const totalStock = products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
        const categories = new Set(products.map(p => p.category).filter(Boolean)).size;
        
        // Ventas: el modelo de Sales no tiene un total numérico a menos que exploremos id_shoppig_car
        // Por simplicidad, contamos cuántas hay.
        const salesCount = sales.length;

        // Productos bajos en stock (menor a 10)
        const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).slice(0, 3);
        
        // Productos más vendidos (usaremos los primeros 3 productos como fallback para la demo)
        const topSelling = products.slice(0, 3);

        setStats({
          totalProducts: products.length,
          totalSuppliers: suppliers.length,
          totalSalesCount: salesCount,
          totalStockQuantity: totalStock,
          uniqueCategories: categories,
          lowStockProducts: lowStock,
          topSellingProducts: topSelling,
        });

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="admin-main-title">DASHBOARD</h1>
        <div className="dashboard-actions">
          <button className="btn-download-pdf" onClick={downloadPDF}>⬇ Download PDF</button>
        </div>
      </div>
      
      <div className="dashboard-layout">
        {/* Left Column */}
        <div className="dashboard-column-left">
          
          <div className="card-section sales-overview">
            <h2 className="card-title">Sales Overview</h2>
            <div className="card-stats-row">
              <div className="stat-box">
                <span className="stat-value">{loading ? '...' : stats.totalSalesCount}</span>
                <span className="stat-label">Total Sales</span>
              </div>
              <div className="stat-box border-left">
                <span className="stat-value">$ {loading ? '...' : (stats.totalSalesCount * 120)}</span>
                <span className="stat-label">Est. Revenue</span>
              </div>
              <div className="stat-box border-left">
                <span className="stat-value">$ {loading ? '...' : (stats.totalSalesCount * 45)}</span>
                <span className="stat-label">Profit</span>
              </div>
              <div className="stat-box border-left">
                <span className="stat-value">$ {loading ? '...' : (stats.totalSalesCount * 75)}</span>
                <span className="stat-label">Cost</span>
              </div>
            </div>
          </div>

          <div className="card-section product-summary">
            <h2 className="card-title">Product Summary</h2>
            <div className="card-stats-row">
              <div className="stat-box">
                <span className="stat-value">{loading ? '...' : stats.totalSuppliers}</span>
                <span className="stat-label">Suppliers</span>
              </div>
              <div className="stat-box border-left">
                <span className="stat-value">{loading ? '...' : stats.uniqueCategories}</span>
                <span className="stat-label">Categories</span>
              </div>
              <div className="stat-box border-left">
                <span className="stat-value">{loading ? '...' : stats.totalProducts}</span>
                <span className="stat-label">Items in DB</span>
              </div>
            </div>
          </div>

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

          <div className="table-card">
            <div className="table-header">
              <h2 className="card-title">Top Selling Stock</h2>
              <button className="btn-text">See All</button>
            </div>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Remaining Stock</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4">Loading...</td></tr>
                ) : stats.topSellingProducts.length === 0 ? (
                  <tr><td colSpan="4">No products found</td></tr>
                ) : (
                  stats.topSellingProducts.map(p => (
                    <tr key={p._id}>
                      <td>{p.product_name}</td>
                      <td>${p.price}</td>
                      <td>{p.stock}</td>
                      <td>{p.category}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right Column */}
        <div className="dashboard-column-right">

          <div className="card-section inventory-summary">
            <h2 className="card-title">Inventory Summary</h2>
            <div className="card-stats-row">
              <div className="stat-box">
                <span className="stat-value">{loading ? '...' : stats.totalStockQuantity}</span>
                <span className="stat-label">Quantity in Hand</span>
              </div>
              <div className="stat-box border-left">
                <span className="stat-value">0</span>
                <span className="stat-label">To be received</span>
              </div>
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

          <div className="table-card">
            <div className="table-header">
              <h2 className="card-title">Low Quantity Stock</h2>
              <button className="btn-text">See All</button>
            </div>
            <div className="low-stock-list">
              {loading ? (
                 <div style={{padding: '20px'}}>Loading...</div>
              ) : stats.lowStockProducts.length === 0 ? (
                 <div style={{padding: '20px'}}>All stocks are healthy!</div>
              ) : (
                stats.lowStockProducts.map(p => (
                  <div className="low-stock-item" key={p._id}>
                    <img src={p.image || "/images/product-1.png"} alt={p.product_name} className="low-stock-img" style={{objectFit: 'cover'}} />
                    <div className="low-stock-info">
                      <h4>{p.product_name}</h4>
                      <p>Remaining Quantity: {p.stock}</p>
                    </div>
                    <span className="low-badge">Low</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
