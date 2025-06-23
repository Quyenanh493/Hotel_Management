import { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login, hasAdminAccess } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import './Login.scss';

const { Title, Text } = Typography;

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onFinish = async (values) => {
    setLoading(true);
    setError('');
    
    try {
      // Gọi API đăng nhập
      const response = await login({
        valueLogin: values.username, // Email hoặc số điện thoại
        password: values.password
      });
      
      if (response.EC === 0) {
        // Kiểm tra quyền truy cập
        if (hasAdminAccess(response.DT)) {
          // Đăng nhập thành công và có quyền admin/staff -> chuyển đến trang dashboard
          navigate('/');
        } else {
          // Nếu là tài khoản customer -> hiển thị thông báo lỗi
          setError('Bạn không có quyền truy cập vào hệ thống quản trị.');
        }
      } else {
        // Hiển thị thông báo lỗi từ API
        setError(response.EM || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <Card className="login-card">
          <div className="login-header">
            <Title level={2} className="login-title">Đăng Nhập Quản Trị</Title>
            <Text type="secondary">Nhập thông tin đăng nhập để tiếp tục</Text>
          </div>
          
          {error && (
            <Alert
              message="Lỗi đăng nhập"
              description={error}
              type="error"
              showIcon
              className="login-alert"
            />
          )}
          
          <Form
            name="login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Vui lòng nhập email hoặc số điện thoại!' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Email hoặc Số điện thoại" 
                size="large"
              />
            </Form.Item>
            
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Mật khẩu"
                size="large"
              />
            </Form.Item>
            
            <Form.Item className="login-button-container">
              <Button
                type="primary"
                htmlType="submit"
                className="login-button"
                loading={loading}
                size="large"
                block
              >
                Đăng Nhập
              </Button>
            </Form.Item>
            
            <div className="login-footer">
              <Text type="secondary">
                * Chỉ tài khoản Admin và Staff mới có quyền truy cập
              </Text>
            </div>
          </Form>
        </Card>
      </div>
      
      {loading && (
        <div className="login-loading">
          <Spin size="large" />
        </div>
      )}
    </div>
  );
}

export default Login;
