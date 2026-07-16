import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import './ProductCard.css';

const ProductCard = ({ image, title, price, id, category }) => {
  const { user, toggleFavorite } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const isFavorite = user?.role === 'client' && user.favorites?.includes(id);

  const formatPrice = (val) => {
    const num = Number(val);
    if (isNaN(num)) return '$0.00 MXN';
    return `$${num.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`;
  };

  const handleFavoriteClick = async (e) => {
    e.preventDefault(); // prevent Link navigation
    e.stopPropagation();
    
    if (!user || user.role !== 'client') {
      showToast('Por favor inicia sesión para guardar favoritos', 'error');
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    
    const success = await toggleFavorite(id);
    if (success) {
      if (isFavorite) showToast('Eliminado de favoritos', 'success');
      else showToast('Guardado en favoritos', 'success');
    }
  };

  return (
    <Link to={`/product/${id || 1}`} className="product-card-link">
      <article className="product-card">
        <div className="product-image-wrapper">
          <img src={image} alt={title} className="product-image" />
          <button 
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={handleFavoriteClick}
          >
            <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
        <div className="product-info">
          <h3 className="product-title">{title}</h3>
          {category && <span className="product-category">{category}</span>}
          <span className="product-price">{formatPrice(price)}</span>
        </div>
      </article>
    </Link>
  );
};

export default ProductCard;
