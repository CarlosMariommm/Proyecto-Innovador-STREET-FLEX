import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

// Custom Hook para gestionar Clientes conectado al backend real
const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función auxiliar para peticiones autenticadas con JSON
  const apiFetch = async (url, options = {}) => {
    const res = await fetch(url, { credentials: 'include', ...options });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error en la petición');
    return data;
  };

  // Carga inicial: trae todos los clientes del backend
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/api/customers');
      setCustomers(data);
    } catch (error) {
      toast.error(error.message || 'No se pudieron cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Crear cliente
  const addCustomer = async (customer) => {
    try {
      await apiFetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer)
      });
      toast.success('Cliente agregado exitosamente');
      await fetchCustomers();
    } catch (error) {
      toast.error(error.message || 'Error al agregar cliente');
    }
  };

  // Actualizar cliente
  const updateCustomer = async (id, updatedData) => {
    try {
      await apiFetch(`/api/customers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      toast.success('Cliente actualizado exitosamente');
      await fetchCustomers();
    } catch (error) {
      toast.error(error.message || 'Error al actualizar cliente');
    }
  };

  // Eliminar cliente
  const deleteCustomer = async (id) => {
    try {
      await apiFetch(`/api/customers/${id}`, { method: 'DELETE' });
      toast.success('Cliente eliminado exitosamente');
      await fetchCustomers();
    } catch (error) {
      toast.error(error.message || 'Error al eliminar cliente');
    }
  };

  return {
    customers,
    loading,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    refetch: fetchCustomers
  };
};

export default useCustomers;
