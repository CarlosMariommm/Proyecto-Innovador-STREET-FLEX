import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import './Sidebar.css';

const CATEGORIES = [
  'NEW COLLECTION',
  'BEST SELLERS',
  'ESSENTIALS',
  'JEANS',
  'T-SHIRT',
  'TOPS & BODYSUITS',
  'SHIRT & BLOUSES',
  'HOODIES'
];

const Sidebar = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('WOMEN');

  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose} 
        aria-hidden={!isOpen}
      ></div>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <button className="close-btn" onClick={onClose} aria-label="Close menu">
            <X size={32} strokeWidth={1} />
          </button>
        </div>

        <div className="sidebar-tabs">
          <button 
            className={`tab-btn ${activeTab === 'WOMEN' ? 'active' : ''}`}
            onClick={() => setActiveTab('WOMEN')}
          >
            WOMEN
          </button>
          <button 
            className={`tab-btn ${activeTab === 'MEN' ? 'active' : ''}`}
            onClick={() => setActiveTab('MEN')}
          >
            MEN
          </button>
        </div>

        <div className="sidebar-search">
          <Search size={24} strokeWidth={1} />
          <input type="text" placeholder="" aria-label="Search items" />
        </div>

        <nav className="sidebar-nav">
          <ul>
            {CATEGORIES.map((category, index) => (
              <li key={index}>
                <a href={`#${category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}>
                  {category}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
