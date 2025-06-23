import request from '../utils/request';
import { getCookie, setCookie } from '../helper/cookie';

/**
 * Đăng nhập vào hệ thống
 * @param {Object} credentials - Thông tin đăng nhập
 * @returns {Promise<Object>} - Kết quả đăng nhập
 */
export const login = async (credentials) => {
  try {
    const response = await request.post('auth/login', credentials);
    
    if (response.EC === 0 && response.DT) {
      // Lưu token vào cookie
      if (response.DT.accessToken) {
        setCookie('accessToken', response.DT.accessToken, 1); // 1 day
      }
      if (response.DT.refreshToken) {
        setCookie('refreshToken', response.DT.refreshToken, 7); // 7 days
      }
      
      // Lưu thông tin người dùng vào localStorage
      localStorage.setItem('user', JSON.stringify(response.DT));
    }
    
    return response;
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    throw error;
  }
};

/**
 * Kiểm tra xem người dùng có quyền admin/staff không
 * @param {Object} userData - Thông tin người dùng
 * @returns {Boolean} - Kết quả kiểm tra quyền
 */
export const hasAdminAccess = (userData) => {
  if (!userData) return false;
  return userData.accountType === 'admin' || userData.accountType === 'staff';
};

/**
 * Kiểm tra trạng thái đăng nhập
 * @returns {Boolean} - Đã đăng nhập hay chưa
 */
export const isAuthenticated = () => {
  const token = getCookie('accessToken');
  return !!token;
};

/**
 * Lấy thông tin người dùng đã đăng nhập
 * @returns {Object|null} - Thông tin người dùng hoặc null nếu chưa đăng nhập
 */
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng:', error);
    return null;
  }
};

/**
 * Làm mới token truy cập
 * @returns {Promise<Object>} - Kết quả làm mới token
 */
export const refreshToken = async () => {
  try {
    const refreshToken = getCookie('refreshToken');
    if (!refreshToken || refreshToken === 'undefined' || refreshToken === 'null') {
      throw new Error('Không có refresh token hoặc token không hợp lệ');
    }
    
    const response = await request.post('auth/refresh-token', { refreshToken });
    
    if (response.EC === 0 && response.DT) {
      if (response.DT.accessToken && typeof response.DT.accessToken === 'string') {
        setCookie('accessToken', response.DT.accessToken, 1);
        
        if (response.DT.refreshToken && typeof response.DT.refreshToken === 'string') {
          setCookie('refreshToken', response.DT.refreshToken, 7);
        }
        
        return response;
      }
    }
    
    throw new Error('Không thể làm mới token: ' + (response.EM || 'Lỗi không xác định'));
  } catch (error) {
    console.error('Lỗi khi làm mới token:', error);
    throw error;
  }
}; 