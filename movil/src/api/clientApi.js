import { request } from './api';

export const fetchFavorites = () => request('/clients/favorites');

export const addFavorite = (productId) =>
  request('/clients/favorites', { method: 'POST', body: { productId } });

export const removeFavorite = (productId) =>
  request(`/clients/favorites/${productId}`, { method: 'DELETE' });
