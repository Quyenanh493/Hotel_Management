import db from '../models/index';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Khởi tạo transporter cho email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Hàm tạo mã ngẫu nhiên
const generateResetCode = () => {
  // Tạo mã gồm 6 chữ số
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Hàm mã hóa mật khẩu
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const authService = {

  forgotPassword: async (email) => {
    try {
      // Tìm tài khoản theo email
      const account = await db.Account.findOne({ where: { email } });
      
      if (!account) {
        return {
          EM: 'Email không tồn tại trong hệ thống',
          EC: 1,
          DT: null
        };
      }
      
      // Tạo mã reset password
      const resetCode = generateResetCode();
      
      // Tạo token từ mã reset và email
      const resetToken = crypto
        .createHash('sha256')
        .update(resetCode + email)
        .digest('hex');
      
      // Lưu token và thời gian hết hạn vào account
      await account.update({
        resetPasswordToken: resetToken,
        resetPasswordExpires: Date.now() + 15 * 60 * 1000 // Hết hạn sau 15 phút
      });
      
      // Gửi email chứa mã reset
      const mailOptions = {
        from: `"Khách sạn của bạn" <${process.env.EMAIL_USER || 'phamhquyenanh@gmail.com'}>`,
        to: email,
        subject: 'Yêu cầu đặt lại mật khẩu',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #1890ff; margin-bottom: 20px; border-bottom: 2px solid #1890ff; padding-bottom: 10px;">Đặt lại mật khẩu</h2>
            
            <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
            <p>Mã xác nhận của bạn là:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="font-size: 24px; font-weight: bold; letter-spacing: 5px; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">${resetCode}</div>
            </div>
            
            <p>Mã xác nhận này sẽ hết hạn sau 15 phút.</p>
            <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
            
            <p style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eaeaea;">
              Trân trọng,<br>
              Đội ngũ Khách sạn của bạn
            </p>
          </div>
        `
      };
      
      await transporter.sendMail(mailOptions);
      
      return {
        EM: 'Mã xác nhận đã được gửi đến email của bạn',
        EC: 0,
        DT: null
      };
    } catch (error) {
      console.error('Lỗi trong forgotPassword:', error);
      return {
        EM: 'Có lỗi xảy ra khi xử lý yêu cầu',
        EC: -1,
        DT: null
      };
    }
  },
  

  verifyResetCode: async (email, code) => {
    try {
      // Tạo token từ mã và email để tìm trong DB
      const resetToken = crypto
        .createHash('sha256')
        .update(code + email)
        .digest('hex');
      
      // Tìm tài khoản với token và chưa hết hạn
      const account = await db.Account.findOne({
        where: {
          email,
          resetPasswordToken: resetToken,
          resetPasswordExpires: { [db.Sequelize.Op.gt]: Date.now() }
        }
      });
      
      if (!account) {
        return {
          EM: 'Mã xác nhận không hợp lệ hoặc đã hết hạn',
          EC: 1,
          DT: null
        };
      }
      
      return {
        EM: 'Mã xác nhận hợp lệ',
        EC: 0,
        DT: { token: resetToken }
      };
    } catch (error) {
      console.error('Lỗi trong verifyResetCode:', error);
      return {
        EM: 'Có lỗi xảy ra khi xác thực mã',
        EC: -1,
        DT: null
      };
    }
  },
  

  resetPassword: async (email, token, newPassword) => {
    try {
      // Tìm tài khoản với token và chưa hết hạn
      const account = await db.Account.findOne({
        where: {
          email,
          resetPasswordToken: token,
          resetPasswordExpires: { [db.Sequelize.Op.gt]: Date.now() }
        }
      });
      
      if (!account) {
        return {
          EM: 'Token không hợp lệ hoặc đã hết hạn',
          EC: 1,
          DT: null
        };
      }
      
      // Mã hóa mật khẩu mới
      const hashedPassword = await hashPassword(newPassword);
      
      // Cập nhật mật khẩu và xóa token
      await account.update({
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      });
      
      return {
        EM: 'Đặt lại mật khẩu thành công',
        EC: 0,
        DT: null
      };
    } catch (error) {
      console.error('Lỗi trong resetPassword:', error);
      return {
        EM: 'Có lỗi xảy ra khi đặt lại mật khẩu',
        EC: -1,
        DT: null
      };
    }
  }
};

export default authService; 