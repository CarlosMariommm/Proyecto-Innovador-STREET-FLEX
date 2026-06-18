import api from './api';

export const saleService = {
  getSales: async () => {
    const response = await api.get('/sales');
    return response.data;
  }
};
