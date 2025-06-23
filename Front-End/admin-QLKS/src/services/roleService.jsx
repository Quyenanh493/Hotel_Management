import request from '../utils/request';

// Lấy tất cả vai trò
export const getAllRoles = async () => {
  try {
    const response = await request.get('roles');
    return response;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách vai trò:', error);
    throw error;
  }
};

// Lấy vai trò theo ID
export const getRoleById = async (roleId) => {
  try {
    const response = await request.get(`roles/${roleId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin vai trò ID ${roleId}:`, error);
    throw error;
  }
};

// Tạo vai trò mới
export const createRole = async (roleData) => {
  try {
    const response = await request.post('roles', roleData);
    return response;
  } catch (error) {
    console.error('Lỗi khi tạo vai trò mới:', error);
    throw error;
  }
};

// Cập nhật thông tin vai trò
export const updateRole = async (roleId, roleData) => {
  try {
    const response = await request.put(`roles/${roleId}`, roleData);
    return response;
  } catch (error) {
    console.error(`Lỗi khi cập nhật vai trò ID ${roleId}:`, error);
    throw error;
  }
};

// Xóa vai trò
export const deleteRole = async (roleId) => {
  try {
    const response = await request.delete(`roles/${roleId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi xóa vai trò ID ${roleId}:`, error);
    throw error;
  }
};

// Thêm quyền vào vai trò
export const addPermissionToRole = async (roleId, permissionId) => {
  try {
    const response = await request.post('roles/add-permission', { roleId, permissionId });
    return response;
  } catch (error) {
    console.error(`Lỗi khi thêm quyền vào vai trò:`, error);
    throw error;
  }
};

// Xóa quyền khỏi vai trò
export const removePermissionFromRole = async (roleId, permissionId) => {
  try {
    const response = await request.post('roles/remove-permission', { roleId, permissionId });
    return response;
  } catch (error) {
    console.error(`Lỗi khi xóa quyền khỏi vai trò:`, error);
    throw error;
  }
}; 