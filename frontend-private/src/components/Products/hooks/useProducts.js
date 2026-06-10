import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

// Custom Hook para gestionar Productos conectado al backend real
const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función auxiliar para peticiones simples con JSON
  const apiFetch = async (url, options = {}) => {
    const res = await fetch(url, { credentials: 'include', ...options });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error en la petición');
    return data;
  };

  // Carga inicial: trae todos los productos del backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/api/products');
      setProducts(data);
    } catch (error) {
      toast.error(error.message || 'No se pudieron cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Crear producto: usa FormData para enviar la imagen a Cloudinary a través del backend
  const addProduct = async (productData) => {
    try {
      // Se construye un FormData porque la imagen es un archivo binario (multipart/form-data)
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', productData.price);
      formData.append('category', productData.category);
      formData.append('countInStock', productData.countInStock);
      // El campo 'image' debe coincidir con upload.single('image') en el backend
      if (productData.image) {
        formData.append('image', productData.image);
      }

      const res = await fetch('/api/products', {
        method: 'POST',
        credentials: 'include',
        body: formData // No se establece Content-Type; el navegador lo configura automáticamente con boundary
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al crear producto');

      toast.success('Producto agregado exitosamente');
      await fetchProducts();
    } catch (error) {
      toast.error(error.message || 'Error al agregar producto');
    }
  };

  // Actualizar producto: también soporta subida de nueva imagen
  const updateProduct = async (id, productData) => {
    try {
      const formData = new FormData();
      if (productData.name) formData.append('name', productData.name);
      if (productData.description) formData.append('description', productData.description);
      if (productData.price) formData.append('price', productData.price);
      if (productData.category) formData.append('category', productData.category);
      if (productData.countInStock !== undefined) formData.append('countInStock', productData.countInStock);
      if (productData.image) formData.append('image', productData.image);

      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al actualizar producto');

      toast.success('Producto actualizado exitosamente');
      await fetchProducts();
    } catch (error) {
      toast.error(error.message || 'Error al actualizar producto');
    }
  };

  // Eliminar producto
  const deleteProduct = async (id) => {
    try {
      await apiFetch(`/api/products/${id}`, { method: 'DELETE' });
      toast.success('Producto eliminado exitosamente');
      await fetchProducts();
    } catch (error) {
      toast.error(error.message || 'Error al eliminar producto');
    }
  };

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts
  };
};

export default useProducts;
