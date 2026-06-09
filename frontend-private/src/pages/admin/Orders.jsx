import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useOrders from '../../components/Orders/hooks/useOrders';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { Edit2, Trash2, Plus, X } from 'lucide-react';

const Orders = () => {
  const { orders, addOrder, updateOrder, deleteOrder } = useOrders();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const openModal = (order = null) => {
    setEditingOrder(order);
    if (order) {
      reset(order);
    } else {
      reset({ customerName: '', total: '', status: 'Pendiente' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingOrder(null);
    reset();
  };

  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      total: parseFloat(data.total)
    };

    if (editingOrder) {
      updateOrder(editingOrder.id, formattedData);
    } else {
      addOrder(formattedData);
    }
    closeModal();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h2 className="text-xl font-bold text-gray-800">Gestión de Pedidos</h2>
        <Button onClick={() => openModal()} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nuevo Pedido
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b">
              <th className="p-4 font-medium">ID</th>
              <th className="p-4 font-medium">Cliente</th>
              <th className="p-4 font-medium">Total</th>
              <th className="p-4 font-medium">Fecha</th>
              <th className="p-4 font-medium">Estado</th>
              <th className="p-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">
                  No hay pedidos registrados.
                </td>
              </tr>
            ) : (
              orders.map((ord) => (
                <tr key={ord.id} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 text-sm text-gray-500">#{ord.id}</td>
                  <td className="p-4 font-medium text-gray-800">{ord.customerName}</td>
                  <td className="p-4 font-medium text-green-600">${Number(ord.total).toFixed(2)}</td>
                  <td className="p-4 text-gray-600">{new Date(ord.date).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ord.status === 'Completado' ? 'bg-green-100 text-green-700' : 
                      ord.status === 'Cancelado' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {ord.status}
                    </span>
                  </td>
                  <td className="p-4 flex justify-end gap-2">
                    <button 
                      onClick={() => openModal(ord)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        if(window.confirm('¿Estás seguro de eliminar este pedido?')) {
                          deleteOrder(ord.id);
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">
                {editingOrder ? 'Editar Pedido' : 'Nuevo Pedido'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <Input
                label="Nombre del Cliente"
                {...register('customerName', { required: 'El nombre es requerido' })}
                error={errors.customerName?.message}
              />
              
              <Input
                label="Total ($)"
                type="number"
                step="0.01"
                {...register('total', { 
                  required: 'El total es requerido',
                  min: { value: 0, message: 'No puede ser negativo' }
                })}
                error={errors.total?.message}
              />

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  {...register('status', { required: 'El estado es requerido' })}
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Procesando">Procesando</option>
                  <option value="Completado">Completado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="secondary" onClick={closeModal}>
                  Cancelar
                </Button>
                <Button type="submit" variant="primary">
                  {editingOrder ? 'Actualizar' : 'Guardar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
