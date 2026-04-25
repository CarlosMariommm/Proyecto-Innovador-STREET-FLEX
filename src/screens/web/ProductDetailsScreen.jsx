import React, { useState } from 'react';
import Header from '../../components/web/Header';
import Sidebar from '../../components/web/Sidebar';
import ProductGrid from '../../components/web/ProductGrid';
import { Plus, Minus } from 'lucide-react';
import './ProductDetailsScreen.css';

const ProductDetailsScreen = () => {
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

  return (
    <div className="product-details-container">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      
      <main className="product-details-main">
        <div className="product-details-layout">
          <div className="product-left-col">
            <div className="product-gallery">
              <button className="try-on-btn">Try on</button>
              
              <div className="main-image-container">
                <img 
                  src="/images/product-1.jpg" 
                  alt="Referee Polo Grey" 
                  className="main-image"
                />
              </div>
              
              <div className="thumbnail-gallery">
                <img src="/images/thumb-1.jpg" alt="Thumb 1" className="thumbnail" />
                <img src="/images/thumb-2.jpg" alt="Thumb 2" className="thumbnail" />
                <img src="/images/thumb-3.jpg" alt="Thumb 3" className="thumbnail" />
              </div>
            </div>
            
            <div className="product-description-block">
              <p>Regular fit jersey polo shirt with<br/>rib collar and print</p>
              <p>This item is made from limited<br/>deadstock cotton jersey</p>
              <p>Model is 183cm tall, chest<br/>circumference 79cm and wears an S/M</p>
              <p>Cotton. Wash at 30°</p>
              <p>Made in Turkey</p>
              <p>Shipped from Germany</p>
            </div>
          </div>
          
          <div className="product-right-col">
            <div className="product-header-info">
              <h1 className="product-title-large">REFEREE POLO GREY</h1>
              <span className="product-price-large">$80.00</span>
            </div>
            
            <div className="accordions-container">
              <div className="accordion-section">
                <button 
                  className="accordion-header" 
                  onClick={() => setIsSizingOpen(!isSizingOpen)}
                >
                  <span>SIZING</span>
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
                  <span>COLOR</span>
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
              <button className="add-bag-btn">ADD TO BAG</button>
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
