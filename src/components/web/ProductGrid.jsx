import React from 'react';
import ProductCard from './ProductCard';
import './ProductGrid.css';

const MOCK_PRODUCTS = [
  {
    id: 1,
    image: '/images/product-1.jpg',
    description: 'Regular fit jersey polo shirt with rib collar and print.',
    title: 'REFEREE POLO GREY',
    price: '80.00'
  },
  {
    id: 2,
    image: '/images/product-2.jpg',
    description: 'Boxy fit heavy weight cotton tee with crackle print.',
    title: 'HOCKEY JERSEY',
    price: '120.00'
  },
  {
    id: 3,
    image: '/images/product-3.jpg',
    description: 'Oversized knitted sweater in soft cotton blend.',
    title: 'KNITTED VEST',
    price: '95.00'
  },
  {
    id: 4,
    image: '/images/product-4.jpg',
    description: 'Wide leg technical trousers with multiple pockets.',
    title: 'TECH PANTS',
    price: '110.00'
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
