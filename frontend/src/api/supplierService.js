import api from './api';

export const supplierService = {
  getSuppliers: async () => {
    const response = await api.get('/suppliers');
    return response.data;
  },

  createSupplier: async (supplierData) => {
    const isFormData = supplierData instanceof FormData;
    
    const config = isFormData ? {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    } : {};

    const response = await api.post('/suppliers', supplierData, config);
    return response.data;
  },

  updateSupplier: async (id, supplierData) => {
    const isFormData = supplierData instanceof FormData;
    const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const response = await api.put(`/suppliers/${id}`, supplierData, config);
    return response.data;
  },

  deleteSupplier: async (id) => {
    const response = await api.delete(`/suppliers/${id}`);
    return response.data;
  }
};
