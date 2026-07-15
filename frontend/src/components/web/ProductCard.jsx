import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ image, title, price, id, category }) => {
  const formatPrice = (val) => {
    const num = Number(val);
    if (isNaN(num)) return '$0.00 MXN';
    return `$${num.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`;
  };

  return (
    <Link to={`/product/${id || 1}`} className="product-card-link">
      <article className="product-card">
        <div className="product-image-wrapper">
          <img src={image} alt={title} className="product-image" />
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
