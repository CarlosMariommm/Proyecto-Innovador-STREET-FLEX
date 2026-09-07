import { request } from './api';

export const fetchCartByClient = async (clientId) => {
  const res = await request(`/shopping-cars/client/${clientId}`);
  return res.data || null;
};

// Sincroniza (crea o actualiza) el carrito del cliente en el backend.
export const syncCart = async (clientId, { products, total, discount, total_w_discount }) => {
  const res = await request(`/shopping-cars/sync/${clientId}`, {
    method: 'PUT',
    body: { products, total, discount, total_w_discount },
  });
  return res.data;
};
