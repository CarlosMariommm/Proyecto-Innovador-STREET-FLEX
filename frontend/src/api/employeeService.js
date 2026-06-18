import api from './api';

export const employeeService = {
  getEmployees: async () => {
    const response = await api.get('/employees');
    return response.data;
  },

  createEmployee: async (employeeData) => {
    const isFormData = employeeData instanceof FormData;
    
    const config = isFormData ? {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    } : {};

    const response = await api.post('/employees', employeeData, config);
    return response.data;
  }
};
