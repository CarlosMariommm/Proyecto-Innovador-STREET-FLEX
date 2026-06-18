import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/web/Header';
import Sidebar from '../../components/web/Sidebar';
import ProductGrid from '../../components/web/ProductGrid';
import { Plus, Minus } from 'lucide-react';
import { productService } from '../../api/productService';
import { useCart } from '../../context/CartContext';
import './ProductDetailsScreen.css';

const ProductDetailsScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSizingOpen, setIsSizingOpen] = useState(false);
  const [isColorOpen, setIsColorOpen] = useState(false);
  
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const colors = [
    { id: 'light-grey', hex: '#d9d9d9' },
    { id: 'dark-brown', hex: '#594444' },
    { id: 'dark-grey', hex: '#404040' }
  ];

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
    if (!selectedSize || !selectedColor) {
      alert("Please select a size and color first.");
      return;
    }
    // Añadimos el producto y las opciones al carrito. 
    // Clonamos el producto para incluir la selección
    const cartProduct = {
      ...product,
      selectedSize,
      selectedColor
    };
    addToCart(cartProduct, 1);
    alert('Added to bag!');
  };

  if (loading) return <div style={{ color: 'white', padding: '2rem' }}>Loading product...</div>;
  if (!product) return <div style={{ color: 'white', padding: '2rem' }}>Product not found.</div>;

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
              
              <div className="accordion-section">
                <button 
                  className="accordion-header" 
                  onClick={() => setIsColorOpen(!isColorOpen)}
                >
                  <span>COLOR {selectedColor ? `- ${selectedColor}` : ''}</span>
                  {isColorOpen ? <Minus size={16} /> : <Plus size={16} />}
                </button>
                {isColorOpen && (
                  <div className="accordion-content">
                    <div className="color-options">
                      {colors.map(color => (
                        <button 
                          key={color.id}
                          className={`color-btn ${selectedColor === color.id ? 'selected' : ''}`}
                          style={{ backgroundColor: color.hex }}
                          onClick={() => setSelectedColor(color.id)}
                          aria-label={`Select ${color.id}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="product-actions">
              <button className="add-bag-btn" onClick={handleAddToCart}>ADD TO BAG</button>
              <button className="add-favorites-btn">ADD TO FAVORITES</button>
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
