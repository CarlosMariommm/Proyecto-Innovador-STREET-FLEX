import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { productService } from '../../api/productService';
import './ProductGrid.css';

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getProducts();
        // Asumiendo que data es { message, data: [...] }
        setProducts(data.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div style={{ color: 'white', padding: '2rem' }}>Loading products...</div>;

  return (
    <section className="product-grid-section container">
      <div className="product-grid">
        {products.map(product => (
          <ProductCard
            key={product._id}
            id={product._id}
            image={product.image || '/images/product-1.png'}
            description={product.description || 'No description available'}
            title={product.name}
            price={product.price}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
