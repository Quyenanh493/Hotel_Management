import { Modal, Form, Input, Button, notification } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useState } from 'react';
import './Login.scss';
import { useNavigate } from 'react-router-dom';
import { loginCustomer, forgotPassword } from '../../services/logRegCusService';
import { setCookie } from "../../helper/cookie";
import ResetPasswordModal from '../../components/ResetPasswordModal';

function Login({ visible, onCancel, onLoginSuccess, onShowRegister }) {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [notiApi, contextHolder] = notification.useNotification();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordForm] = Form.useForm();
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [resetPasswordToken, setResetPasswordToken] = useState(null);
  const [resetPasswordEmail, setResetPasswordEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const loginData = {
        valueLogin: values.email, // hoặc số điện thoại
        password: values.password
      };
      const response = await loginCustomer(loginData);
      console.log('Login response:', response);
      
      // Kiểm tra cấu trúc dữ liệu mới
      if (response && response.EC === 0 && response.DT) {
        // Lưu token vào cookie
        setCookie("accessToken", response.DT.accessToken, 1);
        setCookie("refreshToken", response.DT.refreshToken, 1);
        setCookie("role", response.DT.accountType, 1);
        
        // Lưu thông tin người dùng vào localStorage
        const userData = response.DT.userData || {};
        localStorage.setItem('user', JSON.stringify(userData));
        
        notiApi.success({
          message: 'Đăng nhập thành công',
          description: response.EM || 'Chào mừng bạn đã quay trở lại!',
          duration: 3,
        });
        
        form.resetFields();
        
        // Gọi callback để cập nhật trạng thái đăng nhập trong LayoutDefault
        onLoginSuccess(userData);
        
        // Đóng modal đăng nhập
        if (onCancel) onCancel();
      } else {
        // Kiểm tra mã lỗi để xử lý thông báo phù hợp
        const errorMessage = response?.EM || 'Thông tin đăng nhập không chính xác. Vui lòng kiểm tra lại email/mật khẩu!';
        const errorTitle = response?.EC === 2 ? 'Tài khoản bị khóa' : 'Đăng nhập thất bại';
        
        // Hiển thị thông báo lỗi từ API bằng notification thay vì message
        notiApi.error({
          message: errorTitle,
          description: errorMessage,
          duration: response?.EC === 2 ? 8 : 5, // Hiển thị lâu hơn cho trường hợp tài khoản bị khóa
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      notiApi.error({
        message: 'Lỗi đăng nhập',
        description: 'Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau!',
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (values) => {
    setForgotPasswordLoading(true);
    try {
      const response = await forgotPassword(values.email);
      
      if (response && response.EC === 0) {
        setResetPasswordEmail(values.email);
        forgotPasswordForm.resetFields();
        setShowForgotPassword(false);
        setVerificationCode('');
        
        notiApi.success({
          message: 'Mã xác minh đã được gửi',
          description: 'Vui lòng kiểm tra email của bạn để lấy mã xác minh.',
          duration: 5,
        });
        setShowResetPasswordModal(true);
      } else {
        notiApi.error({
          message: 'Không thể gửi yêu cầu',
          description: response?.EM || 'Không thể gửi yêu cầu đặt lại mật khẩu. Vui lòng kiểm tra email và thử lại sau.',
          duration: 5,
        });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      notiApi.error({
        message: 'Lỗi hệ thống',
        description: 'Có lỗi xảy ra khi xử lý yêu cầu. Vui lòng thử lại sau!',
        duration: 5,
      });
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleResetPasswordModalCancel = (success) => {
    setShowResetPasswordModal(false);
    setResetPasswordToken(null);
    if (success) {
      notiApi.success({
        message: 'Đặt lại mật khẩu thành công',
        description: 'Bạn có thể đăng nhập với mật khẩu mới.',
        duration: 4,
      });
    }
  };

  const toggleForgotPassword = () => {
    setShowForgotPassword(!showForgotPassword);
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={showForgotPassword ? "Quên Mật Khẩu" : "Đăng Nhập"}
        open={visible}
        onCancel={onCancel}
        footer={null}
        destroyOnClose
      >
        {!showForgotPassword ? (
          <Form
            form={form}
            name="login_form"
            className="login-form"
            onFinish={handleSubmit}
            layout="vertical"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
            </Form.Item>

            <Form.Item className="login-form-links">
              <Button type="link" onClick={toggleForgotPassword} className="forgot-password-link">
                Quên mật khẩu?
              </Button>
            </Form.Item>

            <Form.Item className="login-form-button">
              <Button type="primary" htmlType="submit" loading={loading} block>
                Đăng Nhập
              </Button>
            </Form.Item>

            <div className="login-form-footer">
              <span>Chưa có tài khoản? </span>
              <Button type="link" onClick={() => {
                if (onShowRegister) {
                  onShowRegister();
                } else {
                  onCancel();
                }
              }}>
                Đăng ký ngay
              </Button>
            </div>
          </Form>
        ) : (
          <Form
            form={forgotPasswordForm}
            name="forgot_password_form"
            className="forgot-password-form"
            onFinish={handleForgotPassword}
            layout="vertical"
          >
            <p className="forgot-password-description">
              Vui lòng nhập địa chỉ email đã đăng ký. Chúng tôi sẽ gửi mã xác minh qua email của bạn.
            </p>
            
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email đã đăng ký" />
            </Form.Item>

            <Form.Item className="forgot-password-buttons">
              <Button 
                type="default" 
                onClick={toggleForgotPassword} 
                style={{ marginRight: 8 }}
              >
                Quay lại đăng nhập
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={forgotPasswordLoading}
              >
                Gửi yêu cầu
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>

      <ResetPasswordModal 
        visible={showResetPasswordModal}
        onCancel={handleResetPasswordModalCancel}
        email={resetPasswordEmail}
      />
    </>
  );
}

export default Login;