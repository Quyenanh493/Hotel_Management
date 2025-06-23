import contactService from '../services/contactService';

/**
 * Xử lý request gửi email liên hệ
 */
const handleSendContactEmail = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Xác thực dữ liệu đơn giản
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        EM: 'Vui lòng cung cấp đầy đủ thông tin (tên, email, tiêu đề và nội dung)',
        EC: -1,
        DT: null,
      });
    }

    // Xác thực email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        EM: 'Địa chỉ email không hợp lệ',
        EC: -1,
        DT: null,
      });
    }

    // Gửi email qua service
    const result = await contactService.sendContactEmail({
      name,
      email,
      subject,
      message,
    });

    // Trả về kết quả
    return res.status(result.EC === 0 ? 200 : 400).json({
      EM: result.EM,
      EC: result.EC,
      DT: result.DT,
    });
  } catch (error) {
    console.error('Lỗi trong handleSendContactEmail:', error);
    next(error);
  }
};

module.exports = {
  handleSendContactEmail,
}; 