import request from '../utils/request';

// Lấy tất cả người dùng
export const getAllUsers = async () => {
  try {
    const response = await request.get('users');
    return response;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách người dùng:', error);
    throw error;
  }
};

// Lấy người dùng theo ID
export const getUserById = async (userId) => {
  try {
    const response = await request.get(`users/${userId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin người dùng ID ${userId}:`, error);
    throw error;
  }
};

// Lấy người dùng theo HotelId
export const getUsersByHotelId = async (hotelId) => {
  try {
    const response = await request.get(`users/hotel/${hotelId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi lấy danh sách người dùng của khách sạn ${hotelId}:`, error);
    throw error;
  }
};

// Tạo người dùng mới
export const createUser = async (userData) => {
  try {
    const response = await request.post('users', userData);
    return response;
  } catch (error) {
    console.error('Lỗi khi tạo người dùng mới:', error);
    throw error;
  }
};

// Cập nhật thông tin người dùng
export const updateUser = async (userId, userData) => {
  try {
    const response = await request.put(`users/${userId}`, userData);
    return response;
  } catch (error) {
    console.error(`Lỗi khi cập nhật người dùng ID ${userId}:`, error);
    throw error;
  }
};

// Xóa người dùng
export const deleteUser = async (userId) => {
  try {
    const response = await request.delete(`users/${userId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi xóa người dùng ID ${userId}:`, error);
    throw error;
  }
};

// Gán vai trò cho người dùng
export const assignRoleToUser = async (userId, roleId) => {
  try {
    const response = await request.put(`users/${userId}/role`, { roleId });
    return response;
  } catch (error) {
    console.error(`Lỗi khi gán vai trò cho người dùng:`, error);
    throw error;
  }
};

// Lấy quyền của người dùng
export const getUserPermissions = async (userId) => {
  try {
    const response = await request.get(`users/${userId}/permissions`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi lấy quyền của người dùng ID ${userId}:`, error);
    throw error;
  }
}; 