import request from '../utils/request';

// Lấy tất cả tiện nghi
export const getAllAmenities = async () => {
  try {
    const response = await request.get('/amenities');
    return response;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tiện nghi:', error);
    throw error;
  }
};

// Lấy tiện nghi theo ID
export const getAmenityById = async (amenityId) => {
  try {
    const response = await request.get(`/amenities/${amenityId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin tiện nghi ID ${amenityId}:`, error);
    throw error;
  }
};

// Lấy tiện nghi theo danh mục
export const getAmenitiesByCategory = async (category) => {
  try {
    const response = await request.get('/amenities', {
      params: { category }
    });
    return response;
  } catch (error) {
    console.error(`Lỗi khi lấy tiện nghi theo danh mục ${category}:`, error);
    throw error;
  }
};

// Tìm kiếm tiện nghi
export const searchAmenities = async (searchTerm) => {
  try {
    const response = await request.get('/amenities', {
      params: { search: searchTerm }
    });
    return response;
  } catch (error) {
    console.error('Lỗi khi tìm kiếm tiện nghi:', error);
    throw error;
  }
};

// Thêm tiện nghi vào giỏ hàng (nếu có chức năng này)
export const addAmenityToCart = async (amenityId, quantity = 1) => {
  try {
    const response = await request.post('/cart/amenities', {
      amenityId,
      quantity
    });
    return response;
  } catch (error) {
    console.error('Lỗi khi thêm tiện nghi vào giỏ hàng:', error);
    throw error;
  }
};

// Kiểm tra tình trạng có sẵn của tiện nghi
export const checkAmenityAvailability = async (amenityId) => {
  try {
    const response = await request.get(`/amenities/${amenityId}/availability`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi kiểm tra tình trạng tiện nghi ID ${amenityId}:`, error);
    throw error;
  }
};

// Lấy tiện nghi phổ biến
export const getPopularAmenities = async (limit = 10) => {
  try {
    const response = await request.get('/amenities/popular', {
      params: { limit }
    });
    return response;
  } catch (error) {
    console.error('Lỗi khi lấy tiện nghi phổ biến:', error);
    throw error;
  }
};

// Lấy tiện nghi của phòng theo roomId
export const getAmenityByRoomId = async (roomId) => {
  try {
    const response = await request.get(`/amenities/room/${roomId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi lấy tiện nghi của phòng ID ${roomId}:`, error);
    throw error;
  }
};