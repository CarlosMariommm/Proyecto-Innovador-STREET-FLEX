import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('products');
    if (saved) {
      setProducts(JSON.parse(saved));
    } else {
      const initial = [
        { id: 1, name: 'Air Max 90', categoryId: 1, price: 120.50, stock: 15, active: true },
        { id: 2, name: 'Basic White Tee', categoryId: 2, price: 25.00, stock: 50, active: true }
      ];
      setProducts(initial);
      localStorage.setItem('products', JSON.stringify(initial));
    }
    setLoading(false);
  }, []);

  const saveToStorage = (data) => {
    localStorage.setItem('products', JSON.stringify(data));
    setProducts(data);
  };

  const addProduct = (product) => {
    const newProduct = { ...product, id: Date.now() };
    const newData = [...products, newProduct];
    saveToStorage(newData);
    toast.success('Producto agregado exitosamente');
  };

  const updateProduct = (id, updatedData) => {
    const newData = products.map(prod => (prod.id === id ? { ...prod, ...updatedData } : prod));
    saveToStorage(newData);
    toast.success('Producto actualizado exitosamente');
  };

  const deleteProduct = (id) => {
    const newData = products.filter(prod => prod.id !== id);
    saveToStorage(newData);
    toast.success('Producto eliminado exitosamente');
  };

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct
  };
};

export default useProducts;
