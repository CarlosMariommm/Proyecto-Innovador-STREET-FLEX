import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('categories');
    if (saved) {
      setCategories(JSON.parse(saved));
    } else {
      const initial = [
        { id: 1, name: 'Sneakers', description: 'Calzado deportivo urbano', active: true },
        { id: 2, name: 'T-Shirts', description: 'Camisetas de algodón', active: true }
      ];
      setCategories(initial);
      localStorage.setItem('categories', JSON.stringify(initial));
    }
    setLoading(false);
  }, []);

  const saveToStorage = (data) => {
    localStorage.setItem('categories', JSON.stringify(data));
    setCategories(data);
  };

  const addCategory = (category) => {
    const newCategory = { ...category, id: Date.now() };
    const newData = [...categories, newCategory];
    saveToStorage(newData);
    toast.success('Categoría agregada exitosamente');
  };

  const updateCategory = (id, updatedData) => {
    const newData = categories.map(cat => (cat.id === id ? { ...cat, ...updatedData } : cat));
    saveToStorage(newData);
    toast.success('Categoría actualizada exitosamente');
  };

  const deleteCategory = (id) => {
    const newData = categories.filter(cat => cat.id !== id);
    saveToStorage(newData);
    toast.success('Categoría eliminada exitosamente');
  };

  return {
    categories,
    loading,
    addCategory,
    updateCategory,
    deleteCategory
  };
};

export default useCategories;
