import api from './api';

export const clientService = {
  createClient: async (clientData) => {
    // Para simplificar, asume registro. En el futuro puede ser un endpoint especial /register
    const response = await api.post('/clients', clientData);
    return response.data;
  },
  login: async (email, password) => {
    const response = await api.post('/clients/login', { email, password });
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/clients/logout');
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/clients/profile');
    return response.data;
  },
  getClients: async () => {
    const response = await api.get('/clients');
    return response.data;
  },
  updateClient: async (id, data) => {
    const response = await api.put(`/clients/${id}`, data);
    return response.data;
  },
  deleteClient: async (id) => {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
  },
  getFavorites: async () => {
    const response = await api.get('/clients/favorites');
    return response.data;
  },
  addFavorite: async (productId) => {
    const response = await api.post('/clients/favorites', { productId });
    return response.data;
  },
  removeFavorite: async (productId) => {
    const response = await api.delete(`/clients/favorites/${productId}`);
    return response.data;
  }
};
