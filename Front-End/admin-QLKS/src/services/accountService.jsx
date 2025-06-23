import request from '../utils/request';

// Lấy tất cả tài khoản
export const getAllAccounts = async () => {
  try {
    const response = await request.get('accounts');
    return response;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tài khoản:', error);
    throw error;
  }
};

// Lấy tài khoản theo ID
export const getAccountById = async (accountId) => {
  try {
    const response = await request.get(`accounts/${accountId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin tài khoản ID ${accountId}:`, error);
    throw error;
  }
};

// Tạo tài khoản mới
export const createAccount = async (accountData) => {
  try {
    const response = await request.post('accounts', accountData);
    return response;
  } catch (error) {
    console.error('Lỗi khi tạo tài khoản mới:', error);
    throw error;
  }
};

// Cập nhật thông tin tài khoản
export const updateAccount = async (accountId, accountData) => {
  try {
    const response = await request.put(`accounts/${accountId}`, accountData);
    return response;
  } catch (error) {
    console.error(`Lỗi khi cập nhật tài khoản ID ${accountId}:`, error);
    throw error;
  }
};

// Xóa tài khoản
export const deleteAccount = async (accountId) => {
  try {
    const response = await request.delete(`accounts/${accountId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi xóa tài khoản ID ${accountId}:`, error);
    throw error;
  }
}; 