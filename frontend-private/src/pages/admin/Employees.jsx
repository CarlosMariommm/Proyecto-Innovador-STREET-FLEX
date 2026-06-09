import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useEmployees from '../../components/Employees/hooks/useEmployees';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { Edit2, Trash2, Plus, X } from 'lucide-react';

const Employees = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useEmployees();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const openModal = (employee = null) => {
    setEditingEmployee(employee);
    if (employee) {
      reset(employee);
    } else {
      reset({ name: '', role: '', active: true });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
    reset();
  };

  const onSubmit = (data) => {
    if (editingEmployee) {
      updateEmployee(editingEmployee.id, data);
    } else {
      addEmployee(data);
    }
    closeModal();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h2 className="text-xl font-bold text-gray-800">Gestión de Empleados</h2>
        <Button onClick={() => openModal()} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nuevo Empleado
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b">
              <th className="p-4 font-medium">ID</th>
              <th className="p-4 font-medium">Nombre Completo</th>
              <th className="p-4 font-medium">Rol/Cargo</th>
              <th className="p-4 font-medium">Estado</th>
              <th className="p-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  No hay empleados registrados.
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 text-sm text-gray-500">#{emp.id}</td>
                  <td className="p-4 font-medium text-gray-800">{emp.name}</td>
                  <td className="p-4 text-gray-600">{emp.role}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      emp.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {emp.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="p-4 flex justify-end gap-2">
                    <button 
                      onClick={() => openModal(emp)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        if(window.confirm('¿Estás seguro de eliminar a este empleado?')) {
                          deleteEmployee(emp.id);
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
                {editingEmployee ? 'Editar Empleado' : 'Nuevo Empleado'}
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
                label="Rol / Cargo"
                placeholder="Vendedor, Supervisor, etc."
                {...register('role', { required: 'El rol es requerido' })}
                error={errors.role?.message}
              />

              <div className="flex items-center gap-2 mb-4">
                <input 
                  type="checkbox" 
                  id="activeEmp" 
                  {...register('active')} 
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="activeEmp" className="text-sm font-medium text-gray-700">
                  Empleado Activo
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="secondary" onClick={closeModal}>
                  Cancelar
                </Button>
                <Button type="submit" variant="primary">
                  {editingEmployee ? 'Actualizar' : 'Guardar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
