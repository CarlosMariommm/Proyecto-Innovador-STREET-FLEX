import React from 'react';
import ProductCard from '../components/ProductCard';
import './SavedItems.css';

const SAVED_COATS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800&auto=format&fit=crop',
    description: 'A placeholder text is a block of nonsensical or meaningless text that...',
    title: 'PIECE TITLE',
    price: '875'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop',
    description: 'A placeholder text is a block of nonsensical or meaningless text that...',
    title: 'PIECE TITLE',
    price: '875'
  }
];

const SAVED_BAGS = [
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800&auto=format&fit=crop',
    description: 'A placeholder text is a block of nonsensical or meaningless text that...',
    title: 'PIECE TITLE',
    price: '875'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=800&auto=format&fit=crop',
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
