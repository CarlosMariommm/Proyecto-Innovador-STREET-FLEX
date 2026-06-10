import React from 'react';
import { useAuth } from '../components/Auth/AuthContext';
import useDashboard from '../hooks/useDashboard';
import { ShoppingCart, Users, Package, Tags, DollarSign } from 'lucide-react';

const MetricCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
    <div className={`p-3 rounded-full ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value ?? '—'}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const { metrics, recentOrders, loading } = useDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Bienvenido, {user?.firstName || user?.name || 'Admin'} 👋
        </h2>
        <p className="text-gray-500 mt-1">Panel de control de StreetFlex</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <MetricCard
          title="Clientes"
          value={metrics?.customersCount}
          icon={Users}
          color="bg-blue-500"
        />
        <MetricCard
          title="Empleados"
          value={metrics?.employeesCount}
          icon={Users}
          color="bg-purple-500"
        />
        <MetricCard
          title="Productos"
          value={metrics?.productsCount}
          icon={Package}
          color="bg-green-500"
        />
        <MetricCard
          title="Pedidos"
          value={metrics?.ordersCount}
          icon={ShoppingCart}
          color="bg-orange-500"
        />
        <MetricCard
          title="Ingresos Totales"
          value={metrics?.totalRevenue != null ? `$${metrics.totalRevenue.toFixed(2)}` : '—'}
          icon={DollarSign}
          color="bg-emerald-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Pedidos Recientes</h3>
        {recentOrders.length === 0 ? (
          <p className="text-gray-400 text-sm">No hay pedidos registrados aún.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-medium">Cliente</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Estado</th>
                  <th className="pb-3 font-medium">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 text-gray-800">
                      {order.user
                        ? `${order.user.firstName} ${order.user.lastName}`
                        : 'N/A'}
                    </td>
                    <td className="py-3 text-gray-800">${order.totalPrice?.toFixed(2)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Entregado' ? 'bg-green-100 text-green-700' :
                        order.status === 'Cancelado' ? 'bg-red-100 text-red-700' :
                        order.status === 'Enviado' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('es-SV')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
