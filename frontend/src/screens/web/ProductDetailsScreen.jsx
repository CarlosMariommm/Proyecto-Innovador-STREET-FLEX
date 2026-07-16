import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/web/Header';
import Sidebar from '../../components/web/Sidebar';
import ProductGrid from '../../components/web/ProductGrid';
import { Plus, Minus, Star } from 'lucide-react';
import { productService } from '../../api/productService';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import './ProductDetailsScreen.css';

const ProductDetailsScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, toggleFavorite } = useAuth();
  const { showToast } = useToast();

  const isFavorite = user?.role === 'client' && user.favorites?.includes(id);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSizingOpen, setIsSizingOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [isMaterialsOpen, setIsMaterialsOpen] = useState(false);
  const [isCareOpen, setIsCareOpen] = useState(false);
  const [isShippingOpen, setIsShippingOpen] = useState(false);
  
  const [selectedSize, setSelectedSize] = useState(null);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewMsg, setReviewMsg] = useState('');

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productService.getProductById(id);
        setProduct(res.data || res);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      showToast("Please select a size first.", "error");
      return;
    }
    const cartProduct = {
      ...product,
      selectedSize,
      selectedColor: product.color || ''
    };
    addToCart(cartProduct, 1);
    showToast('Added to bag!', 'success');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return showToast("Debes iniciar sesión para valorar.", "error");
    try {
      const res = await productService.addReview(id, { id_client: user._id, rating, comment });
      setReviewMsg(res.message);
      // Reload product to get new reviews
      const prodRes = await productService.getProductById(id);
      setProduct(prodRes.data || prodRes);
      setComment('');
    } catch (err) {
      setReviewMsg(err.response?.data?.message || "Error al enviar la valoración");
    }
  };

  if (loading) return <div style={{ color: 'var(--primary-color)', padding: '2rem' }}>Loading product...</div>;
  if (!product) return <div style={{ color: 'var(--primary-color)', padding: '2rem' }}>Product not found.</div>;

  return (
    <div className="product-details-container">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      
      <main className="product-details-main">
        <div className="product-details-layout">
          <div className="product-left-col">
            <div className="product-gallery">
              <button className="try-on-btn" onClick={() => navigate('/try-on')}>Try on</button>
              
              <div className="main-image-container">
                <img 
                  src={product.image || "/images/product-1.png"} 
                  alt={product.name} 
                  className="main-image"
                />
              </div>
            </div>
            
            <div className="product-description-block">
              <p>{product.description}</p>
            </div>
          </div>
          
          <div className="product-right-col">
            <div className="product-header-info">
              <h1 className="product-title-large">{product.name}</h1>
              <span className="product-price-large">${product.price?.toFixed(2)}</span>
            </div>
            
            <div className="accordions-container">
              <div className="accordion-section">
                <button 
                  className="accordion-header" 
                  onClick={() => setIsSizingOpen(!isSizingOpen)}
                >
                  <span>SIZING {selectedSize ? `- ${selectedSize}` : ''}</span>
                  {isSizingOpen ? <Minus size={16} /> : <Plus size={16} />}
                </button>
                {isSizingOpen && (
                  <div className="accordion-content">
                    <div className="size-options">
                      {sizes.map(size => (
                        <button 
                          key={size}
                          className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              


              {/* MATERIALS */}
              <div className="accordion-section">
                <button 
                  className="accordion-header" 
                  onClick={() => setIsMaterialsOpen(!isMaterialsOpen)}
                >
                  <span>MATERIALS</span>
                  {isMaterialsOpen ? <Minus size={16} /> : <Plus size={16} />}
                </button>
                {isMaterialsOpen && (
                  <div className="accordion-content">
                    <p style={{ fontWeight: 300, fontSize: '14px', lineHeight: '1.6' }}>
                      {product.material || "100% premium materials. Check label for specific blend."}
                    </p>
                  </div>
                )}
              </div>

              {/* CARE INSTRUCTIONS */}
              <div className="accordion-section">
                <button 
                  className="accordion-header" 
                  onClick={() => setIsCareOpen(!isCareOpen)}
                >
                  <span>CARE INSTRUCTIONS</span>
                  {isCareOpen ? <Minus size={16} /> : <Plus size={16} />}
                </button>
                {isCareOpen && (
                  <div className="accordion-content">
                    <p style={{ fontWeight: 300, fontSize: '14px', lineHeight: '1.6' }}>
                      {product.care_instructions || "Machine wash cold with like colors. Do not bleach. Tumble dry low."}
                    </p>
                  </div>
                )}
              </div>

              {/* SHIPPING & RETURNS */}
              <div className="accordion-section">
                <button 
                  className="accordion-header" 
                  onClick={() => setIsShippingOpen(!isShippingOpen)}
                >
                  <span>SHIPPING & RETURNS</span>
                  {isShippingOpen ? <Minus size={16} /> : <Plus size={16} />}
                </button>
                {isShippingOpen && (
                  <div className="accordion-content">
                    <p style={{ fontWeight: 300, fontSize: '14px', lineHeight: '1.6' }}>
                      {product.shipping_returns || "Free shipping on orders over $150. Returns accepted within 14 days of delivery. Items must be unworn with original tags attached."}
                    </p>
                  </div>
                )}
              </div>

              {/* Seccion de Reseñas */}
              <div className="accordion-section">
                <button 
                  className="accordion-header" 
                  onClick={() => setIsReviewsOpen(!isReviewsOpen)}
                >
                  <span>REVIEWS ({product.reviews?.length || 0}) {product.average_rating ? `⭐ ${product.average_rating.toFixed(1)}` : ''}</span>
                  {isReviewsOpen ? <Minus size={16} /> : <Plus size={16} />}
                </button>
                {isReviewsOpen && (
                  <div className="accordion-content" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '1rem' }}>
                    {product.reviews?.length > 0 ? (
                      product.reviews.map((r, i) => (
                        <div key={i} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                            <strong>{r.id_client?.full_name || 'Usuario'}</strong>
                            <span>{'⭐'.repeat(r.rating)}</span>
                          </div>
                          <p style={{ fontWeight: 300, fontSize: '14px', margin: 0 }}>{r.comment}</p>
                          <small style={{ color: 'var(--accent-color)', fontSize: '12px' }}>{new Date(r.date).toLocaleDateString()}</small>
                        </div>
                      ))
                    ) : (
                      <p style={{ fontWeight: 300, fontSize: '14px' }}>No hay reseñas aún.</p>
                    )}

                    {user && user.role === 'client' && (
                      <form onSubmit={submitReview} style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <h4 style={{ fontWeight: 400 }}>Deja tu valoración</h4>
                        {reviewMsg && <div style={{ fontSize: '13px', color: reviewMsg.includes('éxito') ? '#22c55e' : '#ff4444' }}>{reviewMsg}</div>}
                        <select 
                          value={rating} 
                          onChange={(e) => setRating(e.target.value)}
                          style={{ padding: '0.5rem', background: 'transparent', color: 'var(--primary-color)', border: '1px solid var(--border-color)' }}
                        >
                          <option value="5">5 - Excelente</option>
                          <option value="4">4 - Muy bueno</option>
                          <option value="3">3 - Bueno</option>
                          <option value="2">2 - Regular</option>
                          <option value="1">1 - Malo</option>
                        </select>
                        <textarea 
                          placeholder="Cuéntanos qué te pareció..." 
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          style={{ padding: '0.5rem', background: 'transparent', color: 'var(--primary-color)', border: '1px solid var(--border-color)', minHeight: '60px' }}
                          required
                        />
                        <button type="submit" style={{ padding: '0.5rem', background: 'var(--primary-color)', color: 'var(--bg-color)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                          Enviar
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="product-actions">
              <button className="add-bag-btn" onClick={handleAddToCart}>ADD TO BAG</button>
              <button 
                className={`add-favorites-btn ${isFavorite ? 'active' : ''}`}
                onClick={async () => {
                  if (!user || user.role !== 'client') {
                    showToast('Por favor inicia sesión para guardar favoritos', 'error');
                    navigate('/login');
                    return;
                  }
                  const ok = await toggleFavorite(id);
                  if (ok) {
                    if (isFavorite) showToast('Eliminado de favoritos', 'success');
                    else showToast('¡Guardado en favoritos!', 'success');
                  }
                }}
              >
                {isFavorite ? '♥ SAVED' : 'ADD TO FAVORITES'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="more-collection-section">
          <h2 className="section-title">MORE OF THE NEW COLLECTION</h2>
          <ProductGrid />
        </div>
      </main>
    </div>
  );
};

export default ProductDetailsScreen;
