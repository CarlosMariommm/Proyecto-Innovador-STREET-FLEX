import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../../api/productService';
import './InventoryDetailsScreen.css';

const InventoryDetailsScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Purchases', 'Adjustments', 'History'];

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductById(id);
        // Dependiendo si viene en { data: {} } o directo
        setProduct(data.data ? data.data : data);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Error al cargar los detalles del producto.");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  if (loading) {
    return <div className="inventory-details-container" style={{color: '#fff', padding: '20px'}}>Cargando detalles del producto...</div>;
  }

  if (error || !product) {
    return (
      <div className="inventory-details-container" style={{color: 'red', padding: '20px'}}>
        {error || "Producto no encontrado"}
        <br />
        <button className="btn-filter" onClick={() => navigate('/admin/inventory')} style={{marginTop: '15px'}}>
          Volver al Inventario
        </button>
      </div>
    );
  }

  return (
    <div className="inventory-details-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button className="btn-filter" onClick={() => navigate('/admin/inventory')} style={{ padding: '8px 12px' }}>
          &larr; Back
        </button>
        <h1 className="inventory-main-title" style={{ margin: 0 }}>INVENTORY</h1>
      </div>
      
      <div className="details-header">
        <h2 className="product-name-title">{product.product_name}</h2>
        <div className="details-actions">
          <button className="btn-edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit
          </button>
          <button className="btn-download-small">Download</button>
        </div>
      </div>
      
      <div className="details-tabs">
        {tabs.map(tab => (
          <button 
            key={tab} 
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      
      <div className="details-content-grid">
        <div className="details-left">
          <div className="details-section">
            <h3 className="details-section-title">Primary Details</h3>
            <div className="detail-row">
              <span className="detail-label">Product name</span>
              <span className="detail-value">{product.product_name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Product ID</span>
              <span className="detail-value">{product._id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Product category</span>
              <span className="detail-value">{product.category || '-'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Season</span>
              <span className="detail-value">{product.seson || '-'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Units</span>
              <span className="detail-value">{product.units || '-'}</span>
            </div>
          </div>
          
          <div className="details-section mt-8">
            <h3 className="details-section-title">Supplier Details</h3>
            <div className="detail-row">
              <span className="detail-label">Supplier ID / Info</span>
              <span className="detail-value">Mapped via DB</span>
            </div>
          </div>
        </div>
        
        <div className="details-right">
          <div className="product-image-box" style={{ overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {product.image ? (
               <img src={product.image} alt={product.product_name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
               <div style={{ color: '#666' }}>No Image</div>
            )}
          </div>
          
          <div className="stock-summary">
            <div className="stock-row">
              <span className="stock-label">Price</span>
              <span className="stock-value" style={{ color: '#4ade80' }}>${product.price}</span>
            </div>
            <div className="stock-row">
              <span className="stock-label">Stock in Hand</span>
              <span className="stock-value">{product.stock}</span>
            </div>
            <div className="stock-row">
              <span className="stock-label">Status</span>
              <span className="stock-value" style={{ color: product.active ? '#4ade80' : '#ef4444' }}>
                {product.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryDetailsScreen;
