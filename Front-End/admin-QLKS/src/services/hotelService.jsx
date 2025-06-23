import request from '../utils/request';

// Lấy tất cả khách sạn
export const getAllHotels = async () => {
  try {
    const response = await request.get('hotels');
    return response;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách khách sạn:', error);
    throw error;
  }
};

// Lấy tất cả khách sạn cho admin (bao gồm cả active và inactive)
export const getAllHotelsForAdmin = async () => {
  try {
    const response = await request.get('hotels/admin/all');
    return response;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tất cả khách sạn cho admin:', error);
    throw error;
  }
};

// Lấy khách sạn theo ID
export const getHotelById = async (hotelId) => {
  try {
    const response = await request.get(`hotels/${hotelId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin khách sạn ID ${hotelId}:`, error);
    throw error;
  }
};

// Tạo khách sạn mới
export const createHotel = async (hotelData) => {
  try {
    const response = await request.post('hotels', hotelData);
    return response;
  } catch (error) {
    console.error('Lỗi khi tạo khách sạn mới:', error);
    throw error;
  }
};

// Cập nhật thông tin khách sạn
export const updateHotel = async (hotelId, hotelData) => {
  try {
    const response = await request.put(`hotels/${hotelId}`, hotelData);
    return response;
  } catch (error) {
    console.error(`Lỗi khi cập nhật khách sạn ID ${hotelId}:`, error);
    throw error;
  }
};

// Xóa khách sạn
export const deleteHotel = async (hotelId) => {
  try {
    const response = await request.delete(`hotels/${hotelId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi xóa khách sạn ID ${hotelId}:`, error);
    throw error;
  }
};
