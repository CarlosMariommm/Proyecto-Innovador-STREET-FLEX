import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('orders');
    if (saved) {
      setOrders(JSON.parse(saved));
    } else {
      const initial = [
        { id: 1, customerName: 'Cliente Ejemplo', total: 145.50, status: 'Pendiente', date: new Date().toISOString() }
      ];
      setOrders(initial);
      localStorage.setItem('orders', JSON.stringify(initial));
    }
    setLoading(false);
  }, []);

  const saveToStorage = (data) => {
    localStorage.setItem('orders', JSON.stringify(data));
    setOrders(data);
  };

  const addOrder = (order) => {
    const newOrder = { ...order, id: Date.now(), date: new Date().toISOString() };
    const newData = [...orders, newOrder];
    saveToStorage(newData);
    toast.success('Pedido agregado exitosamente');
  };

  const updateOrder = (id, updatedData) => {
    const newData = orders.map(ord => (ord.id === id ? { ...ord, ...updatedData } : ord));
    saveToStorage(newData);
    toast.success('Pedido actualizado exitosamente');
  };

  const deleteOrder = (id) => {
    const newData = orders.filter(ord => ord.id !== id);
    saveToStorage(newData);
    toast.success('Pedido eliminado exitosamente');
  };

  return {
    orders,
    loading,
    addOrder,
    updateOrder,
    deleteOrder
  };
};

export default useOrders;
