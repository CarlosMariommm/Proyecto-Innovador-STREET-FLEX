import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import { productService } from '../../api/productService';
import { categoryService } from '../../api/categoryService';
import { moduleService } from '../../api/moduleService';
import './ProductGrid.css';

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [moduleData, setModuleData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const categoryFilter = searchParams.get('category');
  const moduleFilter = searchParams.get('module');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch products
        const prodData = await productService.getProducts();
        setProducts(prodData.data || []);

        // Fetch categories to build the top bar
        const catData = await categoryService.getCategories();
        const allCategories = catData.data || catData || [];
        setCategories(allCategories);

        // If a module is selected, fetch module info for the title
        if (moduleFilter) {
          const modData = await moduleService.getModules();
          const mods = Array.isArray(modData) ? modData : modData.data || [];
          const found = mods.find(m => m._id === moduleFilter);
          setModuleData(found);
        } else {
          setModuleData(null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [moduleFilter]);

  // Determine categories to show in the bar
  const moduleCategories = moduleFilter 
    ? categories.filter(c => c.id_module && (c.id_module._id === moduleFilter || c.id_module === moduleFilter))
    : [];

  // Filter products by module and category
  const filteredProducts = products.filter(p => {
    // Si hay un filtro de categoría específico, debe coincidir
    if (categoryFilter) {
      return p.category === categoryFilter || p.category?._id === categoryFilter;
    }
    
    // Si hay un módulo seleccionado, el producto debe pertenecer a una categoría de este módulo
    if (moduleFilter) {
      const productCatId = p.category?._id || p.category;
      return moduleCategories.some(mc => mc._id === productCatId);
    }

    return true; // Si no hay filtros, mostrar todos
  });

  if (loading) return <div style={{ color: 'var(--primary-color)', padding: '2rem' }}>Loading products...</div>;

  return (
    <section className="product-grid-section container">
      
      {moduleFilter && moduleData && (
        <div className="module-header-bar">
          <h2 className="module-main-title">{moduleData.name}</h2>
          <div className="module-categories-nav">
            <button 
              className={`cat-pill ${!categoryFilter ? 'active' : ''}`}
              onClick={() => navigate(`/?module=${moduleFilter}`)}
            >
              All {moduleData.name}
            </button>
            {moduleCategories.map(cat => (
              <button
                key={cat._id}
                className={`cat-pill ${categoryFilter === cat._id ? 'active' : ''}`}
                onClick={() => navigate(`/?module=${moduleFilter}&category=${cat._id}`)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {!moduleFilter && categoryFilter && (
        <div className="module-header-bar">
          <h2 className="module-main-title">
             {categories.find(c => c._id === categoryFilter)?.name || 'Filtered Products'}
          </h2>
        </div>
      )}

      <div className="product-grid">
        {filteredProducts.length === 0 ? (
          <div style={{ color: 'var(--primary-color)', padding: '2rem' }}>No products found.</div>
        ) : (
          filteredProducts.map(product => (
            <ProductCard
              key={product._id}
              id={product._id}
              image={product.image || '/images/product-1.png'}
              description={product.description || 'No description available'}
              title={product.name}
              price={product.price}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
