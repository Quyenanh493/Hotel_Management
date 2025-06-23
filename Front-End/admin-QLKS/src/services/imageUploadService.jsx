import request from '../utils/request';

/**
 * Upload nhiều ảnh cho phòng
 * @param {number} roomId - ID của phòng
 * @param {FileList} files - Danh sách file ảnh
 * @returns {Promise} - Response từ API
 */
export const uploadRoomImages = async (roomId, files) => {
  try {
    const formData = new FormData();
    
    // Thêm tất cả file vào FormData
    Array.from(files).forEach(file => {
      formData.append('images', file);
    });

    const response = await request.post(`upload-image/room/${roomId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response;
  } catch (error) {
    console.error('Lỗi upload ảnh phòng:', error);
    throw error;
  }
};

/**
 * Upload nhiều ảnh cho khách sạn
 * @param {number} hotelId - ID của khách sạn
 * @param {FileList} files - Danh sách file ảnh
 * @returns {Promise} - Response từ API
 */
export const uploadHotelImages = async (hotelId, files) => {
  try {
    const formData = new FormData();
    
    // Thêm tất cả file vào FormData
    Array.from(files).forEach(file => {
      formData.append('images', file);
    });

    const response = await request.post(`upload-image/hotel/${hotelId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response;
  } catch (error) {
    console.error('Lỗi upload ảnh khách sạn:', error);
    throw error;
  }
};

/**
 * Lấy danh sách ảnh của phòng
 * @param {number} roomId - ID của phòng
 * @returns {Promise} - Response từ API
 */
export const getRoomImages = async (roomId) => {
  try {
    const response = await request.get(`upload-image/room/${roomId}`);
    return response;
  } catch (error) {
    console.error('Lỗi lấy ảnh phòng:', error);
    throw error;
  }
};

/**
 * Lấy danh sách ảnh của khách sạn
 * @param {number} hotelId - ID của khách sạn
 * @returns {Promise} - Response từ API
 */
export const getHotelImages = async (hotelId) => {
  try {
    const response = await request.get(`upload-image/hotel/${hotelId}`);
    return response;
  } catch (error) {
    console.error('Lỗi lấy ảnh khách sạn:', error);
    throw error;
  }
};

/**
 * Xóa ảnh cụ thể của phòng
 * @param {number} roomId - ID của phòng
 * @param {string} imageUrl - URL ảnh cần xóa
 * @returns {Promise} - Response từ API
 */
export const deleteRoomImage = async (roomId, imageUrl) => {
  try {
    const response = await request.delete(`upload-image/room/${roomId}`, {
      data: { imageUrl }
    });
    return response;
  } catch (error) {
    console.error('Lỗi xóa ảnh phòng:', error);
    throw error;
  }
};

/**
 * Xóa ảnh cụ thể của khách sạn
 * @param {number} hotelId - ID của khách sạn
 * @param {string} imageUrl - URL ảnh cần xóa
 * @returns {Promise} - Response từ API
 */
export const deleteHotelImage = async (hotelId, imageUrl) => {
  try {
    const response = await request.delete(`upload-image/hotel/${hotelId}`, {
      data: { imageUrl }
    });
    return response;
  } catch (error) {
    console.error('Lỗi xóa ảnh khách sạn:', error);
    throw error;
  }
}; 