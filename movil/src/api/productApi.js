import { request } from './api';

export const fetchProducts = async () => {
  const res = await request('/products');
  return res.data || [];
};

export const fetchProductById = async (id) => {
  const res = await request(`/products/${id}`);
  return res.data;
};

export const addProductReview = ({ productId, id_client, rating, comment }) =>
  request(`/products/${productId}/reviews`, {
    method: 'POST',
    body: { id_client, rating, comment },
  });
