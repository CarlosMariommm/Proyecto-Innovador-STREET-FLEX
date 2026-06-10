import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

// Custom Hook para gestionar Empleados conectado al backend real
const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función auxiliar para peticiones autenticadas con JSON
  const apiFetch = async (url, options = {}) => {
    const res = await fetch(url, { credentials: 'include', ...options });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error en la petición');
    return data;
  };

  // Carga inicial: trae todos los empleados del backend
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/api/employees');
      setEmployees(data);
    } catch (error) {
      toast.error(error.message || 'No se pudieron cargar los empleados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Crear empleado
  const addEmployee = async (employee) => {
    try {
      await apiFetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee)
      });
      toast.success('Empleado agregado exitosamente');
      await fetchEmployees();
    } catch (error) {
      toast.error(error.message || 'Error al agregar empleado');
    }
  };

  // Actualizar empleado
  const updateEmployee = async (id, updatedData) => {
    try {
      await apiFetch(`/api/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      toast.success('Empleado actualizado exitosamente');
      await fetchEmployees();
    } catch (error) {
      toast.error(error.message || 'Error al actualizar empleado');
    }
  };

  // Eliminar empleado
  const deleteEmployee = async (id) => {
    try {
      await apiFetch(`/api/employees/${id}`, { method: 'DELETE' });
      toast.success('Empleado eliminado exitosamente');
      await fetchEmployees();
    } catch (error) {
      toast.error(error.message || 'Error al eliminar empleado');
    }
  };

  return {
    employees,
    loading,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    refetch: fetchEmployees
  };
};

export default useEmployees;
