import request from '../utils/request';

// Lấy tất cả phòng
export const getAllRooms = async () => {
  try {
    const response = await request.get('rooms');
    return response;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách phòng:', error);
    throw error;
  }
};

// Lấy phòng theo ID
export const getRoomById = async (roomId) => {
  try {
    const response = await request.get(`rooms/${roomId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin phòng ID ${roomId}:`, error);
    throw error;
  }
};

// Lấy phòng theo HotelId
export const getRoomsByHotelId = async (hotelId) => {
  try {
    const response = await request.get(`rooms/hotel/${hotelId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi lấy danh sách phòng của khách sạn ${hotelId}:`, error);
    throw error;
  }
};

// Tạo phòng mới
export const createRoom = async (roomData) => {
  try {
    const response = await request.post('rooms', roomData);
    return response;
  } catch (error) {
    console.error('Lỗi khi tạo phòng mới:', error);
    throw error;
  }
};

// Cập nhật thông tin phòng
export const updateRoom = async (roomId, roomData) => {
  try {
    const response = await request.put(`rooms/${roomId}`, roomData);
    return response;
  } catch (error) {
    console.error(`Lỗi khi cập nhật phòng ID ${roomId}:`, error);
    throw error;
  }
};

// Xóa phòng
export const deleteRoom = async (roomId) => {
  try {
    const response = await request.delete(`rooms/${roomId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi xóa phòng ID ${roomId}:`, error);
    throw error;
  }
}; 