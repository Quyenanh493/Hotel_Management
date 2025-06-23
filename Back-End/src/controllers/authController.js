import authService from '../services/authService';

/**
 * Controller xử lý yêu cầu quên mật khẩu
 */
const handleForgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        EM: 'Vui lòng cung cấp địa chỉ email',
        EC: 1,
        DT: null
      });
    }
    
    // Xác thực email đơn giản
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        EM: 'Địa chỉ email không hợp lệ',
        EC: 1,
        DT: null
      });
    }
    
    const result = await authService.forgotPassword(email);
    
    // Trả về kết quả
    return res.status(result.EC === 0 ? 200 : 400).json({
      EM: result.EM,
      EC: result.EC,
      DT: result.DT
    });
  } catch (error) {
    console.error('Lỗi trong handleForgotPassword:', error);
    next(error);
  }
};

/**
 * Controller xác thực mã reset
 */
const handleVerifyResetCode = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    
    if (!email || !code) {
      return res.status(400).json({
        EM: 'Vui lòng cung cấp email và mã xác nhận',
        EC: 1,
        DT: null
      });
    }
    
    const result = await authService.verifyResetCode(email, code);
    
    return res.status(result.EC === 0 ? 200 : 400).json({
      EM: result.EM,
      EC: result.EC,
      DT: result.DT
    });
  } catch (error) {
    console.error('Lỗi trong handleVerifyResetCode:', error);
    next(error);
  }
};

/**
 * Controller đặt lại mật khẩu
 */
const handleResetPassword = async (req, res, next) => {
  try {
    const { email, token, newPassword } = req.body;
    
    if (!email || !token || !newPassword) {
      return res.status(400).json({
        EM: 'Vui lòng cung cấp đầy đủ thông tin',
        EC: 1,
        DT: null
      });
    }
    
    // Kiểm tra yêu cầu về mật khẩu
    if (newPassword.length < 6) {
      return res.status(400).json({
        EM: 'Mật khẩu phải có ít nhất 6 ký tự',
        EC: 1,
        DT: null
      });
    }
    
    const result = await authService.resetPassword(email, token, newPassword);
    
    return res.status(result.EC === 0 ? 200 : 400).json({
      EM: result.EM,
      EC: result.EC,
      DT: result.DT
    });
  } catch (error) {
    console.error('Lỗi trong handleResetPassword:', error);
    next(error);
  }
};

export default {
  handleForgotPassword,
  handleVerifyResetCode,
  handleResetPassword
}; 