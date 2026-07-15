import api from './api';

export const aiTryOnService = {
  /**
   * Generate a virtual try-on image using Replicate's IDM-VTON.
   * @param {string} garmentImageUrl - URL of the garment image (Cloudinary URL)
   * @param {File}   humanImageFile  - The user's photo as a File object
   * @returns {Promise<{data: {result_image: string}}>}
   */
  generateTryOn: async (garmentImageUrl, humanImageFile) => {
    const formData = new FormData();
    formData.append('garment_image_url', garmentImageUrl);
    formData.append('human_image', humanImageFile);

    const response = await api.post('/ai-try-ons/generate', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000, // 2 min timeout since AI generation can take ~30-60s
    });
    return response.data;
  },

  // Existing CRUD
  getTryOns: async () => {
    const response = await api.get('/ai-try-ons');
    return response.data;
  },

  createTryOn: async (data) => {
    const response = await api.post('/ai-try-ons', data);
    return response.data;
  },
};
