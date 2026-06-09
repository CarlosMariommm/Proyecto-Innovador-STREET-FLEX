import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCustomers = () => {
      const allUsers = JSON.parse(localStorage.getItem('users')) || [];
      const onlyCustomers = allUsers.filter(u => u.role === 'user');
      setCustomers(onlyCustomers);
      setLoading(false);
    };

    loadCustomers();
    window.addEventListener('storage', loadCustomers);
    return () => window.removeEventListener('storage', loadCustomers);
  }, []);

  const saveToStorage = (updatedCustomers) => {
    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    const nonCustomers = allUsers.filter(u => u.role !== 'user');
    const newAllUsers = [...nonCustomers, ...updatedCustomers];
    
    localStorage.setItem('users', JSON.stringify(newAllUsers));
    setCustomers(updatedCustomers);
  };

  const addCustomer = (customer) => {
    const newCustomer = { ...customer, id: Date.now(), role: 'user' };
    const newData = [...customers, newCustomer];
    saveToStorage(newData);
    toast.success('Cliente agregado exitosamente');
  };

  const updateCustomer = (id, updatedData) => {
    const newData = customers.map(cust => (cust.id === id ? { ...cust, ...updatedData } : cust));
    saveToStorage(newData);
    toast.success('Cliente actualizado exitosamente');
  };

  const deleteCustomer = (id) => {
    const newData = customers.filter(cust => cust.id !== id);
    saveToStorage(newData);
    toast.success('Cliente eliminado exitosamente');
  };

  return {
    customers,
    loading,
    addCustomer,
    updateCustomer,
    deleteCustomer
  };
};

export default useCustomers;
