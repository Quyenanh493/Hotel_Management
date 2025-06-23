import { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, Avatar, Upload, Card, Row, Col, Typography, Spin, notification, Tabs, Modal } from 'antd';
import { UserOutlined, UploadOutlined, CheckCircleOutlined, CloseCircleOutlined, LockOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { updateCustomerProfile, uploadCustomerImage } from '../../services/customerService';
import { changePassword } from '../../services/logRegCusService';
import './Profile.scss';

const { Title } = Typography;
const { TabPane } = Tabs;

function Profile() {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [notiApi, contextHolder] = notification.useNotification();

  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserData(user);

    // Điền thông tin vào form
    if (user) {
      form.setFieldsValue({
        customerName: user.customerName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        idNumber: user.idNumber,
        birthday: user.birthday ? dayjs(user.birthday) : null,
      });

      // Nếu có ảnh đại diện
      if (user.customerImage) {
        setImageUrl(user.customerImage);
      }
    }
  }, [form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Lấy ID của khách hàng từ dữ liệu người dùng
      const customerId = userData.id || userData.customerId;

      if (!customerId) {
        notiApi.error({
          message: 'Lỗi',
          description: 'Không tìm thấy ID khách hàng!',
          icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
        });
        setLoading(false);
        return;
      }

      // Format ngày sinh nếu có
      if (values.birthday?.format) {
        values.birthday = values.birthday.format('YYYY-MM-DD');
      }

      // Tạo đối tượng chỉ chứa các trường đã thay đổi
      const changedValues = {};
      const currentValues = form.getFieldsValue();

      // So sánh với dữ liệu ban đầu và chỉ lấy các trường đã thay đổi
      Object.keys(currentValues).forEach(key => {
        // Bỏ qua trường email vì nó bị disabled
        // if (key === 'email') return;

        // Xử lý riêng cho trường ngày tháng
        if (key === 'birthday') {
          const formattedBirthday = currentValues[key]?.format('YYYY-MM-DD');
          const originalBirthday = userData.birthday ? dayjs(userData.birthday).format('YYYY-MM-DD') : null;

          if (formattedBirthday !== originalBirthday) {
            changedValues[key] = formattedBirthday;
          }
        }
        // Xử lý các trường thông thường
        else if (currentValues[key] !== userData[key]) {
          changedValues[key] = currentValues[key];
        }
      });

      // Nếu không có trường nào thay đổi
      if (Object.keys(changedValues).length === 0) {
        notiApi.info({
          message: 'Thông báo',
          description: 'Không có thông tin nào được thay đổi!',
        });
        setLoading(false);
        return;
      }

      console.log('Sending update request for customerId:', customerId);
      console.log('Changed data:', changedValues);

      // Gọi API cập nhật thông tin với ID khách hàng và chỉ gửi các trường đã thay đổi
      const response = await updateCustomerProfile(customerId, changedValues);
      console.log('Response:', response);

      if (response && response.EC === 0) {
        notiApi.success({
          message: 'Thành công',
          description: 'Cập nhật thông tin thành công!',
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        });

        // Cập nhật thông tin trong localStorage
        const updatedUser = { ...userData, ...changedValues };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUserData(updatedUser);
      } else {
        notiApi.error({
          message: 'Lỗi',
          description: response?.EM || 'Cập nhật thông tin thất bại!',
          icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
        });
      }
    } catch (error) {
      console.error('Lỗi cập nhật thông tin:', error);
      notiApi.error({
        message: 'Lỗi',
        description: 'Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại sau!',
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) {
      notiApi.warning({
        message: 'Cảnh báo',
        description: 'Vui lòng chọn ảnh trước khi tải lên!',
      });
      return;
    }

    setImageLoading(true);
    try {
      const customerId = userData.id || userData.customerId;
      
      if (!customerId) {
        notiApi.error({
          message: 'Lỗi',
          description: 'Không tìm thấy ID khách hàng!',
          icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
        });
        setImageLoading(false);
        return;
      }

      const response = await uploadCustomerImage(customerId, selectedFile);

      if (response && response.EC === 0) {
        notiApi.success({
          message: 'Thành công',
          description: 'Cập nhật ảnh đại diện thành công!',
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        });

        // Cập nhật thông tin trong localStorage với URL ảnh mới
        const updatedUser = { ...userData, customerImage: response.DT.imageUrl };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUserData(updatedUser);
        setImageUrl(response.DT.imageUrl);
      } else {
        notiApi.error({
          message: 'Lỗi',
          description: response?.EM || 'Cập nhật ảnh đại diện thất bại!',
          icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
        });
      }
    } catch (error) {
      console.error('Lỗi cập nhật ảnh đại diện:', error);
      notiApi.error({
        message: 'Lỗi',
        description: 'Có lỗi xảy ra khi cập nhật ảnh đại diện. Vui lòng thử lại sau!',
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      });
    } finally {
      setImageLoading(false);
    }
  };

  const showPasswordModal = () => {
    setIsModalVisible(true);
    passwordForm.resetFields();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handlePasswordChange = async (values) => {
    setPasswordLoading(true);
    try {
      const accountId = userData.customerId;

      if (!accountId) {
        notiApi.error({
          message: 'Lỗi',
          description: 'Không tìm thấy ID tài khoản!',
          icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
        });
        setPasswordLoading(false);
        return;
      }

      const response = await changePassword(
        accountId,
        values.currentPassword,
        values.newPassword
      );

      if (response && response.EC === 0) {
        notiApi.success({
          message: 'Thành công',
          description: 'Đổi mật khẩu thành công!',
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        });
        setIsModalVisible(false);
      } else {
        notiApi.error({
          message: 'Lỗi',
          description: response?.EM || 'Đổi mật khẩu thất bại!',
          icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
        });
      }
    } catch (error) {
      console.error('Lỗi đổi mật khẩu:', error);
      notiApi.error({
        message: 'Lỗi',
        description: 'Có lỗi xảy ra khi đổi mật khẩu. Vui lòng thử lại sau!',
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const uploadButton = (
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );

  if (!userData) {
    return <Spin size="large" tip="Đang tải..." />;
  }

  return (
    <>
      {contextHolder}
      <div className="profile-container">
        <Card className="profile-card">
          <Title level={2} className="profile-title">
            Thông Tin Cá Nhân
          </Title>

          <Tabs defaultActiveKey="profile">
            <TabPane tab="Thông Tin Cá Nhân" key="profile">
              <Row gutter={[24, 24]}>
                <Col xs={24} md={8}>
                  <div className="avatar-section">
                    <Avatar
                      size={120}
                      icon={<UserOutlined />}
                      src={imageUrl}
                      className="profile-avatar"
                    />

                    <Upload
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      beforeUpload={(file) => {
                        // Kiểm tra loại file
                        const isImage = file.type.startsWith('image/');
                        if (!isImage) {
                          notiApi.error({ message: 'Bạn chỉ có thể tải lên file hình ảnh!' });
                          return Upload.LIST_IGNORE;
                        }
                        
                        // Giới hạn kích thước file (5MB)
                        const isLt5M = file.size / 1024 / 1024 < 5;
                        if (!isLt5M) {
                          notiApi.error({ message: 'Hình ảnh phải nhỏ hơn 5MB!' });
                          return Upload.LIST_IGNORE;
                        }
                        
                        // Lưu file để upload sau
                        setSelectedFile(file);
                        
                        // Hiển thị preview
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          setImageUrl(e.target.result);
                        };
                        reader.readAsDataURL(file);
                        
                        // Trả về false để không tự động upload
                        return false;
                      }}
                    >
                      {uploadButton}
                    </Upload>
                    
                    <Button 
                      type="primary" 
                      onClick={handleImageUpload}
                      loading={imageLoading}
                      style={{ marginTop: 10 }}
                      disabled={!selectedFile}
                    >
                      Lưu Ảnh Đại Diện
                    </Button>
                    
                    <div className="avatar-hint">
                      <Typography.Text type="secondary">
                        Nhấn vào nút trên để chọn ảnh, sau đó nhấn Lưu Ảnh Đại Diện
                      </Typography.Text>
                    </div>
                  </div>
                </Col>

                <Col xs={24} md={16}>
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="profile-form"
                  >
                    <Row gutter={16}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name="customerName"
                          label="Họ và tên"
                          rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}>
                          <Input placeholder="Nhập họ và tên" />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={12}>
                        <Form.Item
                          name="email"
                          label="Email"
                          rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' }
                          ]}>
                          <Input placeholder="Nhập email" />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={12}>
                        <Form.Item
                          name="phoneNumber"
                          label="Số điện thoại"
                          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
                          <Input placeholder="Nhập số điện thoại" />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={12}>
                        <Form.Item
                          name="idNumber"
                          label="Số CMND/CCCD"
                          rules={[{ required: true, message: 'Vui lòng nhập số CMND/CCCD!' }]}>
                          <Input placeholder="Nhập số CMND/CCCD" />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={12}>
                        <Form.Item
                          name="birthday"
                          label="Ngày sinh"
                          rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}>
                          <DatePicker
                            style={{ width: '100%' }}
                            format="DD/MM/YYYY"
                            placeholder="Chọn ngày sinh" />
                        </Form.Item>
                      </Col>

                      <Col xs={24}>
                        <Form.Item
                          name="address"
                          label="Địa chỉ"
                          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
                          <Input.TextArea rows={3} placeholder="Nhập địa chỉ" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="update-button">
                        Cập Nhật Thông Tin
                      </Button>
                      <Button
                        type="default"
                        onClick={showPasswordModal}
                        className="change-password-button"
                        style={{ marginLeft: 10 }}
                      >
                        Đổi Mật Khẩu
                      </Button>
                    </Form.Item>
                  </Form>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Card>

        {/* Modal Đổi Mật Khẩu */}
        <Modal
          title="Đổi Mật Khẩu"
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handlePasswordChange}
          >
            <Form.Item
              name="currentPassword"
              label="Mật khẩu hiện tại"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu hiện tại" 
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="Mật khẩu mới"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu mới" 
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu mới"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Hai mật khẩu đã nhập không khớp!'));
                  },
                }),
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />}
                placeholder="Xác nhận mật khẩu mới" 
              />
            </Form.Item>

            <Form.Item>
              <div style={{ textAlign: 'right' }}>
                <Button 
                  type="default" 
                  onClick={handleCancel} 
                  style={{ marginRight: 8 }}
                >
                  Hủy
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={passwordLoading}
                >
                  Đổi Mật Khẩu
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
}

export default Profile;
