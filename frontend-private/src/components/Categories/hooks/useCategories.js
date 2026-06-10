import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

// Custom Hook para gestionar Categorías conectado al backend real
const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función auxiliar para hacer peticiones autenticadas (las cookies se envían automáticamente)
  const apiFetch = async (url, options = {}) => {
    const res = await fetch(url, { credentials: 'include', ...options });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error en la petición');
    return data;
  };

  // Carga inicial: trae todas las categorías del backend
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/api/categories');
      setCategories(data);
    } catch (error) {
      toast.error(error.message || 'No se pudieron cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Crear categoría: envía los datos al backend y recarga la lista
  const addCategory = async (category) => {
    try {
      await apiFetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category)
      });
      toast.success('Categoría agregada exitosamente');
      await fetchCategories();
    } catch (error) {
      toast.error(error.message || 'Error al agregar categoría');
    }
  };

  // Actualizar categoría: envía los cambios y recarga
  const updateCategory = async (id, updatedData) => {
    try {
      await apiFetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      toast.success('Categoría actualizada exitosamente');
      await fetchCategories();
    } catch (error) {
      toast.error(error.message || 'Error al actualizar categoría');
    }
  };

  // Eliminar categoría: manda DELETE y recarga
  const deleteCategory = async (id) => {
    try {
      await apiFetch(`/api/categories/${id}`, { method: 'DELETE' });
      toast.success('Categoría eliminada exitosamente');
      await fetchCategories();
    } catch (error) {
      toast.error(error.message || 'Error al eliminar categoría');
    }
  };

  return {
    categories,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories
  };
};

export default useCategories;
