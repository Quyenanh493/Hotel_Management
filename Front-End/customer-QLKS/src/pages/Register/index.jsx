import { useState } from 'react';
import { Form, Input, Button, DatePicker, Modal, notification, Row, Col, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { registerCustomer } from '../../services/logRegCusService';
import { uploadImage } from '../../services/uploadImageService';
import './Register.scss';

const { Password } = Input;

function Register({ visible, onCancel, onRegisterSuccess }) {
  const [form] = Form.useForm();
  const [notiApi, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState(''); // Lưu URL ảnh từ API
  const [uploadLoading, setUploadLoading] = useState(false); // Trạng thái đang tải ảnh

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { confirmPassword, ...submitValues } = values;
      
      // Format ngày sinh đúng định dạng
      if (submitValues.birthday?.format) {
        submitValues.birthday = submitValues.birthday.format('YYYY/MM/DD');
      }
      
      // Sử dụng URL ảnh đã tải lên thay vì file ảnh
      if (uploadedImageUrl) {
        submitValues.image = uploadedImageUrl;
      } else {
        delete submitValues.image; 
      }
      
      console.log('submitValues với URL ảnh:', submitValues);
      
      // Gửi dữ liệu đăng ký với URL ảnh
      const response = await registerCustomer(submitValues);
      
      console.log('Register response:', response);
      
      // Kiểm tra cấu trúc dữ liệu mới - Sửa điều kiện kiểm tra
      if (response && response.EC === 0) {
        // Nếu có dữ liệu token trong response
        // if (response.DT && response.DT.accessToken) {
        //   // Lưu token vào cookie
        //   setCookie("accessToken", response.DT.accessToken, 1);
        //   setCookie("refreshToken", response.DT.refreshToken, 1);
        //   setCookie("role", response.DT.accountType, 1);
          
        //   // Lưu thông tin người dùng vào localStorage
        //   const userData = response.DT.userData || {};
        //   localStorage.setItem('user', JSON.stringify(userData));
          
        //   // Gọi callback để cập nhật trạng thái đăng nhập
        //   if (onRegisterSuccess) onRegisterSuccess(userData);
        // }
        
        // Đóng modal đăng ký
        if (onCancel) onCancel();
        
        // Hiển thị thông báo thành công
        notiApi.success({
          message: 'Đăng ký thành công',
          description: response.EM || 'Tài khoản của bạn đã được tạo thành công.',
        });
        
        // Reset form và state
        form.resetFields();
        setImageUrl('');
        setUploadedImageUrl('');
      } else {
        // Hiển thị thông báo lỗi từ API
        notiApi.error({
          message: 'Đăng ký thất bại',
          description: response?.EM || 'Có lỗi xảy ra khi đăng ký.',
        });
      }
    } catch (error) {
      console.error('Register error:', error);
      notiApi.error({
        message: 'Đăng ký thất bại',
        description: error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký.',
      });
    } finally {
      setLoading(false);
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      notification.error({
        message: 'Chỉ chấp nhận file JPG/PNG!',
      });
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      notification.error({
        message: 'Kích thước ảnh phải nhỏ hơn 2MB!',
      });
    }
    return isJpgOrPng && isLt2M;
  };

  // Hàm xử lý tùy chỉnh cho việc tải lên ảnh
  const customUpload = async ({ file, onSuccess, onError }) => {
    setUploadLoading(true);
    try {
      const imageUrl = await uploadImage(file);
      setUploadedImageUrl(imageUrl);
      getBase64(file, (url) => {
        setImageUrl(url);
      });
      onSuccess();
      
      notiApi.success({
        message: 'Tải ảnh thành công',
        description: 'Ảnh đã được tải lên thành công.',
      });
    } catch (error) {
      console.error('Lỗi tải lên ảnh:', error);
      onError();
      
      notiApi.error({
        message: 'Tải ảnh thất bại',
        description: 'Có lỗi xảy ra khi tải ảnh lên.',
      });
    } finally {
      setUploadLoading(false);
    }
  };

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      // Xử lý xem trước ảnh đã được thực hiện trong hàm customUpload
    }
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  
  return (
    <Modal
      title={<h2 className="register-title">ĐĂNG KÝ</h2>}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      centered
      className="register-modal"
      closeIcon={<span className="close-icon">×</span>}
    >
      {contextHolder}
      <Form
        form={form}
        name="register"
        layout="vertical"
        onFinish={onFinish}
        scrollToFirstError
        className="register-form"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Họ và Tên"
              rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
            >
              <Input placeholder="Nhập họ và tên" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Số Điện Thoại"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 chữ số!' }
              ]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="idNumber"
              label="CMND/CCCD/ID Number"
              rules={[
                { required: true, message: 'Vui lòng nhập CMND/CCCD/ID Number!' },
                { pattern: /^[0-9]{9,12}$/, message: 'CMND/CCCD/ID Number phải có 9-12 chữ số!' }
              ]}
            >
              <Input placeholder="Nhập CMND/CCCD/ID Number" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
        >
          <Input.TextArea rows={3} placeholder="Nhập địa chỉ" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="birthday"
              label="Ngày Sinh"
              rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
            >
              <DatePicker 
                format="DD/MM/YYYY" 
                placeholder="dd/mm/yyyy" 
                style={{ width: '100%' }} 
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="image"
              label="Ảnh"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[{ required: true, message: 'Vui lòng tải lên ảnh!' }]}
            >
              <Upload
                name="image" 
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                customRequest={customUpload}
                maxCount={1}
              >
                {imageUrl ? (
                  <div className="upload-preview-container">
                    <img src={imageUrl} alt="avatar" />
                  </div>
                ) : (
                  <div className="upload-placeholder-container">
                    {uploadLoading ? (
                      <div className="upload-loading">
                        <div className="text">Đang tải...</div>
                      </div>
                    ) : (
                      <>
                        <UploadOutlined />
                        <div className="text">Chọn tệp</div>
                      </>
                    )}
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="password"
              label="Mật Khẩu"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
              ]}
              hasFeedback
            >
              <Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="confirmPassword"
              label="Nhập lại Mật Khẩu"
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                  },
                }),
              ]}
            >
              <Password placeholder="Nhập lại mật khẩu" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item className="register-button-container">
          <Button 
            type="primary" 
            htmlType="submit" 
            className="register-button"
            loading={loading}
          >
            ĐĂNG KÝ
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default Register;