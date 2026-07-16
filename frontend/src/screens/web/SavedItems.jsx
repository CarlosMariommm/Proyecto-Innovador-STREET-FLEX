import React, { useEffect, useState } from 'react';
import ProductCard from '../../components/web/ProductCard';
import { clientService } from '../../api/clientService';
import { useAuth } from '../../hooks/useAuth';
import './SavedItems.css';

const SavedItems = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        if (user && user.role === 'client') {
          const data = await clientService.getFavorites();
          setFavorites(data || []);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [user, user?.favorites]); // refetch if user.favorites changes locally

  if (loading) {
    return <div className="saved-items-container" style={{ padding: '2rem', textAlign: 'center' }}>Loading saved items...</div>;
  }

  if (favorites.length === 0) {
    return <div className="saved-items-container" style={{ padding: '2rem', textAlign: 'center' }}>You have no saved items.</div>;
  }

  // Group by category
  const grouped = favorites.reduce((acc, product) => {
    const catName = product.category?.name || 'OTHER';
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(product);
    return acc;
  }, {});

  return (
    <div className="saved-items-container">
      {Object.entries(grouped).map(([categoryName, products]) => (
        <section className="saved-category" key={categoryName}>
          <h2 className="section-title">SAVED {categoryName.toUpperCase()}</h2>
          <div className="saved-grid">
            {products.map(product => (
              <ProductCard
                key={product._id}
                id={product._id}
                image={product.image || '/placeholder.jpg'}
                title={product.product_name}
                price={product.price}
                category={product.category?.name}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default SavedItems;
