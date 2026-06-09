import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useProducts from '../../components/Products/hooks/useProducts';
import useCategories from '../../components/Categories/hooks/useCategories';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { Edit2, Trash2, Plus, X } from 'lucide-react';

const Products = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { categories } = useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const openModal = (product = null) => {
    setEditingProduct(product);
    if (product) {
      reset(product);
    } else {
      reset({ name: '', categoryId: '', price: '', stock: '', active: true });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    reset();
  };

  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      categoryId: parseInt(data.categoryId, 10),
      price: parseFloat(data.price),
      stock: parseInt(data.stock, 10)
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, formattedData);
    } else {
      addProduct(formattedData);
    }
    closeModal();
  };

  const getCategoryName = (id) => {
    const cat = categories.find(c => c.id === parseInt(id, 10));
    return cat ? cat.name : 'Desconocida';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h2 className="text-xl font-bold text-gray-800">Gestión de Productos</h2>
        <Button onClick={() => openModal()} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nuevo Producto
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b">
              <th className="p-4 font-medium">ID</th>
              <th className="p-4 font-medium">Nombre</th>
              <th className="p-4 font-medium">Categoría</th>
              <th className="p-4 font-medium">Precio</th>
              <th className="p-4 font-medium">Stock</th>
              <th className="p-4 font-medium">Estado</th>
              <th className="p-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-500">
                  No hay productos registrados.
                </td>
              </tr>
            ) : (
              products.map((prod) => (
                <tr key={prod.id} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 text-sm text-gray-500">#{prod.id}</td>
                  <td className="p-4 font-medium text-gray-800">{prod.name}</td>
                  <td className="p-4 text-gray-600">{getCategoryName(prod.categoryId)}</td>
                  <td className="p-4 font-medium text-green-600">${Number(prod.price).toFixed(2)}</td>
                  <td className="p-4 text-gray-600">{prod.stock} uds.</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      prod.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {prod.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="p-4 flex justify-end gap-2">
                    <button 
                      onClick={() => openModal(prod)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        if(window.confirm('¿Estás seguro de eliminar este producto?')) {
                          deleteProduct(prod.id);
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

      {/* Modal Modal/Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <Input
                label="Nombre del Producto"
                {...register('name', { required: 'El nombre es requerido' })}
                error={errors.name?.message}
              />
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select 
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.categoryId ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                  {...register('categoryId', { required: 'Debe seleccionar una categoría' })}
                >
                  <option value="">Seleccione una categoría...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {errors.categoryId && <p className="mt-1 text-sm text-red-500">{errors.categoryId.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Precio ($)"
                  type="number"
                  step="0.01"
                  {...register('price', { 
                    required: 'El precio es requerido',
                    min: { value: 0, message: 'No puede ser negativo' }
                  })}
                  error={errors.price?.message}
                />
                <Input
                  label="Stock"
                  type="number"
                  {...register('stock', { 
                    required: 'El stock es requerido',
                    min: { value: 0, message: 'No puede ser negativo' }
                  })}
                  error={errors.stock?.message}
                />
              </div>

              <div className="flex items-center gap-2 mb-4">
                <input 
                  type="checkbox" 
                  id="activeProd" 
                  {...register('active')} 
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="activeProd" className="text-sm font-medium text-gray-700">
                  Producto Activo
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="secondary" onClick={closeModal}>
                  Cancelar
                </Button>
                <Button type="submit" variant="primary">
                  {editingProduct ? 'Actualizar' : 'Guardar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
