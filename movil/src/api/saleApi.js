import { request } from './api';

export const createSale = async ({ id_shoppig_car, delivery_addres, city, payment_method, payment_status }) => {
  const res = await request('/sales', {
    method: 'POST',
    body: { id_shoppig_car, delivery_addres, city, payment_method, payment_status },
  });
  return res.data;
};

export const fetchSalesByClient = async (clientId) => {
  const res = await request(`/sales/client/${clientId}`);
  return res.data || [];
};
