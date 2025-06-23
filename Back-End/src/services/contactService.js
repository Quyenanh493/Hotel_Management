import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASSWORD, 
  },
});

const contactService = {
  sendContactEmail: async (data) => {
    try {
      // Kiểm tra dữ liệu đầu vào
      if (!data.name || !data.email || !data.subject || !data.message) {
        return {
          EM: 'Vui lòng điền đầy đủ thông tin',
          EC: -1,
          DT: null,
        };
      }

      // Cấu hình email
      const mailOptions = {
        from: `"Web Khách sạn" <${process.env.EMAIL_USER || 'phamhquyenanh@gmail.com'}>`,
        to: process.env.RECIPIENT_EMAIL || 'phamhquyenanh@gmail.com', // Địa chỉ email nhận phản hồi
        replyTo: data.email,
        subject: `Liên hệ mới: ${data.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #1890ff; margin-bottom: 20px; border-bottom: 2px solid #1890ff; padding-bottom: 10px;">Tin nhắn liên hệ mới</h2>
            
            <p><strong>Từ:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Tiêu đề:</strong> ${data.subject}</p>
            
            <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
              <h3 style="margin-top: 0; color: #333;">Nội dung tin nhắn:</h3>
              <p style="white-space: pre-line;">${data.message}</p>
            </div>
            
            <p style="margin-top: 20px; font-size: 12px; color: #999;">
              Email này được gửi từ form liên hệ trên website khách sạn.
            </p>
          </div>
        `,
      };

      // Gửi email
      await transporter.sendMail(mailOptions);

      return {
        EM: 'Gửi email liên hệ thành công',
        EC: 0,
        DT: null,
      };
    } catch (error) {
      console.error('Lỗi khi gửi email:', error);
      return {
        EM: 'Có lỗi xảy ra khi gửi email',
        EC: -1,
        DT: error.message,
      };
    }
  },
};

export default contactService; 