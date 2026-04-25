import React, { useState } from 'react';
import Header from '../../components/web/Header';
import Sidebar from '../../components/web/Sidebar';
import ProductGrid from '../../components/web/ProductGrid';
import { Plus, Minus } from 'lucide-react';
import './TryOnScreen.css';

const MOCK_BAGS = [
  { id: 1, image: '/images/product-1.png' },
  { id: 2, image: '/images/product-2.png' },
  { id: 3, image: '/images/product-3.png' }
];

const TryOnScreen = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSection, setOpenSection] = useState('BAGS');

  const toggleSection = (section) => {
    if (openSection === section) {
      setOpenSection(null);
    } else {
      setOpenSection(section);
    }
  };

  return (
    <div className="try-on-page-container">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      
      <main className="try-on-main">
        <div className="try-on-layout">
          
          <div className="try-on-left-col">
            <button className="add-fav-btn">ADD TO FAVORITES</button>
            <div className="model-image-container">
              <img 
                src="/images/model-tryon.png" 
                alt="Model" 
                className="model-image"
                onError={(e) => { e.target.src = '/images/product-1.png'; }}
              />
            </div>
          </div>
          
          <div className="try-on-right-col">
            <div className="try-on-accordions">
              
              <div className="accordion-item">
                <button 
                  className="accordion-header" 
                  onClick={() => toggleSection('T-SHIRT')}
                >
                  <span>T-SHIRT</span>
                  {openSection === 'T-SHIRT' ? <Minus size={16} /> : <Plus size={16} />}
                </button>
              </div>
              
              <div className="accordion-item">
                <button 
                  className="accordion-header" 
                  onClick={() => toggleSection('PANTS')}
                >
                  <span>PANTS</span>
                  {openSection === 'PANTS' ? <Minus size={16} /> : <Plus size={16} />}
                </button>
              </div>
              
              <div className="accordion-item">
                <button 
                  className="accordion-header" 
                  onClick={() => toggleSection('SHOES')}
                >
                  <span>SHOES</span>
                  {openSection === 'SHOES' ? <Minus size={16} /> : <Plus size={16} />}
                </button>
              </div>
              
              <div className="accordion-item">
                <button 
                  className="accordion-header" 
                  onClick={() => toggleSection('BAGS')}
                >
                  <span>BAGS</span>
                  {openSection === 'BAGS' ? <Minus size={16} /> : <Plus size={16} />}
                </button>
                {openSection === 'BAGS' && (
                  <div className="accordion-content">
                    <div className="try-on-items-grid">
                      {MOCK_BAGS.map(bag => (
                        <div key={bag.id} className="try-on-item-box">
                          <img src={bag.image} alt="Bag" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
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

export default TryOnScreen;
