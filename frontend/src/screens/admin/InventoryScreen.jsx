import React, { useState, useEffect } from 'react';
import ProductModal from '../../components/admin/ProductModal';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../api/productService';
import './InventoryScreen.css';

const InventoryScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      // Asumiendo que el backend retorna los productos directamente o dentro de data
      const data = await productService.getProducts();
      // Dependiendo de cómo devuelva la data tu backend:
      setProducts(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError('Error al cargar el inventario. Verifica la conexión con el servidor.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleRowClick = (id) => {
    navigate(`/admin/inventory/${id}`);
  };

  // Funciones auxiliares para calcular la disponibilidad
  const getAvailabilityInfo = (stock) => {
    if (stock > 10) return { text: 'In- stock', color: 'green' };
    if (stock > 0) return { text: 'Low stock', color: 'orange' };
    return { text: 'Out of stock', color: 'red' };
  };

  return (
    <div className="inventory-container">
      <h1 className="inventory-main-title">INVENTORY</h1>
      
      <div className="overall-inventory">
        <h2 className="section-subtitle">Overall Inventory</h2>
        <div className="inventory-stats-grid">
          <div className="stat-card">
            <h3 className="stat-label text-blue">Categories</h3>
            {/* Calculamos categorías únicas de los productos reales si existen */}
            <div className="stat-value">
              {loading ? '-' : new Set(products.map(p => p.category).filter(Boolean)).size || 14}
            </div>
            <div className="stat-desc">All time</div>
          </div>
          
          <div className="stat-card border-left">
            <h3 className="stat-label text-orange">Total Products</h3>
            <div className="stat-value-row">
              <div className="stat-item">
                <div className="stat-value">{loading ? '...' : products.length}</div>
                <div className="stat-desc">Items in DB</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  ${loading ? '...' : products.reduce((acc, p) => acc + (Number(p.price) || 0) * (Number(p.stock) || 0), 0)}
                </div>
                <div className="stat-desc">Inventory Value</div>
              </div>
            </div>
          </div>
          
          <div className="stat-card border-left">
            <h3 className="stat-label text-purple">Top Selling</h3>
            <div className="stat-value-row">
              <div className="stat-item">
                <div className="stat-value">5</div>
                <div className="stat-desc">Last 7 days</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">$2500</div>
                <div className="stat-desc">Revenue</div>
              </div>
            </div>
          </div>
          
          <div className="stat-card border-left">
            <h3 className="stat-label text-red">Low Stocks</h3>
            <div className="stat-value-row">
              <div className="stat-item">
                <div className="stat-value">
                  {loading ? '-' : products.filter(p => p.stock <= 10 && p.stock > 0).length}
                </div>
                <div className="stat-desc">Low stock items</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  {loading ? '-' : products.filter(p => p.stock === 0).length}
                </div>
                <div className="stat-desc">Not in stock</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="products-section">
        <div className="products-header">
          <h2 className="section-subtitle">Products</h2>
          <div className="products-actions">
            <button className="btn-add" onClick={() => setIsModalOpen(true)}>Add Product</button>
            <button className="btn-filter">Filters</button>
            <button className="btn-download">Download all</button>
          </div>
        </div>
        
        {error && <div className="error-message" style={{color: 'red', margin: '10px 0'}}>{error}</div>}

        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Products</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity (Stock)</th>
                <th>Units</th>
                <th>Season</th>
                <th>Availability</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>Loading products...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>No products found. Add one!</td>
                </tr>
              ) : (
                products.map((product) => {
                  const availInfo = getAvailabilityInfo(product.stock);
                  return (
                    <tr key={product._id || product.id} onClick={() => handleRowClick(product._id || product.id)} className="clickable-row">
                      <td>{product.product_name}</td>
                      <td>{product.category || '-'}</td>
                      <td>${product.price}</td>
                      <td>{product.stock}</td>
                      <td>{product.units || '-'}</td>
                      <td>{product.seson || '-'}</td>
                      <td className={`status-${availInfo.color}`}>{availInfo.text}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        <div className="inventory-pagination">
          <button className="btn-page">Previous</button>
          <span>Page 1 of 1</span>
          <button className="btn-page">Next</button>
        </div>
      </div>
      
      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onProductAdded={fetchProducts} // Callback para recargar la tabla
      />
    </div>
  );
};

export default InventoryScreen;
