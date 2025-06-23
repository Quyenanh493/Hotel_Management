import request from '../utils/request';

// Lấy tất cả quyền
export const getAllPermissions = async () => {
  try {
    const response = await request.get('permissions');
    return response;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách quyền:', error);
    throw error;
  }
};

// Lấy quyền theo ID
export const getPermissionById = async (permissionId) => {
  try {
    const response = await request.get(`permissions/${permissionId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin quyền ID ${permissionId}:`, error);
    throw error;
  }
};

// Tạo quyền mới
export const createPermission = async (permissionData) => {
  try {
    const response = await request.post('permissions', permissionData);
    return response;
  } catch (error) {
    console.error('Lỗi khi tạo quyền mới:', error);
    throw error;
  }
};

// Cập nhật thông tin quyền
export const updatePermission = async (permissionId, permissionData) => {
  try {
    const response = await request.put(`permissions/${permissionId}`, permissionData);
    return response;
  } catch (error) {
    console.error(`Lỗi khi cập nhật quyền ID ${permissionId}:`, error);
    throw error;
  }
};

// Xóa quyền
export const deletePermission = async (permissionId) => {
  try {
    const response = await request.delete(`permissions/${permissionId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi xóa quyền ID ${permissionId}:`, error);
    throw error;
  }
}; 