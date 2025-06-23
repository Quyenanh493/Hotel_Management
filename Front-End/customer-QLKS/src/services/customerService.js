import { getCookie } from "../helper/cookie";
import request from '../utils/request';

export const updateCustomerProfile = async (customerId, profileData) => {
  try {
    const token = getCookie('accessToken');
    return await request.put(`customers/${customerId}`, profileData, {
      headers: {
        Authorization: `Bearer ${token}`, 
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Lỗi cập nhật hồ sơ:', error);
    throw error;
  }
};

// Function to upload customer profile image
export const uploadCustomerImage = async (customerId, imageFile) => {
  try {
    const token = getCookie('accessToken');
    const formData = new FormData();
    formData.append('image', imageFile);
    
    return await request.post(`upload-image/profile/${customerId}/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    console.error('Lỗi khi tải lên ảnh đại diện:', error);
    throw error;
  }
};

// Lấy thông tin khách hàng theo ID
export const getCustomerById = async (customerId) => {
  try {
    const response = await request.get(`customers/${customerId}`);
    return response;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin khách hàng:', error);
    throw error;
  }
};