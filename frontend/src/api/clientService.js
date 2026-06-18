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
  }
};
