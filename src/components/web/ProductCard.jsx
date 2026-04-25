import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import './ProductCard.css';

const ProductCard = ({ image, description, title, price, id }) => {
  return (
    <Link to={`/product/${id || 1}`} className="product-card-link">
      <article className="product-card">
        <div className="product-image-wrapper">
          <img src={image} alt={title} className="product-image" />
        </div>
        <div className="product-info">
          <p className="product-description">{description}</p>
          
          <div className="product-details-row">
            <div className="product-title-price">
              <h3 className="product-title">{title}</h3>
              <span className="product-price">${price}</span>
            </div>
            
            <button className="add-to-cart-btn" aria-label="Add to cart">
              <span>Add to cart</span>
              <Plus size={16} />
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ProductCard;
