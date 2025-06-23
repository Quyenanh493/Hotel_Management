import request from '../utils/request';

/**
 * Gửi email từ form liên hệ
 * @param {Object} contactData - Dữ liệu liên hệ
 * @returns {Promise} Promise với kết quả từ API
 */
export const sendContactEmail = async (contactData) => {
  try {
    const response = await request.post('/contact/send-email', contactData);
    return response;
  } catch (error) {
    console.error('Lỗi khi gửi thông tin liên hệ:', error);
    throw error;
  }
}; 