import api from './api';

export const adminService = {
  getAdmins: async () => {
    const response = await api.get('/admins');
    return response.data;
  },
  login: async (email, password) => {
    const response = await api.post('/admins/login', { email, password });
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/admins/logout');
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/admins/profile');
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await api.put('/admins/profile', data);
    return response.data;
  }
};
