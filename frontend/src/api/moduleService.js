import api from './api';

export const moduleService = {
  getModules: async () => {
    const response = await api.get('/modules');
    return response.data;
  },
  createModule: async (formData) => {
    // Note: Use FormData because we are uploading an image file
    const response = await api.post('/modules', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  deleteModule: async (id) => {
    const response = await api.delete(`/modules/${id}`);
    return response.data;
  }
};
