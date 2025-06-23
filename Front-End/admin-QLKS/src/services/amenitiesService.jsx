import request from '../utils/request';

// Lấy tất cả tiện nghi
export const getAllAmenities = async () => {
  try {
    const response = await request.get('amenities');
    return response;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tiện nghi:', error);
    throw error;
  }
};

// Lấy tiện nghi theo ID
export const getAmenityById = async (amenityId) => {
  try {
    const response = await request.get(`amenities/${amenityId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin tiện nghi ID ${amenityId}:`, error);
    throw error;
  }
};

// Tạo tiện nghi mới
export const createAmenity = async (amenityData) => {
  try {
    const response = await request.post('amenities', amenityData);
    return response;
  } catch (error) {
    console.error('Lỗi khi tạo tiện nghi mới:', error);
    throw error;
  }
};

// Cập nhật thông tin tiện nghi
export const updateAmenity = async (amenityId, amenityData) => {
  try {
    const response = await request.put(`amenities/${amenityId}`, amenityData);
    return response;
  } catch (error) {
    console.error(`Lỗi khi cập nhật tiện nghi ID ${amenityId}:`, error);
    throw error;
  }
};

// Xóa tiện nghi
export const deleteAmenity = async (amenityId) => {
  try {
    const response = await request.delete(`amenities/${amenityId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi xóa tiện nghi ID ${amenityId}:`, error);
    throw error;
  }
}; 