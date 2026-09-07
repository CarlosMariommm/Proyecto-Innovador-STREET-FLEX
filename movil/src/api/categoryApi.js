import { request } from './api';

export const fetchCategories = async () => {
  const res = await request('/categories');
  return res.data || [];
};
