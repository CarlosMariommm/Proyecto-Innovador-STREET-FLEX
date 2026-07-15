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
        setProduct(data.data ? data.data : data);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Error loading product details.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProductDetails();
  }, [id]);

  if (loading) return <div className="inventory-details-container" style={{padding: '20px'}}>Loading product...</div>;
  if (error || !product) {
    return (
      <div className="inventory-details-container" style={{padding: '20px'}}>
        <p style={{color: 'red', marginBottom: '16px'}}>{error || 'Product not found'}</p>
        <button className="btn-back" onClick={() => navigate('/admin/inventory')}>← Back</button>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
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
                  <span className="detail-value" style={{fontSize: '12px', opacity: 0.6}}>{product._id}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Category</span>
                  <span className="detail-value">{product.category?.name || product.category || '-'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Season</span>
                  <span className="detail-value">{product.seson || '-'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Units</span>
                  <span className="detail-value">{product.units || '-'}</span>
                </div>
                {product.description && (
                  <div className="detail-row">
                    <span className="detail-label">Description</span>
                    <span className="detail-value">{product.description}</span>
                  </div>
                )}
              </div>

              {(product.material || product.care_instructions || product.shipping_returns) && (
                <div className="details-section mt-8">
                  <h3 className="details-section-title">Product Info</h3>
                  {product.material && (
                    <div className="detail-row">
                      <span className="detail-label">Material</span>
                      <span className="detail-value">{product.material}</span>
                    </div>
                  )}
                  {product.care_instructions && (
                    <div className="detail-row">
                      <span className="detail-label">Care Instructions</span>
                      <span className="detail-value">{product.care_instructions}</span>
                    </div>
                  )}
                  {product.shipping_returns && (
                    <div className="detail-row">
                      <span className="detail-label">Shipping & Returns</span>
                      <span className="detail-value">{product.shipping_returns}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="details-section mt-8">
                <h3 className="details-section-title">Supplier Details</h3>
                <div className="detail-row">
                  <span className="detail-label">Supplier</span>
                  <span className="detail-value">{product.supplier?.supp_name || product.supplier?.name || product.supplier || 'Not assigned'}</span>
                </div>
              </div>
            </div>

            <div className="details-right">
              <div className="product-image-box">
                {product.image ? (
                  <img src={product.image} alt={product.product_name} className="product-detail-img" />
                ) : (
                  <div className="no-image-placeholder">
                    <span>No Image</span>
                  </div>
                )}
              </div>

              <div className="stock-summary">
                <div className="stock-row">
                  <span className="stock-label">Price</span>
                  <span className="stock-value stock-green">${product.price}</span>
                </div>
                <div className="stock-row">
                  <span className="stock-label">Stock in Hand</span>
                  <span className="stock-value">{product.stock}</span>
                </div>
                <div className="stock-row">
                  <span className="stock-label">Status</span>
                  <span className={`stock-value ${product.active ? 'stock-green' : 'stock-red'}`}>
                    {product.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Purchases':
        return (
          <div className="tab-placeholder">
            <h3 className="details-section-title">Purchase History</h3>
            <p style={{opacity: 0.5, marginTop: '16px'}}>No purchase records yet for this product.</p>
          </div>
        );
      case 'Adjustments':
        return (
          <div className="tab-placeholder">
            <h3 className="details-section-title">Stock Adjustments</h3>
            <div className="adjustment-form">
              <p style={{opacity: 0.7, marginBottom: '16px', fontSize: '14px'}}>Manually adjust stock quantity:</p>
              <div className="adj-row">
                <span className="detail-label">Current Stock</span>
                <span className="detail-value">{product.stock}</span>
              </div>
              <p style={{opacity: 0.4, fontSize: '13px', marginTop: '24px'}}>Adjustment entries will be tracked in future versions.</p>
            </div>
          </div>
        );
      case 'History':
        return (
          <div className="tab-placeholder">
            <h3 className="details-section-title">Activity History</h3>
            <div className="history-item">
              <span className="history-badge">Created</span>
              <span className="history-text">{new Date(product.createdAt).toLocaleDateString()}</span>
            </div>
            {product.updatedAt !== product.createdAt && (
              <div className="history-item">
                <span className="history-badge history-badge-update">Updated</span>
                <span className="history-text">{new Date(product.updatedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="inventory-details-container">
      <div className="details-topbar">
        <button className="btn-back" onClick={() => navigate('/admin/inventory')}>← Back</button>
        <h1 className="inventory-main-title">INVENTORY</h1>
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

      {renderTabContent()}
    </div>
  );
};

export default InventoryDetailsScreen;
