import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Empleados se guardarán de forma independiente
    const saved = localStorage.getItem('employees');
    if (saved) {
      setEmployees(JSON.parse(saved));
    } else {
      const initial = [
        { id: 1, name: 'Carlos Mario', role: 'Vendedor', active: true },
        { id: 2, name: 'Ana Torres', role: 'Gerente', active: true }
      ];
      setEmployees(initial);
      localStorage.setItem('employees', JSON.stringify(initial));
    }
    setLoading(false);
  }, []);

  const saveToStorage = (data) => {
    localStorage.setItem('employees', JSON.stringify(data));
    setEmployees(data);
  };

  const addEmployee = (employee) => {
    const newEmployee = { ...employee, id: Date.now() };
    const newData = [...employees, newEmployee];
    saveToStorage(newData);
    toast.success('Empleado agregado exitosamente');
  };

  const updateEmployee = (id, updatedData) => {
    const newData = employees.map(emp => (emp.id === id ? { ...emp, ...updatedData } : emp));
    saveToStorage(newData);
    toast.success('Empleado actualizado exitosamente');
  };

  const deleteEmployee = (id) => {
    const newData = employees.filter(emp => emp.id !== id);
    saveToStorage(newData);
    toast.success('Empleado eliminado exitosamente');
  };

  return {
    employees,
    loading,
    addEmployee,
    updateEmployee,
    deleteEmployee
  };
};

export default useEmployees;
