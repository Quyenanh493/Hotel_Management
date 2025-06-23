import { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Card, Tag, Modal, Form, DatePicker, message, Descriptions, Upload, Spin } from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ExclamationCircleOutlined,
  UploadOutlined,
  EyeOutlined,
  UserOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { getAllCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer } from '../../services/customerService';
import { uploadImage } from '../../services/uploadImageService';
import dayjs from 'dayjs';
import './Customers.scss';
import { usePermissions } from '../../contexts/PermissionContext';

const { confirm } = Modal;
const { TextArea } = Input;

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);

  // Get permission utilities
  const { canCreate, canUpdate, canDelete, isLoading: permissionLoading } = usePermissions();
  const hasCreatePermission = canCreate('customers');
  const hasUpdatePermission = canUpdate('customers');
  const hasDeletePermission = canDelete('customers');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await getAllCustomers();
      if (response && response.DT) {
        setCustomers(response.DT);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      message.error('Không thể tải danh sách khách hàng');
    } finally {
      setLoading(false);
    }
  };

  const showAddEditModal = (customer = null) => {
    setCurrentCustomer(customer);
    setIsModalVisible(true);
    
    if (customer) {
      const formData = {
        ...customer,
        birthday: customer.birthday ? dayjs(customer.birthday) : null,
      };
      form.setFieldsValue(formData);
      
      // Nếu khách hàng có hình ảnh, hiển thị nó
      if (customer.customerImage) {
        setImageUrl(customer.customerImage);
        setUploadedImageUrl(customer.customerImage);
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

  const showViewModal = async (customerId) => {
    try {
      setLoading(true);
      const response = await getCustomerById(customerId);
      if (response && response.DT) {
        setCurrentCustomer(response.DT);
        setIsViewModalVisible(true);
      }
    } catch (error) {
      console.error('Error fetching customer details:', error);
      message.error('Không thể tải thông tin khách hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentCustomer(null);
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
        birthday: values.birthday ? values.birthday.format('YYYY-MM-DD') : null,
        customerImage: uploadedImageUrl || values.customerImage,
      };

      let response;
      if (currentCustomer) {
        response = await updateCustomer(currentCustomer.customerId, formData);
        message.success('Cập nhật khách hàng thành công');
      } else {
        response = await createCustomer(formData);
        message.success('Thêm khách hàng thành công');
      }

      setIsModalVisible(false);
      fetchCustomers();
    } catch (error) {
      console.error('Error saving customer:', error);
      message.error('Lỗi khi lưu thông tin khách hàng');
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirm = (customerId, customerName) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa khách hàng này?',
      icon: <ExclamationCircleOutlined />,
      content: `Khách hàng: ${customerName}`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          setLoading(true);
          await deleteCustomer(customerId);
          message.success('Xóa khách hàng thành công');
          fetchCustomers();
        } catch (error) {
          console.error('Error deleting customer:', error);
          message.error('Không thể xóa khách hàng');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredData = customers.filter(item => 
    item.customerName?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.email?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.phoneNumber?.includes(searchText)
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

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'customerName',
      key: 'customerName',
      sorter: (a, b) => a.customerName.localeCompare(b.customerName),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
      render: (text) => text || 'Chưa cập nhật',
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record) => (
        record.Account ? 
          <Tag color={record.Account.accountStatus ? "success" : "error"}>
            {record.Account.accountStatus ? "Hoạt động" : "Bị khóa"}
          </Tag> 
          : 
          <Tag color="default">Không xác định</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EyeOutlined />} 
            size="small" 
            onClick={() => showViewModal(record.customerId)}
          />
          {hasUpdatePermission && (
          <Button 
            type="default" 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => showAddEditModal(record)}
          />
          )}
          {hasDeletePermission && (
          <Button 
            type="primary" 
            danger 
            icon={<DeleteOutlined />} 
            size="small" 
            onClick={() => showDeleteConfirm(record.customerId, record.customerName)}
          />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="customers-page">
      <Card 
        title={
          <Space>
            <UserOutlined />
            <span>Quản lý khách hàng</span>
          </Space>
        }
        extra={
          hasCreatePermission && (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => showAddEditModal()}>
              Thêm mới
            </Button>
          )
        }
      >
        <div className="table-actions">
          <Input
            placeholder="Tìm kiếm theo tên, email hoặc số điện thoại"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={handleSearch}
            style={{ width: 400, marginBottom: 16 }}
          />
        </div>
        <Table
          columns={columns.filter(col => {
            // Always show all columns except action if no permissions
            if (col.key !== 'action') return true;
            // Only show action column if user has at least one action permission
            return hasUpdatePermission || hasDeletePermission;
          })}
          dataSource={filteredData}
          rowKey="customerId"
          loading={loading || permissionLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} khách hàng`,
          }}
        />
      </Card>

      {/* Modal thêm/sửa khách hàng */}
      <Modal
        title={currentCustomer ? 'Cập nhật khách hàng' : 'Thêm khách hàng mới'}
        visible={isModalVisible}
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
            name="customerName"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
          >
            <Input placeholder="Nhập họ và tên khách hàng" />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input placeholder="Nhập email" disabled={currentCustomer} />
          </Form.Item>
          
          <Form.Item
            name="phoneNumber"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 chữ số' }
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
          
          {!currentCustomer && (
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
            name="address"
            label="Địa chỉ"
          >
            <Input placeholder="Nhập địa chỉ" />
          </Form.Item>
          
          <Form.Item
            name="birthday"
            label="Ngày sinh"
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="idNumber"
            label="CMND/CCCD"
          >
            <Input placeholder="Nhập số CMND/CCCD" />
          </Form.Item>
          
          <Form.Item
            name="customerImage"
            label="Hình ảnh"
            getValueFromEvent={() => uploadedImageUrl}
          >
            <Upload
              name="customerImage"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              customRequest={customUpload}
              beforeUpload={beforeUpload}
            >
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt="customer" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : uploadButton}
            </Upload>
          </Form.Item>
          
          <Form.Item
            name="customerNote"
            label="Ghi chú"
          >
            <TextArea rows={4} placeholder="Nhập ghi chú về khách hàng" />
          </Form.Item>

          <Form.Item className="form-actions">
            <Button type="default" onClick={handleCancel} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {currentCustomer ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem chi tiết */}
      <Modal
        title="Chi tiết khách hàng"
        visible={isViewModalVisible}
        onCancel={handleViewCancel}
        footer={[
          <Button key="back" onClick={handleViewCancel}>
            Đóng
          </Button>,
          hasUpdatePermission && (
            <Button 
              key="edit" 
              type="primary" 
              onClick={() => {
                setIsViewModalVisible(false);
                showAddEditModal(currentCustomer);
              }}
            >
              Chỉnh sửa
            </Button>
          ),
        ].filter(Boolean)}
        width={700}
      >
        {currentCustomer && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Họ và tên">{currentCustomer.customerName}</Descriptions.Item>
            <Descriptions.Item label="Email">{currentCustomer.email}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{currentCustomer.phoneNumber}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{currentCustomer.address || 'Không có'}</Descriptions.Item>
            <Descriptions.Item label="Ngày sinh">
              {currentCustomer.birthday ? dayjs(currentCustomer.birthday).format('DD/MM/YYYY') : 'Không có'}
            </Descriptions.Item>
            <Descriptions.Item label="CMND/CCCD">{currentCustomer.idNumber || 'Không có'}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {currentCustomer.Account ? 
                (currentCustomer.Account.accountStatus ? 'Đang hoạt động' : 'Bị khóa') : 
                'Không xác định'}
            </Descriptions.Item>
            <Descriptions.Item label="Ghi chú">{currentCustomer.customerNote || 'Không có ghi chú'}</Descriptions.Item>
            {currentCustomer.customerImage && (
              <Descriptions.Item label="Hình ảnh">
                <img 
                  src={currentCustomer.customerImage} 
                  alt={currentCustomer.customerName} 
                  style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }} 
                />
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}

export default Customers; 