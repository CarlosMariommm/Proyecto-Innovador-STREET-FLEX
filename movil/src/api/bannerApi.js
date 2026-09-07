import { request } from './api';

export const fetchBanners = async () => {
  const res = await request('/banners');
  return res.data || [];
};
