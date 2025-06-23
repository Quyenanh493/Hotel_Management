import { Modal, Form, Input, Button, Steps, Alert, notification } from 'antd';
import { useState, useEffect } from 'react';
import { MailOutlined, KeyOutlined, LockOutlined } from '@ant-design/icons';
import { forgotPassword, verifyResetCode, resetPassword } from '../../services/logRegCusService';
import './ResetPasswordModal.scss';

const { Step } = Steps;

/**
 * Modal đặt lại mật khẩu
 * 
 * @param {Object} props
 * @param {boolean} props.visible Trạng thái hiển thị của modal
 * @param {Function} props.onCancel Hàm xử lý khi đóng modal
 * @param {Function} props.onSuccess Hàm xử lý khi đặt lại mật khẩu thành công
 * @param {string} props.email Email đã nhập từ form đăng nhập (nếu có)
 */
function ResetPasswordModal({ visible, onCancel, onSuccess, email: initialEmail }) {
  const [emailForm] = Form.useForm();
  const [verifyForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [notiApi, contextHolder] = notification.useNotification();

  // Thiết lập giá trị ban đầu khi component được mở
  useEffect(() => {
    if (visible) {
      // Nếu đã có email từ props, điền email vào form và chuyển sang bước tiếp theo
      if (initialEmail) {
        setEmail(initialEmail);
        emailForm.setFieldsValue({ email: initialEmail });
        
        // Nếu đã có email, chuyển thẳng sang bước xác nhận mã
        setCurrentStep(1);
      }
    }
  }, [visible, initialEmail, emailForm]);

  // Xử lý nút "Tiếp tục" ở step 1 (nhập email)
  const handleEmailSubmit = async (values) => {
    setLoading(true);
    setErrorMessage('');
    
    try {
      const response = await forgotPassword(values.email);
      
      if (response && response.EC === 0) {
        setEmail(values.email);
        setCurrentStep(1);
        
        notiApi.success({
          message: 'Thành công',
          description: 'Mã xác nhận đã được gửi đến email của bạn.',
        });
      } else {
        setErrorMessage(response?.EM || 'Có lỗi xảy ra khi gửi yêu cầu');
      }
    } catch (error) {
      setErrorMessage('Có lỗi xảy ra khi gửi yêu cầu đặt lại mật khẩu');
      console.error('Lỗi gửi yêu cầu đặt lại mật khẩu:', error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý nút "Xác nhận" ở step 2 (nhập mã xác nhận)
  const handleVerifySubmit = async (values) => {
    setLoading(true);
    setErrorMessage('');
    
    try {
      const response = await verifyResetCode(email, values.verificationCode);
      
      if (response && response.EC === 0) {
        setResetToken(response.DT.token);
        setCurrentStep(2);
      } else {
        setErrorMessage(response?.EM || 'Mã xác nhận không hợp lệ');
      }
    } catch (error) {
      setErrorMessage('Có lỗi xảy ra khi xác minh mã');
      console.error('Lỗi xác nhận mã:', error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý nút "Đặt lại mật khẩu" ở step 3 (nhập mật khẩu mới)
  const handlePasswordSubmit = async (values) => {
    setLoading(true);
    setErrorMessage('');
    
    try {
      const response = await resetPassword(email, resetToken, values.newPassword);
      
      if (response && response.EC === 0) {
        notiApi.success({
          message: 'Thành công',
          description: 'Mật khẩu đã được đặt lại thành công.',
        });
        
        // Đặt lại trạng thái
        setCurrentStep(0);
        setEmail('');
        setResetToken('');
        emailForm.resetFields();
        verifyForm.resetFields();
        passwordForm.resetFields();
        
        // Gọi callback onSuccess
        if (onSuccess) {
          onSuccess(true);
        }
        
        // Đóng modal
        if (onCancel) {
          onCancel(true);
        }
      } else {
        setErrorMessage(response?.EM || 'Có lỗi xảy ra khi đặt lại mật khẩu');
      }
    } catch (error) {
      setErrorMessage('Có lỗi xảy ra khi đặt lại mật khẩu');
      console.error('Lỗi đặt lại mật khẩu:', error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý đóng modal
  const handleCancel = () => {
    // Đặt lại trạng thái
    setCurrentStep(0);
    setEmail('');
    setResetToken('');
    setErrorMessage('');
    emailForm.resetFields();
    verifyForm.resetFields();
    passwordForm.resetFields();
    
    if (onCancel) {
      onCancel(false);
    }
  };

  // Xử lý nút quay lại
  const handleBack = () => {
    // Nếu đang ở bước 1 và có initialEmail, đóng modal thay vì quay lại
    if (currentStep === 1 && initialEmail) {
      handleCancel();
    } else {
      setCurrentStep(currentStep - 1);
      setErrorMessage('');
    }
  };

  return (
    <Modal
      title="Đặt lại mật khẩu"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={500}
      className="reset-password-modal"
    >
      {contextHolder}
      
      <Steps current={currentStep} className="reset-steps">
        <Step title="Email" />
        <Step title="Xác nhận" />
        <Step title="Mật khẩu mới" />
      </Steps>
      
      {errorMessage && (
        <Alert
          message={errorMessage}
          type="error"
          showIcon
          className="error-alert"
        />
      )}
      
      {currentStep === 0 && (
        <Form
          form={emailForm}
          layout="vertical"
          onFinish={handleEmailSubmit}
          className="reset-form"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Nhập email của bạn"
              disabled={loading}
            />
          </Form.Item>
          
          <Form.Item className="form-actions">
            <Button onClick={handleCancel}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Tiếp tục
            </Button>
          </Form.Item>
        </Form>
      )}
      
      {currentStep === 1 && (
        <Form
          form={verifyForm}
          layout="vertical"
          onFinish={handleVerifySubmit}
          className="reset-form"
        >
          <div className="email-info">
            Chúng tôi đã gửi mã xác nhận đến email: <strong>{email}</strong>
          </div>
          
          <Form.Item
            name="verificationCode"
            label="Mã xác nhận"
            rules={[
              { required: true, message: 'Vui lòng nhập mã xác nhận' },
              { min: 6, max: 6, message: 'Mã xác nhận phải có 6 chữ số' }
            ]}
          >
            <Input
              prefix={<KeyOutlined />}
              placeholder="Nhập mã xác nhận 6 chữ số"
              disabled={loading}
              maxLength={6}
            />
          </Form.Item>
          
          <Form.Item className="form-actions">
            <Button onClick={handleBack} disabled={loading}>
              Quay lại
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      )}
      
      {currentStep === 2 && (
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordSubmit}
          className="reset-form"
        >
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu mới"
              disabled={loading}
            />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu mới"
              disabled={loading}
            />
          </Form.Item>
          
          <Form.Item className="form-actions">
            <Button onClick={handleBack} disabled={loading}>
              Quay lại
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Đặt lại mật khẩu
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}

export default ResetPasswordModal; 