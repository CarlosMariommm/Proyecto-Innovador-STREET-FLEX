import React from 'react';
import ProductCard from '../../components/web/ProductCard';
import './SavedItems.css';

const SAVED_COATS = [
  {
    id: 1,
    image: '/images/coat-1.jpg',
    description: 'A placeholder text is a block of nonsensical or meaningless text that...',
    title: 'PIECE TITLE',
    price: '875'
  },
  {
    id: 2,
    image: '/images/coat-2.jpg',
    description: 'A placeholder text is a block of nonsensical or meaningless text that...',
    title: 'PIECE TITLE',
    price: '875'
  }
];

const SAVED_BAGS = [
  {
    id: 3,
    image: '/images/bag-1.jpg',
    description: 'A placeholder text is a block of nonsensical or meaningless text that...',
    title: 'PIECE TITLE',
    price: '875'
  },
  {
    id: 4,
    image: '/images/bag-2.jpg',
    description: 'A placeholder text is a block of nonsensical or meaningless text that...',
    title: 'PIECE TITLE',
    price: '875'
  }
];

const SavedItems = () => {
  return (
    <div className="saved-items-container">
      <section className="saved-category">
        <h2 className="section-title">SAVED COATS</h2>
        <div className="saved-grid">
          {SAVED_COATS.map(item => (
            <ProductCard key={item.id} {...item} />
          ))}
        </div>
      </section>

      <section className="saved-category">
        <h2 className="section-title">SAVED BAGS</h2>
        <div className="saved-grid">
          {SAVED_BAGS.map(item => (
            <ProductCard key={item.id} {...item} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default SavedItems;
