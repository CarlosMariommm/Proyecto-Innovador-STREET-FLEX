import api from './api';

export const shopService = {
  createShoppingCar: async (cartData) => {
    const response = await api.post('/shopping-cars', cartData);
    return response.data;
  },
  createSale: async (saleData) => {
    const response = await api.post('/sales', saleData);
    return response.data;
  }
};
