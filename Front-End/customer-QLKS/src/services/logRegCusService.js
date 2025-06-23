import request from '../utils/request';

// Dịch vụ đăng nhập khách hàng
export const loginCustomer = async (credentials) => {
  try {
    // Đảm bảo gửi dữ liệu dạng raw JSON
    const response = await request.post('auth/login', credentials, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response;
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    throw error;
  }
};

// Dịch vụ đăng ký khách hàng
export const registerCustomer = async (userData, isFormData = false) => {
  try {
    if (isFormData) {
      // Nếu là FormData, sử dụng header khác
      console.log('Sending FormData to server');
      return await request.post('auth/register', userData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      // Yêu cầu JSON thông thường
      return await request.post('auth/register', userData);
    }
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    throw error;
  }
};

// Gửi yêu cầu đặt lại mật khẩu (quên mật khẩu)
export const forgotPassword = async (email) => {
  try {
    return await request.post('auth/forgot-password', { email });
  } catch (error) {
    console.error('Lỗi gửi yêu cầu đặt lại mật khẩu:', error);
    throw error;
  }
};

// Xác thực mã reset
export const verifyResetCode = async (email, code) => {
  try {
    return await request.post('auth/verify-reset-code', { email, code });
  } catch (error) {
    console.error('Lỗi xác thực mã reset:', error);
    throw error;
  }
};

// Đặt lại mật khẩu
export const resetPassword = async (email, token, newPassword) => {
  try {
    return await request.post('auth/reset-password', { 
      email, 
      token, 
      newPassword 
    });
  } catch (error) {
    console.error('Lỗi đặt lại mật khẩu:', error);
    throw error;
  }
};

// Đổi mật khẩu
export const changePassword = async (accountId, currentPassword, newPassword) => {
  try {
    return await request.post('accounts/change-password', {
      accountId,
      currentPassword,
      newPassword
    });
  } catch (error) {
    console.error('Lỗi đổi mật khẩu:', error);
    throw error;
  }
};

// Lấy hồ sơ khách hàng hiện tại
export const getCustomerProfile = async () => {
  try {
    return await request.get('customers/profile');
  } catch (error) {
    console.error('Lỗi lấy hồ sơ:', error);
    throw error;
  }
};