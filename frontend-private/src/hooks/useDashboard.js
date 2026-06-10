import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

// Custom Hook para métricas del Dashboard conectado al backend real
const useDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [ordersByStatus, setOrdersByStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtiene las métricas del endpoint /api/dashboard
  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/dashboard', { credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al cargar métricas');
      setMetrics(data.metrics);
      setRecentOrders(data.recentOrders);
      setOrdersByStatus(data.ordersByStatus);
    } catch (error) {
      toast.error(error.message || 'No se pudieron cargar las métricas del panel');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return {
    metrics,
    recentOrders,
    ordersByStatus,
    loading,
    refetch: fetchMetrics
  };
};

export default useDashboard;
