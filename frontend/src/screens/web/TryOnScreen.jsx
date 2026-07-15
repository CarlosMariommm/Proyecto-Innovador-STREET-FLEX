import React, { useState, useEffect } from 'react';
import Header from '../../components/web/Header';
import Sidebar from '../../components/web/Sidebar';
import ProductGrid from '../../components/web/ProductGrid';
import { Plus, Minus, Loader2 } from 'lucide-react';
import { productService } from '../../api/productService';
import { useToast } from '../../hooks/useToast';
import './TryOnScreen.css';

const POSITION_MAP = {
  'Camisetas': { top: '15%', width: '55%', zIndex: 3 },
  'Pantalones': { top: '45%', width: '50%', zIndex: 2 },
  'Zapatos': { top: '78%', width: '35%', zIndex: 1 },
  'Accesorios': { top: '5%', width: '30%', zIndex: 4 },
  'Chaquetas': { top: '15%', width: '60%', zIndex: 4 },
  'default': { top: '25%', width: '55%', zIndex: 3 },
};

const getCategoryName = (product) => {
  return product.category?.name || 'OTHER';
};


const TryOnScreen = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSection, setOpenSection] = useState('ALL');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // AI Try-On State
  const [selectedOutfits, setSelectedOutfits] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [modelImage, setModelImage] = useState('/images/model-tryon.png'); // Base model
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productService.getProducts();
        setProducts(res.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const toggleSection = (section) => {
    if (openSection === section) {
      setOpenSection(null);
    } else {
      setOpenSection(section);
    }
  };

  const handleTryOn = (product) => {
    const catName = getCategoryName(product);
    setSelectedOutfits(prev => ({
      ...prev,
      [catName]: product
    }));
    setIsGenerating(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      setIsGenerating(false);
      showToast(`Generado exitosamente: ${product.name}`, 'success');
    }, 2000);
  };

  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    const catName = getCategoryName(product);
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(product);
    return acc;
  }, {});

  const categories = Object.keys(groupedProducts).length > 0 ? Object.keys(groupedProducts) : ['ALL'];

  return (
    <div className="try-on-page-container">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      
      <main className="try-on-main">
        <div className="try-on-layout">
          
          <div className="try-on-left-col">
            <div className="model-image-container" style={{ position: 'relative', overflow: 'hidden' }}>
              {isGenerating && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', zIndex: 10, color: '#fff'
                }}>
                  <Loader2 size={48} className="animate-spin" style={{ marginBottom: '1rem', animation: 'spin 1s linear infinite' }} />
                  <p style={{ letterSpacing: '2px', fontWeight: 'bold' }}>GENERATING AI FIT...</p>
                  <p style={{ fontSize: '12px', fontWeight: 300, marginTop: '10px' }}>Powered by Google Cloud Vertex AI</p>
                </div>
              )}
              
              <img 
                src={modelImage} 
                alt="Base Model" 
                className="model-image"
                style={{ opacity: isGenerating ? 0.3 : 1, transition: 'opacity 0.3s ease', width: '100%', display: 'block' }}
                onError={(e) => { e.target.src = '/images/product-1.png'; }}
              />

              {/* Overlay de los productos simulando el Try-On */}
              {!isGenerating && Object.entries(selectedOutfits).map(([catName, product]) => {
                const pos = POSITION_MAP[catName] || POSITION_MAP['default'];
                return (
                  <img 
                    key={product._id}
                    src={product.image} 
                    alt="fitted outfit" 
                    style={{
                      position: 'absolute',
                      top: pos.top,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: pos.width, 
                      mixBlendMode: 'multiply',
                      opacity: 0.9,
                      pointerEvents: 'none',
                      zIndex: pos.zIndex
                    }}
                  />
                );
              })}
              
              {Object.keys(selectedOutfits).length > 0 && !isGenerating && (
                <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'rgba(0,0,0,0.8)', padding: '10px', display: 'flex', flexDirection: 'column', gap: '5px', border: '1px solid var(--border-color)', zIndex: 15, maxHeight: '200px', overflowY: 'auto' }}>
                  <div style={{ fontSize: '10px', color: '#aaa', marginBottom: '5px' }}>CURRENTLY WEARING:</div>
                  {Object.values(selectedOutfits).map(prod => (
                    <div key={prod._id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={prod.image} alt="fit" style={{ width: '30px', height: '30px', objectFit: 'cover', background: 'white' }} />
                      <div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{prod.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="try-on-right-col">
            <h1 style={{ color: 'var(--primary-color)', marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 400, letterSpacing: '2px' }}>
              VIRTUAL TRY-ON
            </h1>
            <p style={{ color: 'var(--accent-color)', marginBottom: '2rem', fontWeight: 300, lineHeight: 1.5, fontSize: '0.9rem' }}>
              Select a piece from our collection to see how it fits on our base model.
            </p>

            {loading ? (
              <p style={{ color: 'var(--primary-color)' }}>Loading items...</p>
            ) : (
              <div className="try-on-accordions">
                {categories.map((cat) => (
                  <div className="accordion-item" key={cat}>
                    <button 
                      className="accordion-header" 
                      onClick={() => toggleSection(cat)}
                    >
                      <span style={{ textTransform: 'uppercase' }}>{cat}</span>
                      {openSection === cat ? <Minus size={16} /> : <Plus size={16} />}
                    </button>
                    {openSection === cat && (
                      <div className="accordion-content">
                        <div className="try-on-items-grid">
                          {(groupedProducts[cat] || products).map(prod => (
                            <div 
                              key={prod._id} 
                              className="try-on-item-box"
                              onClick={() => handleTryOn(prod)}
                              style={{ cursor: 'pointer', border: Object.values(selectedOutfits).some(p => p._id === prod._id) ? '2px solid var(--primary-color)' : 'none' }}
                            >
                              <img src={prod.image || '/images/product-1.png'} alt={prod.name} />
                              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.8)', padding: '5px', fontSize: '10px', color: '#fff', textAlign: 'center' }}>
                                TRY ON
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
        </div>
        
        <div className="more-collection-section">
          <h2 className="section-title">MORE OF THE NEW COLLECTION</h2>
          <ProductGrid />
        </div>
      </main>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default TryOnScreen;
