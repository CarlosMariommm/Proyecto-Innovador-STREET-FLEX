import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

// Custom Hook para gestionar Pedidos conectado al backend real
const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función auxiliar para peticiones autenticadas con JSON
  const apiFetch = async (url, options = {}) => {
    const res = await fetch(url, { credentials: 'include', ...options });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error en la petición');
    return data;
  };

  // Carga inicial: trae todos los pedidos del backend
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/api/orders');
      setOrders(data);
    } catch (error) {
      toast.error(error.message || 'No se pudieron cargar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Crear pedido
  const addOrder = async (order) => {
    try {
      await apiFetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      toast.success('Pedido creado exitosamente');
      await fetchOrders();
    } catch (error) {
      toast.error(error.message || 'Error al crear pedido');
    }
  };

  // Actualizar estado del pedido (Pendiente, Procesando, Enviado, Entregado, Cancelado)
  const updateOrder = async (id, updatedData) => {
    try {
      await apiFetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      toast.success('Pedido actualizado exitosamente');
      await fetchOrders();
    } catch (error) {
      toast.error(error.message || 'Error al actualizar pedido');
    }
  };

  // Eliminar pedido
  const deleteOrder = async (id) => {
    try {
      await apiFetch(`/api/orders/${id}`, { method: 'DELETE' });
      toast.success('Pedido eliminado exitosamente');
      await fetchOrders();
    } catch (error) {
      toast.error(error.message || 'Error al eliminar pedido');
    }
  };

  return {
    orders,
    loading,
    addOrder,
    updateOrder,
    deleteOrder,
    refetch: fetchOrders
  };
};

export default useOrders;
