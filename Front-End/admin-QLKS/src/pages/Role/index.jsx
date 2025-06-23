import { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Card, Tag, Modal, Form, Input as AntInput, Checkbox, message, Descriptions, Divider } from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ExclamationCircleOutlined,
  EyeOutlined,
  TeamOutlined,
  KeyOutlined
} from '@ant-design/icons';
import { getAllRoles, getRoleById, createRole, updateRole, deleteRole, addPermissionToRole, removePermissionFromRole } from '../../services/roleService';
import { getAllPermissions } from '../../services/permissionService';
import dayjs from 'dayjs';
import './Role.scss';

const { confirm } = Modal;
const { TextArea } = AntInput;

function Role() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPermissionModalVisible, setIsPermissionModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await getAllRoles();
      if (response && response.DT) {
        setRoles(response.DT);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      message.error('Không thể tải danh sách vai trò');
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await getAllPermissions();
      if (response && response.DT) {
        setPermissions(response.DT);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
      message.error('Không thể tải danh sách quyền');
    }
  };

  const showAddEditModal = (role = null) => {
    setCurrentRole(role);
    setIsModalVisible(true);
    
    if (role) {
      form.setFieldsValue({
        roleName: role.roleName,
        description: role.description,
      });
    } else {
      form.resetFields();
    }
  };

  const showPermissionsModal = async (role) => {
    setCurrentRole(role);
    setLoading(true);

    try {
      // Lấy thông tin vai trò với các quyền đã được gán
      const response = await getRoleById(role.roleId);
      if (response && response.DT) {
        const roleWithPermissions = response.DT;
        // Lấy danh sách ID của các quyền đã được gán cho vai trò
        const permissionIds = roleWithPermissions.Permissions?.map(p => p.permissionId) || [];
        setSelectedPermissions(permissionIds);
      }
      setIsPermissionModalVisible(true);
    } catch (error) {
      console.error('Error fetching role permissions:', error);
      message.error('Không thể tải thông tin quyền của vai trò');
    } finally {
      setLoading(false);
    }
  };

  const showViewModal = async (roleId) => {
    try {
      setLoading(true);
      const response = await getRoleById(roleId);
      if (response && response.DT) {
        setCurrentRole(response.DT);
        setIsViewModalVisible(true);
      }
    } catch (error) {
      console.error('Error fetching role details:', error);
      message.error('Không thể tải thông tin chi tiết vai trò');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentRole(null);
    form.resetFields();
  };

  const handlePermissionCancel = () => {
    setIsPermissionModalVisible(false);
    setSelectedPermissions([]);
  };

  const handleViewCancel = () => {
    setIsViewModalVisible(false);
    setCurrentRole(null);
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      let response;
      if (currentRole) {
        response = await updateRole(currentRole.roleId, values);
        message.success('Cập nhật vai trò thành công');
      } else {
        response = await createRole(values);
        message.success('Thêm vai trò mới thành công');
      }

      setIsModalVisible(false);
      fetchRoles();
    } catch (error) {
      console.error('Error saving role:', error);
      message.error('Lỗi khi lưu thông tin vai trò');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = async (permissionId, checked) => {
    if (!currentRole) return;

    try {
      setLoading(true);
      if (checked) {
        // Thêm quyền
        await addPermissionToRole(currentRole.roleId, permissionId);
        message.success('Thêm quyền thành công');
      } else {
        // Xóa quyền
        await removePermissionFromRole(currentRole.roleId, permissionId);
        message.success('Xóa quyền thành công');
      }
      
      // Cập nhật lại danh sách quyền đã chọn
      setSelectedPermissions(prevSelected => 
        checked 
          ? [...prevSelected, permissionId]
          : prevSelected.filter(id => id !== permissionId)
      );
    } catch (error) {
      console.error('Error updating role permissions:', error);
      message.error('Lỗi khi cập nhật quyền');
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirm = (roleId, roleName) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa vai trò này?',
      icon: <ExclamationCircleOutlined />,
      content: `Vai trò: ${roleName}`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          setLoading(true);
          await deleteRole(roleId);
          message.success('Xóa vai trò thành công');
          fetchRoles();
        } catch (error) {
          console.error('Error deleting role:', error);
          message.error('Không thể xóa vai trò');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredData = roles.filter(item => 
    item.roleName?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Nhóm quyền theo tài nguyên (resource)
  const groupedPermissions = permissions.reduce((groups, permission) => {
    const resource = permission.resource || 'Khác';
    if (!groups[resource]) {
      groups[resource] = [];
    }
    groups[resource].push(permission);
    return groups;
  }, {});

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Tên vai trò',
      dataIndex: 'roleName',
      key: 'roleName',
      sorter: (a, b) => a.roleName?.localeCompare(b.roleName),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
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
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EyeOutlined />} 
            size="small" 
            onClick={() => showViewModal(record.roleId)}
          />
          <Button 
            type="default" 
            icon={<KeyOutlined />} 
            size="small" 
            onClick={() => showPermissionsModal(record)}
            title="Quản lý quyền"
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
            onClick={() => showDeleteConfirm(record.roleId, record.roleName)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="role-page">
      <Card 
        title={
          <Space>
            <TeamOutlined />
            <span>Quản lý vai trò</span>
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
            placeholder="Tìm kiếm theo tên vai trò hoặc mô tả"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={handleSearch}
            style={{ width: 400, marginBottom: 16 }}
          />
        </div>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="roleId"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} vai trò`,
          }}
        />
      </Card>

      {/* Modal thêm/sửa vai trò */}
      <Modal
        title={currentRole ? "Cập nhật vai trò" : "Thêm vai trò mới"}
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
            name="roleName"
            label="Tên vai trò"
            rules={[{ required: true, message: 'Vui lòng nhập tên vai trò' }]}
          >
            <AntInput placeholder="Nhập tên vai trò" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <TextArea rows={4} placeholder="Nhập mô tả vai trò" />
          </Form.Item>

          <Form.Item className="form-actions">
            <Space>
              <Button onClick={handleCancel}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {currentRole ? "Cập nhật" : "Thêm mới"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal quản lý quyền */}
      <Modal
        title={`Quản lý quyền - Vai trò: ${currentRole?.roleName}`}
        visible={isPermissionModalVisible}
        onCancel={handlePermissionCancel}
        footer={[
          <Button key="back" onClick={handlePermissionCancel}>
            Đóng
          </Button>
        ]}
        width={800}
      >
        {Object.entries(groupedPermissions).map(([resource, perms]) => (
          <div key={resource}>
            <Divider orientation="left">{resource}</Divider>
            <div className="permissions-section">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {perms.map(permission => (
                  <div key={permission.permissionId} className="permission-item">
                    <Checkbox
                      checked={selectedPermissions.includes(permission.permissionId)}
                      onChange={(e) => handlePermissionChange(permission.permissionId, e.target.checked)}
                      disabled={loading}
                    >
                      {permission.permissionName} ({permission.action})
                    </Checkbox>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </Modal>

      {/* Modal xem chi tiết */}
      <Modal
        title="Chi tiết vai trò"
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
              showAddEditModal(currentRole);
            }}
          >
            Chỉnh sửa
          </Button>,
        ]}
        width={700}
      >
        {currentRole && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Tên vai trò">{currentRole.roleName}</Descriptions.Item>
            <Descriptions.Item label="Mô tả">{currentRole.description || 'Không có mô tả'}</Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {dayjs(currentRole.createdAt).format('DD/MM/YYYY HH:mm')}
            </Descriptions.Item>
            <Descriptions.Item label="Cập nhật gần nhất">
              {dayjs(currentRole.updatedAt).format('DD/MM/YYYY HH:mm')}
            </Descriptions.Item>
            
            <Descriptions.Item label="Quyền">
              {currentRole.Permissions && currentRole.Permissions.length > 0 ? (
                <div className="permission-tags">
                  {currentRole.Permissions.map(permission => (
                    <Tag color="blue" key={permission.permissionId}>
                      {permission.permissionName}
                    </Tag>
                  ))}
                </div>
              ) : 'Không có quyền nào'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}

export default Role;