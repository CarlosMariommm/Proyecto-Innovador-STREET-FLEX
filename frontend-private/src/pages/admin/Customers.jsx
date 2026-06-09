import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useCustomers from '../../components/Customers/hooks/useCustomers';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { Edit2, Trash2, Plus, X } from 'lucide-react';

const Customers = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useCustomers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const openModal = (customer = null) => {
    setEditingCustomer(customer);
    if (customer) {
      // Don't show password field when editing for security
      reset({ name: customer.name, email: customer.email });
    } else {
      reset({ name: '', email: '', password: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
    reset();
  };

  const onSubmit = (data) => {
    if (editingCustomer) {
      // update
      updateCustomer(editingCustomer.id, { name: data.name, email: data.email });
    } else {
      // create
      addCustomer(data);
    }
    closeModal();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h2 className="text-xl font-bold text-gray-800">Gestión de Clientes</h2>
        <Button onClick={() => openModal()} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nuevo Cliente
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b">
              <th className="p-4 font-medium">ID</th>
              <th className="p-4 font-medium">Nombre</th>
              <th className="p-4 font-medium">Correo Electrónico</th>
              <th className="p-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500">
                  No hay clientes registrados.
                </td>
              </tr>
            ) : (
              customers.map((cust) => (
                <tr key={cust.id} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 text-sm text-gray-500">#{cust.id}</td>
                  <td className="p-4 font-medium text-gray-800">{cust.name}</td>
                  <td className="p-4 text-gray-600">{cust.email}</td>
                  <td className="p-4 flex justify-end gap-2">
                    <button 
                      onClick={() => openModal(cust)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        if(window.confirm('¿Estás seguro de eliminar este cliente?')) {
                          deleteCustomer(cust.id);
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
                {editingCustomer ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <Input
                label="Nombre Completo"
                {...register('name', { required: 'El nombre es requerido' })}
                error={errors.name?.message}
              />
              
              <Input
                label="Correo Electrónico"
                type="email"
                {...register('email', { 
                  required: 'El correo es requerido',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Dirección de correo inválida'
                  }
                })}
                error={errors.email?.message}
              />

              {!editingCustomer && (
                <Input
                  label="Contraseña Temporal"
                  type="password"
                  {...register('password', { 
                    required: 'La contraseña es requerida para nuevos clientes',
                    minLength: { value: 6, message: 'Mínimo 6 caracteres' }
                  })}
                  error={errors.password?.message}
                />
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="secondary" onClick={closeModal}>
                  Cancelar
                </Button>
                <Button type="submit" variant="primary">
                  {editingCustomer ? 'Actualizar' : 'Guardar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
