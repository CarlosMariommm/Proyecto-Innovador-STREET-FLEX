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

// Cancela un pedido propio; el servidor devuelve el stock de sus productos.
export const cancelSale = async (saleId) => {
  const res = await request(`/sales/${saleId}/cancel`, { method: 'PUT' });
  return res.data;
};
