import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, User, Shirt, ShoppingCart } from 'lucide-react';
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
          <Link to="/account" aria-label="User account" className="icon-link">
            <User size={24} />
          </Link>
          <Link to="/try-on" aria-label="Try on" className="icon-link">
            {/* Usamos el icono de una camiseta para simular el Try On/Gancho */}
            <Shirt size={24} />
          </Link>
          <Link to="/cart" aria-label="Shopping cart" className="icon-link">
            <ShoppingCart size={24} />
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
