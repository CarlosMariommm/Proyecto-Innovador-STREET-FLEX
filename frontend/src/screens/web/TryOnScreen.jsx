import React, { useState, useEffect } from 'react';
import Header from '../../components/web/Header';
import Sidebar from '../../components/web/Sidebar';
import ProductGrid from '../../components/web/ProductGrid';
import { Plus, Minus, Loader2, Upload, RotateCcw } from 'lucide-react';
import { productService } from '../../api/productService';
import { aiTryOnService } from '../../api/aiTryOnService';
import { useToast } from '../../hooks/useToast';
import './TryOnScreen.css';

const DEFAULT_MODEL_IMAGE = '/images/model-tryon.png';

const TryOnScreen = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSection, setOpenSection] = useState('ALL');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // AI Try-On State
  const [selectedGarment, setSelectedGarment] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState(null);
  
  // User photo state
  const [userPhotoFile, setUserPhotoFile] = useState(null);       // File object for API
  const [userPhotoPreview, setUserPhotoPreview] = useState(null);  // base64 for preview
  
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
    setOpenSection(openSection === section ? null : section);
  };

  const getCategoryName = (product) => {
    return product.category?.name || 'OTHER';
  };

  // Handle user uploading their own photo
  const handleUserPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast("Image too large. Max 10MB.", "error");
      return;
    }

    // Store the actual File object for the API call
    setUserPhotoFile(file);
    setResultImage(null);

    // Create a preview
    const reader = new FileReader();
    reader.onload = () => setUserPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Main AI Try-On handler
  const handleTryOn = async (product) => {
    if (!userPhotoFile) {
      showToast("Please upload your photo first", "error");
      return;
    }

    const garmentUrl = product.image;
    if (!garmentUrl) {
      showToast("This product has no image", "error");
      return;
    }

    setSelectedGarment(product);
    setIsGenerating(true);
    setResultImage(null);

    try {
      // Send the garment URL + user photo File to the backend
      const response = await aiTryOnService.generateTryOn(garmentUrl, userPhotoFile);
      
      if (response.data?.result_image) {
        setResultImage(response.data.result_image);
        showToast("Try-on generated successfully!", "success");
      } else {
        showToast("No result was returned from AI", "error");
      }
    } catch (error) {
      console.error("Try-on error:", error);
      const msg = error.response?.data?.message || "Error generating try-on. Check your API token.";
      showToast(msg, "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setResultImage(null);
    setSelectedGarment(null);
  };

  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    const catName = getCategoryName(product);
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(product);
    return acc;
  }, {});

  const categories = Object.keys(groupedProducts).length > 0 
    ? Object.keys(groupedProducts) 
    : ['ALL'];

  // Determine which image to show in the left panel
  const displayImage = resultImage || userPhotoPreview || DEFAULT_MODEL_IMAGE;

  return (
    <div className="try-on-page-container">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      
      <main className="try-on-main">
        <div className="try-on-layout">
          
          {/* ─── LEFT: Model / Result Image ─── */}
          <div className="try-on-left-col">
            <div className="model-image-container">
              {isGenerating && (
                <div className="tryon-loading-overlay">
                  <Loader2 size={48} className="tryon-spinner" />
                  <p className="tryon-loading-text">GENERATING AI FIT...</p>
                  <p className="tryon-loading-sub">Powered by Replicate IDM-VTON</p>
                  <p className="tryon-loading-hint">This may take 20-60 seconds</p>
                </div>
              )}
              
              <img 
                src={displayImage} 
                alt="Try-On Preview" 
                className="model-image"
                style={{ opacity: isGenerating ? 0.2 : 1 }}
                onError={(e) => { e.target.src = '/images/product-1.png'; }}
              />

              {resultImage && !isGenerating && (
                <div className="tryon-result-badge">AI GENERATED</div>
              )}
            </div>

            {/* Action buttons below the image */}
            <div className="tryon-image-actions">
              <label className="tryon-upload-btn">
                <Upload size={16} />
                <span>{userPhotoFile ? 'Change Photo' : 'Upload Your Photo'}</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleUserPhotoUpload} 
                  hidden 
                />
              </label>
              {resultImage && (
                <button className="tryon-reset-btn" onClick={handleReset}>
                  <RotateCcw size={16} />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Currently selected garment info */}
            {selectedGarment && !isGenerating && (
              <div className="tryon-selected-info">
                <img 
                  src={selectedGarment.image} 
                  alt={selectedGarment.product_name} 
                  className="tryon-selected-thumb"
                />
                <div>
                  <span className="tryon-selected-label">SELECTED GARMENT</span>
                  <span className="tryon-selected-name">{selectedGarment.product_name}</span>
                </div>
              </div>
            )}
          </div>
          
          {/* ─── RIGHT: Controls & Product Picker ─── */}
          <div className="try-on-right-col">
            <h1 className="tryon-title">VIRTUAL TRY-ON</h1>
            <p className="tryon-subtitle">
              Upload your photo and select a piece from our collection. Our AI will generate 
              a realistic try-on image showing how the garment looks on you.
            </p>

            {!userPhotoFile && (
              <div className="tryon-upload-prompt">
                <Upload size={32} />
                <p>Upload your photo to get started</p>
                <label className="tryon-upload-btn-large">
                  <span>SELECT PHOTO</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleUserPhotoUpload} 
                    hidden 
                  />
                </label>
              </div>
            )}

            {userPhotoFile && (
              <>
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
                          <span>{cat.toUpperCase()}</span>
                          {openSection === cat ? <Minus size={16} /> : <Plus size={16} />}
                        </button>
                        {openSection === cat && (
                          <div className="accordion-content">
                            <div className="try-on-items-grid">
                              {(groupedProducts[cat] || products).map(prod => (
                                <div 
                                  key={prod._id} 
                                  className={`try-on-item-box ${selectedGarment?._id === prod._id ? 'selected' : ''}`}
                                  onClick={() => handleTryOn(prod)}
                                >
                                  <img src={prod.image || '/images/product-1.png'} alt={prod.product_name} />
                                  <div className="try-on-item-label">
                                    {isGenerating && selectedGarment?._id === prod._id ? 'GENERATING...' : 'TRY ON'}
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
              </>
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
