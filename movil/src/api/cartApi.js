import { request } from './api';

// Guarda el carrito de un pedido como un Shopping_Car NUEVO y devuelve su id,
// que es lo que la venta (Sale) necesita en `id_shoppig_car`. Uno por pedido:
// ver CartContext.saveOrderCart.
export const createOrderCart = async ({ products, id_client, total, discount, total_w_discount }) => {
  const res = await request('/shopping-cars', {
    method: 'POST',
    body: { products, id_client, total, discount, total_w_discount },
  });
  return res.cartId;
};
