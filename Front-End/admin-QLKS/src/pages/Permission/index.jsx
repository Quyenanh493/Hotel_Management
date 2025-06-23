import { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Card, Tag, Modal, Form, Input as AntInput, Select, message, Descriptions } from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ExclamationCircleOutlined,
  EyeOutlined,
  KeyOutlined
} from '@ant-design/icons';
import { getAllPermissions, getPermissionById, createPermission, updatePermission, deletePermission } from '../../services/permissionService';
import dayjs from 'dayjs';
import './Permission.scss';

const { confirm } = Modal;
const { Option } = Select;

function Permission() {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [currentPermission, setCurrentPermission] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const response = await getAllPermissions();
      if (response && response.DT) {
        setPermissions(response.DT);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
      message.error('Không thể tải danh sách quyền');
    } finally {
      setLoading(false);
    }
  };

  const showAddEditModal = (permission = null) => {
    setCurrentPermission(permission);
    setIsModalVisible(true);
    
    if (permission) {
      form.setFieldsValue({
        permissionName: permission.permissionName,
        resource: permission.resource,
        action: permission.action
      });
    } else {
      form.resetFields();
    }
  };

  const showViewModal = async (permissionId) => {
    try {
      setLoading(true);
      const response = await getPermissionById(permissionId);
      if (response && response.DT) {
        setCurrentPermission(response.DT);
        setIsViewModalVisible(true);
      }
    } catch (error) {
      console.error('Error fetching permission details:', error);
      message.error('Không thể tải thông tin chi tiết quyền');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentPermission(null);
    form.resetFields();
  };

  const handleViewCancel = () => {
    setIsViewModalVisible(false);
    setCurrentPermission(null);
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      let response;
      if (currentPermission) {
        response = await updatePermission(currentPermission.permissionId, values);
        message.success('Cập nhật quyền thành công');
      } else {
        response = await createPermission(values);
        message.success('Thêm quyền mới thành công');
      }

      setIsModalVisible(false);
      fetchPermissions();
    } catch (error) {
      console.error('Error saving permission:', error);
      message.error('Lỗi khi lưu thông tin quyền');
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirm = (permissionId, permissionName) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa quyền này?',
      icon: <ExclamationCircleOutlined />,
      content: `Quyền: ${permissionName}`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          setLoading(true);
          await deletePermission(permissionId);
          message.success('Xóa quyền thành công');
          fetchPermissions();
        } catch (error) {
          console.error('Error deleting permission:', error);
          message.error('Không thể xóa quyền');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredData = permissions.filter(item => 
    item.permissionName?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.resource?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.action?.toLowerCase().includes(searchText.toLowerCase())
  );

  const getResourceTag = (resource) => {
    return <Tag className={`resource-tag ${resource.toLowerCase()}`}>{resource}</Tag>;
  };

  const getActionTag = (action) => {
    return <Tag className={`action-tag ${action.toLowerCase()}`}>{action}</Tag>;
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
      title: 'Tên quyền',
      dataIndex: 'permissionName',
      key: 'permissionName',
      sorter: (a, b) => a.permissionName?.localeCompare(b.permissionName),
    },
    {
      title: 'Tài nguyên',
      dataIndex: 'resource',
      key: 'resource',
      render: (resource) => getResourceTag(resource),
      sorter: (a, b) => a.resource?.localeCompare(b.resource),
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'actionType',
      render: (action) => getActionTag(action),
      sorter: (a, b) => a.action?.localeCompare(b.action),
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
            onClick={() => showViewModal(record.permissionId)}
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
            onClick={() => showDeleteConfirm(record.permissionId, record.permissionName)}
          />
        </Space>
      ),
    },
  ];

  // Danh sách các resource và action cho form
  const resourceOptions = [
    { value: 'users', label: 'Users' },
    { value: 'roles', label: 'Roles' },
    { value: 'bookings', label: 'Bookings' },
    { value: 'rooms', label: 'Rooms' },
    { value: 'amenities', label: 'Amenities' },
    { value: 'reports', label: 'Reports' },
    { value: 'payments', label: 'Payments' },
    { value: 'hotel', label: 'Hotel' },
    { value: 'customers', label: 'Customers' },
    { value: 'maintenance', label: 'Maintenance' }
  ];

  const actionOptions = [
    { value: 'create', label: 'Create' },
    { value: 'read', label: 'Read' },
    { value: 'update', label: 'Update' },
    { value: 'delete', label: 'Delete' }
  ];

  return (
    <div className="permission-page">
      <Card 
        title={
          <Space>
            <KeyOutlined />
            <span>Quản lý quyền</span>
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
            placeholder="Tìm kiếm theo tên quyền, tài nguyên, hoặc hành động"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={handleSearch}
            style={{ width: 400, marginBottom: 16 }}
          />
        </div>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="permissionId"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} quyền`,
          }}
        />
      </Card>

      {/* Modal thêm/sửa quyền */}
      <Modal
        title={currentPermission ? "Cập nhật quyền" : "Thêm quyền mới"}
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
            name="permissionName"
            label="Tên quyền"
            rules={[{ required: true, message: 'Vui lòng nhập tên quyền' }]}
          >
            <AntInput placeholder="Nhập tên quyền (VD: create_user, read_product)" />
          </Form.Item>

          <Form.Item
            name="resource"
            label="Tài nguyên"
            rules={[{ required: true, message: 'Vui lòng chọn tài nguyên' }]}
          >
            <Select placeholder="Chọn tài nguyên">
              {resourceOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="action"
            label="Hành động"
            rules={[{ required: true, message: 'Vui lòng chọn hành động' }]}
          >
            <Select placeholder="Chọn hành động">
              {actionOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item className="form-actions">
            <Space>
              <Button onClick={handleCancel}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {currentPermission ? "Cập nhật" : "Thêm mới"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem chi tiết */}
      <Modal
        title="Chi tiết quyền"
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
              showAddEditModal(currentPermission);
            }}
          >
            Chỉnh sửa
          </Button>,
        ]}
        width={600}
      >
        {currentPermission && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Tên quyền">{currentPermission.permissionName}</Descriptions.Item>
            <Descriptions.Item label="Tài nguyên">
              {getResourceTag(currentPermission.resource)}
            </Descriptions.Item>
            <Descriptions.Item label="Hành động">
              {getActionTag(currentPermission.action)}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {dayjs(currentPermission.createdAt).format('DD/MM/YYYY HH:mm')}
            </Descriptions.Item>
            <Descriptions.Item label="Cập nhật gần nhất">
              {dayjs(currentPermission.updatedAt).format('DD/MM/YYYY HH:mm')}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}

export default Permission;
