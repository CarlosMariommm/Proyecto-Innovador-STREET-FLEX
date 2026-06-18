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
  }
};
