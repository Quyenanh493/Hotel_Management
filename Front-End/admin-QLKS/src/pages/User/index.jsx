import { useState, useEffect } from 'react';
import { Empty, Table, Input, Button, Space, Card, Tag, Modal, Form, DatePicker, message, Descriptions, Upload, Spin, Select, Switch } from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ExclamationCircleOutlined,
  UploadOutlined,
  EyeOutlined,
  UserOutlined,
  LoadingOutlined,
  TeamOutlined,
  KeyOutlined
} from '@ant-design/icons';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, assignRoleToUser, getUserPermissions } from '../../services/userService';
import { getAllRoles } from '../../services/roleService';
import { uploadImage } from '../../services/uploadImageService';
import { getAllHotels } from '../../services/hotelService';
import dayjs from 'dayjs';
import './User.scss';

const { confirm } = Modal;
const { Option } = Select;

function User() {
  const [users, setUsers] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  console.log("currentUser", currentUser);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [isPermissionModalVisible, setIsPermissionModalVisible] = useState(false);
  const [userPermissions, setUserPermissions] = useState([]);
  const [roleForm] = Form.useForm();

  useEffect(() => {
    fetchUsers();
    fetchHotels();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();
      if (response && response.DT) {
        setUsers(response.DT);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const fetchHotels = async () => {
    try {
      const response = await getAllHotels();
      if (response && response.DT) {
        setHotels(response.DT);
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await getAllRoles();
      if (response && response.DT) {
        console.log("Fetched roles:", response.DT);
        setRoles(response.DT);
      } else {
        console.error("Roles data not found in response:", response);
        message.error('Không thể tải danh sách vai trò: Dữ liệu không hợp lệ');
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      message.error('Không thể tải danh sách vai trò');
    }
  };

  const showAddEditModal = (user = null) => {
    setCurrentUser(user);
    setIsModalVisible(true);
    
    if (user) {
      const formData = {
        ...user,
        email: user.Account?.email,
        roleId: user.roleId,
        hotelId: user.hotelId,
        userStatus: user.userStatus,
      };
      form.setFieldsValue(formData);
      
      // Nếu người dùng có hình ảnh, hiển thị nó
      if (user.userImage) {
        setImageUrl(user.userImage);
        setUploadedImageUrl(user.userImage);
      } else {
        setImageUrl('');
        setUploadedImageUrl('');
      }
    } else {
      form.resetFields();
      setImageUrl('');
      setUploadedImageUrl('');
    }
  };

  const showViewModal = async (userId) => {
    try {
      setLoading(true);
      const response = await getUserById(userId);
      if (response && response.DT) {
        setCurrentUser(response.DT);
        setIsViewModalVisible(true);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      message.error('Không thể tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentUser(null);
    form.resetFields();
    setImageUrl('');
    setUploadedImageUrl('');
  };

  const handleViewCancel = () => {
    setIsViewModalVisible(false);
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const formData = {
        ...values,
        userImage: uploadedImageUrl || values.userImage,
      };

      let response;
      if (currentUser) {
        response = await updateUser(currentUser.userId, formData);
        message.success('Cập nhật người dùng thành công');
      } else {
        response = await createUser(formData);
        message.success('Thêm người dùng thành công');
      }

      setIsModalVisible(false);
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      message.error('Lỗi khi lưu thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirm = (userId, userName) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa người dùng này?',
      icon: <ExclamationCircleOutlined />,
      content: `Người dùng: ${userName}`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          setLoading(true);
          await deleteUser(userId);
          message.success('Xóa người dùng thành công');
          fetchUsers();
        } catch (error) {
          console.error('Error deleting user:', error);
          message.error('Không thể xóa người dùng');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredData = users.filter(item => 
    item.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.userName?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.Account?.email?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Các hàm xử lý upload ảnh
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Chỉ chấp nhận file JPG/PNG!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Kích thước ảnh phải nhỏ hơn 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const customUpload = async ({ file, onSuccess, onError }) => {
    setUploadLoading(true);
    try {
      const imageUrl = await uploadImage(file);
      setUploadedImageUrl(imageUrl);
      getBase64(file, (url) => {
        setImageUrl(url);
      });
      onSuccess();
      message.success('Tải ảnh thành công');
    } catch (error) {
      console.error('Lỗi tải lên ảnh:', error);
      onError();
      message.error('Tải ảnh thất bại');
    } finally {
      setUploadLoading(false);
    }
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const uploadButton = (
    <div>
      {uploadLoading ? <LoadingOutlined /> : <UploadOutlined />}
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );

  const showRoleModal = (user) => {
    setCurrentUser(user);
    setIsRoleModalVisible(true);
    roleForm.setFieldsValue({    
      roleId: user.roleId
    });
  };

  const showPermissionsModal = async (userId) => {
    try {
      setLoading(true);
      const response = await getUserPermissions(userId);
      if (response && response.DT) {
        setCurrentUser(response.DT);
        setUserPermissions(response.DT.permissions || []);
        setIsPermissionModalVisible(true);
      }
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      message.error('Không thể tải thông tin quyền của người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleCancel = () => {
    setIsRoleModalVisible(false);
    setCurrentUser(null);
    roleForm.resetFields();
  };

  const handlePermissionCancel = () => {
    setIsPermissionModalVisible(false);
    setUserPermissions([]);
  };

  const handleRoleSubmit = async (values) => {
    try {
      setLoading(true);
      await assignRoleToUser(currentUser.userId, values.roleId);
      message.success('Gán vai trò thành công');
      setIsRoleModalVisible(false);
      fetchUsers();
    } catch (error) {
      console.error('Error assigning role:', error);
      message.error('Lỗi khi gán vai trò cho người dùng');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Tên người dùng',
      dataIndex: 'userName',
      key: 'userName',
      sorter: (a, b) => a.userName?.localeCompare(b.userName),
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a, b) => a.fullName?.localeCompare(b.fullName),
    },
    {
      title: 'Email',
      dataIndex: ['Account', 'email'],
      key: 'email',
    },
    {
      title: 'Khách sạn',
      dataIndex: ['Hotel', 'hotelName'],
      key: 'hotelName',
      render: (text) => text || 'Chưa phân công',
    },
    {
      title: 'Vai trò',
      dataIndex: ['Role', 'roleName'],
      key: 'roleName',
      render: (text) => text || 'Chưa phân quyền',
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record) => (
        <Tag color={record.userStatus ? "success" : "error"}>
          {record.userStatus ? "Hoạt động" : "Bị khóa"}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 250,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EyeOutlined />} 
            size="small" 
            onClick={() => showViewModal(record.userId)}
          />
          <Button 
            type="default" 
            icon={<TeamOutlined />} 
            size="small" 
            onClick={() => showRoleModal(record)}
            title="Phân quyền"
          />
          <Button
            type="default"
            icon={<KeyOutlined />}
            size="small"
            onClick={() => showPermissionsModal(record.userId)}
            title="Xem quyền"
          />
          <Button 
            type="default" 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => showAddEditModal(record)}
          />
          <Button 
            type="primary" 
            danger 
            icon={<DeleteOutlined />} 
            size="small" 
            onClick={() => showDeleteConfirm(record.userId, record.userName)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="users-page">
      <Card 
        title={
          <Space>
            <UserOutlined />
            <span>Quản lý người dùng</span>
          </Space>
        }
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => showAddEditModal()}>
            Thêm mới
          </Button>
        }
      >
        <div className="table-actions">
          <Input
            placeholder="Tìm kiếm theo tên, tên đăng nhập hoặc email"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={handleSearch}
            style={{ width: 400, marginBottom: 16 }}
          />
        </div>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="userId"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} người dùng`,
          }}
        />
      </Card>

      {/* Modal thêm/sửa người dùng */}
      <Modal
        title={currentUser ? 'Cập nhật người dùng' : 'Thêm người dùng mới'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="userName"
            label="Tên đăng nhập"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
          >
            <Input placeholder="Nhập tên đăng nhập" />
          </Form.Item>
          
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
          >
            <Input placeholder="Nhập họ và tên đầy đủ" />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input placeholder="Nhập email" disabled={currentUser} />
          </Form.Item>
          
          {!currentUser && (
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          )}
          
          <Form.Item
            name="hotelId"
            label="Khách sạn"
          >
            <Select placeholder="Chọn khách sạn" className="hotel-select">
              {hotels.map(hotel => (
                <Option key={hotel.hotelId} value={hotel.hotelId}>{hotel.hotelName}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="roleId"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          >
            <Select placeholder="Chọn vai trò" className="role-select">
              {roles && roles.length > 0 ? (
                roles.map(role => (
                  <Option key={role.roleId} value={role.roleId}>{role.roleName}</Option>
                ))
              ) : (
                <Option disabled value="">Không có vai trò nào, vui lòng tạo vai trò trước</Option>
              )}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="userImage"
            label="Hình ảnh"
            getValueFromEvent={() => uploadedImageUrl}
          >
            <Upload
              name="userImage"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              customRequest={customUpload}
              beforeUpload={beforeUpload}
            >
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt="user" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : uploadButton}
            </Upload>
          </Form.Item>

          <Form.Item className="form-actions">
            <Button type="default" onClick={handleCancel} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {currentUser ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem chi tiết */}
      <Modal
        title="Chi tiết người dùng"
        open={isViewModalVisible}
        onCancel={handleViewCancel}
        footer={[
          <Button key="back" onClick={handleViewCancel}>
            Đóng
          </Button>,
          <Button 
            key="edit" 
            type="primary" 
            onClick={() => {
              setIsViewModalVisible(false);
              showAddEditModal(currentUser);
            }}
          >
            Chỉnh sửa
          </Button>,
        ]}
        width={700}
      >
        {currentUser && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Tên đăng nhập">{currentUser.userName}</Descriptions.Item>
            <Descriptions.Item label="Họ và tên">{currentUser.fullName}</Descriptions.Item>
            <Descriptions.Item label="Email">{currentUser.Account?.email}</Descriptions.Item>
            <Descriptions.Item label="Khách sạn">{currentUser.Hotel?.hotelName || 'Chưa phân công'}</Descriptions.Item>
            <Descriptions.Item label="Vai trò">{currentUser.Role?.roleName || 'Chưa phân quyền'}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <div className="user-detail-status">
                <Tag color={currentUser.userStatus ? "success" : "error"}>
                  {currentUser.userStatus ? "Hoạt động" : "Bị khóa"}
                </Tag>
              </div>
            </Descriptions.Item>
            {currentUser.userImage && (
              <Descriptions.Item label="Hình ảnh">
                <img 
                  src={currentUser.userImage} 
                  alt={currentUser.userName} 
                  className="user-detail-image"
                />
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* Modal gán vai trò */}
      <Modal
        title={`Phân quyền cho người dùng: ${currentUser?.userName}`}
        open={isRoleModalVisible}
        onCancel={handleRoleCancel}
        footer={null}
        width={500}
      >
        <Form
          form={roleForm}
          layout="vertical"
          onFinish={handleRoleSubmit}
        >
          <Form.Item
            name="roleId"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          >
            <Select placeholder="Chọn vai trò">
              {roles && roles.length > 0 ? (
                roles.map(role => (
                  <Select.Option key={role.roleId} value={role.roleId}>
                    {role.roleName}
                  </Select.Option>
                ))
              ) : (
                <Select.Option disabled value="">
                  Không có vai trò nào, vui lòng tạo vai trò trước
                </Select.Option>
              )}
            </Select>
          </Form.Item>

          <Form.Item className="form-actions">
            <Space>
              <Button onClick={handleRoleCancel}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Lưu thay đổi
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem quyền */}
      <Modal
        open={isPermissionModalVisible}
        onCancel={handlePermissionCancel}
        footer={[
          <Button key="back" onClick={handlePermissionCancel}>
            Đóng
          </Button>
        ]}
        width={700}
      >
        <div style={{ marginBottom: 16 }}>
          <strong>Vai trò:</strong> {currentUser?.role?.roleName || 'Chưa phân quyền'}
        </div>
        
        {userPermissions.length > 0 ? (
          <div>
            <div style={{ marginBottom: 8 }}><strong>Danh sách quyền:</strong></div>
            {userPermissions.map(permission => (
              <Tag 
                color="blue" 
                key={permission.permissionId}
                style={{ margin: '0 8px 8px 0' }}
              >
                {permission.permissionName}
              </Tag>
            ))}
          </div>
        ) : (
          <Empty description="Người dùng không có quyền nào" />
        )}
      </Modal>
    </div>
  );
}

export default User;
