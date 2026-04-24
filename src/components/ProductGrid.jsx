import React from 'react';
import ProductCard from './ProductCard';
import './ProductGrid.css';

const MOCK_PRODUCTS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop',
    description: 'A placeholder text is a block of nonsensical or meaningless text that...',
    title: 'Piece Title',
    price: '875'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop',
    description: 'A placeholder text is a block of nonsensical or meaningless text that...',
    title: 'Piece Title',
    price: '875'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=800&auto=format&fit=crop',
    description: 'A placeholder text is a block of nonsensical or meaningless text that...',
    title: 'Piece Title',
    price: '875'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop',
    description: 'A placeholder text is a block of nonsensical or meaningless text that...',
    title: 'Piece Title',
    price: '875'
  }
];

const ProductGrid = () => {
  return (
    <section className="product-grid-section container">
      <div className="product-grid">
        {MOCK_PRODUCTS.map(product => (
          <ProductCard
            key={product.id}
            image={product.image}
            description={product.description}
            title={product.title}
            price={product.price}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
