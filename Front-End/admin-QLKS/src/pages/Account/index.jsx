import { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Card, Tag, Modal, Form, Select, Switch, message, Descriptions } from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ExclamationCircleOutlined,
  EyeOutlined,
  UserOutlined,
  LockOutlined
} from '@ant-design/icons';
import { getAllAccounts, getAccountById, createAccount, updateAccount, deleteAccount } from '../../services/accountService';
import dayjs from 'dayjs';
import './Account.scss';

const { confirm } = Modal;
const { Option } = Select;

function Account() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await getAllAccounts();
      if (response && response.DT) {
        setAccounts(response.DT);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
      message.error('Không thể tải danh sách tài khoản');
    } finally {
      setLoading(false);
    }
  };

  const showAddEditModal = (account = null) => {
    setCurrentAccount(account);
    setIsModalVisible(true);
    
    if (account) {
      form.setFieldsValue({
        email: account.email,
        accountType: account.accountType,
        accountStatus: account.accountStatus,
      });
    } else {
      form.resetFields();
    }
  };

  const showViewModal = async (accountId) => {
    try {
      setLoading(true);
      const response = await getAccountById(accountId);
      if (response && response.DT) {
        setCurrentAccount(response.DT);
        setIsViewModalVisible(true);
      }
    } catch (error) {
      console.error('Error fetching account details:', error);
      message.error('Không thể tải thông tin chi tiết tài khoản');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentAccount(null);
    form.resetFields();
  };

  const handleViewCancel = () => {
    setIsViewModalVisible(false);
    setCurrentAccount(null);
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      // Nếu đang tạo tài khoản mới, bắt buộc phải có mật khẩu
      if (!currentAccount && !values.password) {
        message.error('Vui lòng nhập mật khẩu cho tài khoản mới');
        setLoading(false);
        return;
      }
      
      const accountData = {
        ...values,
      };

      let response;
      if (currentAccount) {
        response = await updateAccount(currentAccount.accountId, accountData);
        message.success('Cập nhật tài khoản thành công');
      } else {
        response = await createAccount(accountData);
        message.success('Thêm tài khoản mới thành công');
      }

      setIsModalVisible(false);
      fetchAccounts();
    } catch (error) {
      console.error('Error saving account:', error);
      message.error('Lỗi khi lưu thông tin tài khoản');
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirm = (accountId, email) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa tài khoản này?',
      icon: <ExclamationCircleOutlined />,
      content: `Tài khoản: ${email}`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          setLoading(true);
          await deleteAccount(accountId);
          message.success('Xóa tài khoản thành công');
          fetchAccounts();
        } catch (error) {
          console.error('Error deleting account:', error);
          message.error('Không thể xóa tài khoản');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredData = accounts.filter(item => 
    item.email?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.accountType?.toLowerCase().includes(searchText.toLowerCase())
  );

  const getAccountTypeTag = (type) => {
    switch (type?.toLowerCase()) {
      case 'admin':
        return <Tag color="purple">Admin</Tag>;
      case 'staff':
        return <Tag color="blue">Nhân viên</Tag>;
      case 'customer':
        return <Tag color="green">Khách hàng</Tag>;
      default:
        return <Tag>Không xác định</Tag>;
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
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email?.localeCompare(b.email),
    },
    {
      title: 'Loại tài khoản',
      dataIndex: 'accountType',
      key: 'accountType',
      render: (type) => getAccountTypeTag(type),
      sorter: (a, b) => a.accountType?.localeCompare(b.accountType),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'accountStatus',
      key: 'accountStatus',
      render: (status) => (
        status ? <Tag color="success">Hoạt động</Tag> : <Tag color="error">Bị khóa</Tag>
      ),
    },
    {
      title: 'Đăng nhập gần nhất',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY HH:mm') : 'Chưa đăng nhập',
      sorter: (a, b) => new Date(a.lastLogin || 0) - new Date(b.lastLogin || 0),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EyeOutlined />} 
            size="small" 
            onClick={() => showViewModal(record.accountId)}
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
            onClick={() => showDeleteConfirm(record.accountId, record.email)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="account-page">
      <Card 
        title={
          <Space>
            <LockOutlined />
            <span>Quản lý tài khoản</span>
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
            placeholder="Tìm kiếm theo email hoặc loại tài khoản"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={handleSearch}
            style={{ width: 400, marginBottom: 16 }}
          />
        </div>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="accountId"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} tài khoản`,
          }}
        />
      </Card>

      {/* Modal thêm/sửa tài khoản */}
      <Modal
        title={currentAccount ? "Cập nhật tài khoản" : "Thêm tài khoản mới"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input placeholder="Nhập email" disabled={!!currentAccount} />
          </Form.Item>

          {!currentAccount && (
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          )}

          <Form.Item
            name="accountType"
            label="Loại tài khoản"
            rules={[{ required: true, message: 'Vui lòng chọn loại tài khoản' }]}
          >
            <Select placeholder="Chọn loại tài khoản">
              <Option value="admin">Admin</Option>
              <Option value="staff">Nhân viên</Option>
              <Option value="customer">Khách hàng</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="accountStatus"
            label="Trạng thái"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="Hoạt động" unCheckedChildren="Khóa" />
          </Form.Item>

          <Form.Item className="form-actions">
            <Space>
              <Button onClick={handleCancel}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {currentAccount ? "Cập nhật" : "Thêm mới"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem chi tiết */}
      <Modal
        title="Chi tiết tài khoản"
        visible={isViewModalVisible}
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
              showAddEditModal(currentAccount);
            }}
          >
            Chỉnh sửa
          </Button>,
        ]}
        width={700}
      >
        {currentAccount && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Email">{currentAccount.email}</Descriptions.Item>
            <Descriptions.Item label="Loại tài khoản">{getAccountTypeTag(currentAccount.accountType)}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {currentAccount.accountStatus ? 
                <Tag color="success">Hoạt động</Tag> : 
                <Tag color="error">Bị khóa</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="Đăng nhập gần nhất">
              {currentAccount.lastLogin ? 
                dayjs(currentAccount.lastLogin).format('DD/MM/YYYY HH:mm') : 
                'Chưa đăng nhập'}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {dayjs(currentAccount.createdAt).format('DD/MM/YYYY HH:mm')}
            </Descriptions.Item>
            <Descriptions.Item label="Cập nhật gần nhất">
              {dayjs(currentAccount.updatedAt).format('DD/MM/YYYY HH:mm')}
            </Descriptions.Item>
            
            {/* Hiển thị thông tin User liên kết nếu có */}
            {currentAccount.User && (
              <>
                <Descriptions.Item label="Thông tin người dùng" span={2}>
                  <div style={{ marginBottom: 8 }}>
                    <strong>Họ tên:</strong> {currentAccount.User.name}
                  </div>
                  {currentAccount.User.roleId && (
                    <div style={{ marginBottom: 8 }}>
                      <strong>Vai trò:</strong> {currentAccount.User.roleId}
                    </div>
                  )}
                  {currentAccount.User.phoneNumber && (
                    <div style={{ marginBottom: 8 }}>
                      <strong>Số điện thoại:</strong> {currentAccount.User.phoneNumber}
                    </div>
                  )}
                </Descriptions.Item>
              </>
            )}
            
            {/* Hiển thị thông tin Customer liên kết nếu có */}
            {currentAccount.Customer && (
              <>
                <Descriptions.Item label="Thông tin khách hàng" span={2}>
                  <div style={{ marginBottom: 8 }}>
                    <strong>Họ tên:</strong> {currentAccount.Customer.customerName}
                  </div>
                  {currentAccount.Customer.phoneNumber && (
                    <div style={{ marginBottom: 8 }}>
                      <strong>Số điện thoại:</strong> {currentAccount.Customer.phoneNumber}
                    </div>
                  )}
                  {currentAccount.Customer.address && (
                    <div style={{ marginBottom: 8 }}>
                      <strong>Địa chỉ:</strong> {currentAccount.Customer.address}
                    </div>
                  )}
                </Descriptions.Item>
              </>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}

export default Account;
