import React, { useState, useEffect } from 'react';
import ProductModal from '../../components/admin/ProductModal';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../api/productService';
import './InventoryScreen.css';

const InventoryScreen = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterAvail, setFilterAvail] = useState('');
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProducts();
      const list = Array.isArray(data) ? data : data.data || [];
      setProducts(list);
      setFilteredProducts(list);
    } catch (err) {
      setError('Error loading inventory. Check connection.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  // Apply filters whenever inputs change
  useEffect(() => {
    let result = [...products];
    if (filterQuery) {
      const q = filterQuery.toLowerCase();
      result = result.filter(p =>
        p.product_name?.toLowerCase().includes(q) ||
        (p.category?.name || p.category || '').toLowerCase().includes(q)
      );
    }
    if (filterCategory) {
      result = result.filter(p => (p.category?.name || p.category || '') === filterCategory);
    }
    if (filterAvail === 'in') result = result.filter(p => p.stock > 10);
    if (filterAvail === 'low') result = result.filter(p => p.stock > 0 && p.stock <= 10);
    if (filterAvail === 'out') result = result.filter(p => p.stock === 0);
    setFilteredProducts(result);
  }, [filterQuery, filterCategory, filterAvail, products]);

  const handleRowClick = (id) => navigate(`/admin/inventory/${id}`);

  const getAvailabilityInfo = (stock) => {
    if (stock > 10) return { text: 'In-stock', color: 'green' };
    if (stock > 0) return { text: 'Low stock', color: 'orange' };
    return { text: 'Out of stock', color: 'red' };
  };

  const uniqueCategories = [...new Set(products.map(p => p.category?.name || p.category).filter(Boolean))];

  return (
    <div className="inventory-container">
      <h1 className="inventory-main-title">INVENTORY</h1>

      <div className="overall-inventory">
        <h2 className="section-subtitle">Overall Inventory</h2>
        <div className="inventory-stats-grid">
          <div className="stat-card">
            <h3 className="stat-label text-blue">Categories</h3>
            <div className="stat-value">{loading ? '-' : uniqueCategories.length || 0}</div>
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
                  ${loading ? '...' : products.reduce((acc, p) => acc + (Number(p.price) || 0) * (Number(p.stock) || 0), 0).toLocaleString()}
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
                <div className="stat-value">{loading ? '-' : products.filter(p => p.stock <= 10 && p.stock > 0).length}</div>
                <div className="stat-desc">Low stock items</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{loading ? '-' : products.filter(p => p.stock === 0).length}</div>
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
            <input
              type="text"
              placeholder="Search products..."
              className="filter-input"
              value={filterQuery}
              onChange={e => setFilterQuery(e.target.value)}
            />
            <button className="btn-filter" onClick={() => setShowFilter(v => !v)}>
              Filters {showFilter ? '▲' : '▼'}
            </button>
            <button className="btn-add" onClick={() => setIsModalOpen(true)}>Add Product</button>
          </div>
        </div>

        {showFilter && (
          <div className="filter-bar">
            <div className="filter-group">
              <label>Category</label>
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                <option value="">All</option>
                {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label>Availability</label>
              <select value={filterAvail} onChange={e => setFilterAvail(e.target.value)}>
                <option value="">All</option>
                <option value="in">In-stock</option>
                <option value="low">Low stock</option>
                <option value="out">Out of stock</option>
              </select>
            </div>
            <button className="btn-clear-filter" onClick={() => { setFilterQuery(''); setFilterCategory(''); setFilterAvail(''); }}>
              Clear Filters
            </button>
          </div>
        )}

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
                <tr><td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>Loading products...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>No products found.</td></tr>
              ) : (
                filteredProducts.map((product) => {
                  const availInfo = getAvailabilityInfo(product.stock);
                  return (
                    <tr key={product._id || product.id} onClick={() => handleRowClick(product._id || product.id)} className="clickable-row">
                      <td>{product.product_name}</td>
                      <td>{product.category?.name || product.category || '-'}</td>
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
        onProductAdded={fetchProducts}
      />
    </div>
  );
};

export default InventoryScreen;
