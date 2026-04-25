import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search, User, ShoppingBag } from 'lucide-react';
import './Header.css';

const Header = ({ onMenuClick }) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <button aria-label="Menu" onClick={onMenuClick}>
            <Menu size={24} />
          </button>
        </div>
        
        <div className="header-center">
          <Link to="/">
            <h1>STREET FLEX</h1>
          </Link>
        </div>

        <div className="header-right">
          <button aria-label="Search">
            <Search size={24} />
          </button>
          <Link to="/account" aria-label="User account" className="icon-link">
            <User size={24} />
          </Link>
          <Link to="/cart" aria-label="Shopping bag" className="icon-link">
            <ShoppingBag size={24} />
          </Link>
        </div>
      </div>
      <div className="header-divider">
        <div className="line"></div>
        <div className="line"></div>
      </div>
    </header>
  );
};

export default Header;
