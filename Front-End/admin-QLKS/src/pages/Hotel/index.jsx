import { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Card, Tag, Modal, Form, DatePicker, Switch, message, Descriptions, Upload, List, Image, Popconfirm } from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ExclamationCircleOutlined,
  UploadOutlined,
  EyeOutlined,
  LoadingOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { getAllHotels, getAllHotelsForAdmin, getHotelById, createHotel, updateHotel, deleteHotel } from '../../services/hotelService';
import dayjs from 'dayjs';
import './Hotel.scss';
import { uploadImage } from '../../services/uploadImageService';
import { uploadHotelImages, deleteHotelImage } from '../../services/imageUploadService';
import { usePermissions } from '../../contexts/PermissionContext';

const { confirm } = Modal;
const { TextArea } = Input;

function Hotel() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [currentHotel, setCurrentHotel] = useState(null);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [fileList, setFileList] = useState([]); // Danh sách file chờ upload
  const [multipleUploadLoading, setMultipleUploadLoading] = useState(false);

  // Get permission utilities
  const { canCreate, canUpdate, canDelete, isLoading: permissionLoading } = usePermissions();
  const hasCreatePermission = canCreate('hotel');
  const hasUpdatePermission = canUpdate('hotel');
  const hasDeletePermission = canDelete('hotel');

  // Hàm để lấy ảnh chi tiết từ currentHotel
  const getCurrentHotelImages = () => {
    if (!currentHotel || !currentHotel.hotelImages) return [];
    
    // Với DataTypes.JSON từ Sequelize, dữ liệu đã được tự động parse thành array
    if (Array.isArray(currentHotel.hotelImages)) {
      return currentHotel.hotelImages;
    }
    
    // Fallback: nếu vẫn là string, thử parse
    if (typeof currentHotel.hotelImages === 'string') {
      try {
        const parsed = JSON.parse(currentHotel.hotelImages);
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.error('Error parsing hotelImages JSON:', error);
        // Thử parse như string phân cách bằng dấu phẩy
        return currentHotel.hotelImages.split(',').map(img => img.trim()).filter(img => img);
      }
    }
    
    return [];
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const response = await getAllHotelsForAdmin();
      if (response && response.DT) {
        setHotels(response.DT);
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
      message.error('Không thể tải danh sách khách sạn');
    } finally {
      setLoading(false);
    }
  };

  const showAddEditModal = (hotel = null) => {
    setCurrentHotel(hotel);
    setIsModalVisible(true);
    
    if (hotel) {
      form.setFieldsValue({
        ...hotel,
        openDay: hotel.openDay ? dayjs(hotel.openDay) : null,
      });
      // Nếu khách sạn có hình ảnh, hiển thị nó
      if (hotel.hotelImage) {
        setImageUrl(hotel.hotelImage);
        setUploadedImageUrl(hotel.hotelImage);
      } else {
        setImageUrl('');
        setUploadedImageUrl('');
      }
    } else {
      form.resetFields();
      setImageUrl('');
      setUploadedImageUrl('');
    }
    setFileList([]);
  };

  const showViewModal = async (hotelId) => {
    try {
      setLoading(true);
      const response = await getHotelById(hotelId);
      if (response && response.DT) {
        setCurrentHotel(response.DT);
        setIsViewModalVisible(true);
      }
    } catch (error) {
      console.error('Error fetching hotel details:', error);
      message.error('Không thể tải thông tin khách sạn');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentHotel(null);
    form.resetFields();
    setImageUrl('');
    setUploadedImageUrl('');
    setFileList([]);
  };

  const handleViewCancel = () => {
    setIsViewModalVisible(false);
    setCurrentHotel(null);
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const formData = {
        ...values,
        openDay: values.openDay ? values.openDay.format('YYYY-MM-DD') : null,
        hotelImage: uploadedImageUrl || values.hotelImage, // Sử dụng URL ảnh đã tải lên
      };

      let response;
      if (currentHotel) {
        response = await updateHotel(currentHotel.hotelId, formData);
        message.success('Cập nhật khách sạn thành công');
      } else {
        response = await createHotel(formData);
        message.success('Thêm khách sạn thành công');
      }

      setIsModalVisible(false);
      fetchHotels();
    } catch (error) {
      console.error('Error saving hotel:', error);
      message.error('Lỗi khi lưu thông tin khách sạn');
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirm = (hotelId, hotelName) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa khách sạn này?',
      icon: <ExclamationCircleOutlined />,
      content: `Khách sạn: ${hotelName}`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          setLoading(true);
          await deleteHotel(hotelId);
          message.success('Xóa khách sạn thành công');
          fetchHotels();
        } catch (error) {
          console.error('Error deleting hotel:', error);
          message.error('Không thể xóa khách sạn');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredData = hotels.filter(item => 
    item.hotelName.toLowerCase().includes(searchText.toLowerCase())
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

  // Upload nhiều ảnh cho khách sạn
  const handleMultipleUpload = async () => {
    if (!currentHotel || fileList.length === 0) {
      message.warning('Vui lòng chọn ảnh để upload');
      return;
    }

    setMultipleUploadLoading(true);
    try {
      const files = fileList.map(file => file.originFileObj);
      const response = await uploadHotelImages(currentHotel.hotelId, files);
      
      if (response && response.EC === 0) {
        message.success(`Upload thành công ${response.DT.totalImages} ảnh`);
        // Refresh thông tin khách sạn để cập nhật ảnh mới
        const updatedHotel = await getHotelById(currentHotel.hotelId);
        if (updatedHotel && updatedHotel.DT) {
          setCurrentHotel(updatedHotel.DT);
        }
        setFileList([]);
      } else {
        message.error(response.EM || 'Upload ảnh thất bại');
      }
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      message.error('Có lỗi xảy ra khi upload ảnh');
    } finally {
      setMultipleUploadLoading(false);
    }
  };

  // Xóa ảnh cụ thể
  const handleDeleteImage = async (imageUrl) => {
    if (!currentHotel) return;

    try {
      const response = await deleteHotelImage(currentHotel.hotelId, imageUrl);
      if (response && response.EC === 0) {
        message.success('Xóa ảnh thành công');
        // Refresh thông tin khách sạn để cập nhật ảnh
        const updatedHotel = await getHotelById(currentHotel.hotelId);
        if (updatedHotel && updatedHotel.DT) {
          setCurrentHotel(updatedHotel.DT);
        }
      } else {
        message.error(response.EM || 'Xóa ảnh thất bại');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      message.error('Có lỗi xảy ra khi xóa ảnh');
    }
  };

  // Xử lý multiple file upload
  const handleMultipleFileChange = ({ fileList: newFileList }) => {
    // Giới hạn tối đa 15 ảnh
    const limitedFileList = newFileList.slice(0, 15);
    setFileList(limitedFileList);
  };

  // Validate file trước khi thêm vào list
  const beforeUploadMultiple = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Chỉ chấp nhận file JPG/PNG!');
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Kích thước ảnh phải nhỏ hơn 5MB!');
      return false;
    }
    return false; // Ngăn auto upload, chỉ add vào fileList
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 80,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Tên khách sạn',
      dataIndex: 'hotelName',
      key: 'hotelName',
      sorter: (a, b) => a.hotelName.localeCompare(b.hotelName),
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: 'Loại',
      dataIndex: 'hotelType',
      key: 'hotelType',
    },
    {
      title: 'Ngày mở cửa',
      dataIndex: 'openDay',
      key: 'openDay',
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : 'N/A',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'hotelStatus',
      key: 'hotelStatus',
      render: (status) => (
        status ? <Tag color="success">Đang hoạt động</Tag> : <Tag color="error">Tạm đóng cửa</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 160,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EyeOutlined />} 
            size="small" 
            onClick={() => showViewModal(record.hotelId)}
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
            onClick={() => showDeleteConfirm(record.hotelId, record.hotelName)}
          />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="hotel-page">
      <Card 
        title="Danh sách khách sạn" 
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
            placeholder="Tìm kiếm theo tên khách sạn"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={handleSearch}
            style={{ width: 300, marginBottom: 16 }}
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
          rowKey="hotelId"
          loading={loading || permissionLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} khách sạn`,
          }}
        />
      </Card>

      {/* Modal thêm/sửa khách sạn */}
      <Modal
        title={currentHotel ? 'Cập nhật khách sạn' : 'Thêm khách sạn mới'}
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
          initialValues={{
            hotelStatus: true,
          }}
        >
          <Form.Item
            name="hotelName"
            label="Tên khách sạn"
            rules={[{ required: true, message: 'Vui lòng nhập tên khách sạn' }]}
          >
            <Input placeholder="Nhập tên khách sạn" />
          </Form.Item>
          
          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
          >
            <Input placeholder="Nhập địa chỉ khách sạn" />
          </Form.Item>
          
          <Form.Item
            name="hotelType"
            label="Loại khách sạn"
          >
            <Input placeholder="Nhập loại khách sạn (VD: 5 sao, boutique, ...)" />
          </Form.Item>
          
          <Form.Item
            name="openDay"
            label="Ngày mở cửa"
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="hotelImage"
            label="Hình ảnh chính"
            getValueFromEvent={() => uploadedImageUrl} // Giá trị form là URL đã upload
          >
            <Upload
              name="hotelImage"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              customRequest={customUpload}
              beforeUpload={beforeUpload}
            >
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt="hotel" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : uploadButton}
            </Upload>
          </Form.Item>

          {/* Phần upload nhiều ảnh (chỉ hiển thị khi đang edit) */}
          {currentHotel && (
            <Form.Item label="Ảnh khách sạn chi tiết">
              <div style={{ marginBottom: 16 }}>
                <Upload
                  multiple
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleMultipleFileChange}
                  beforeUpload={beforeUploadMultiple}
                  accept="image/*"
                >
                  {fileList.length >= 15 ? null : (
                    <div>
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>Chọn ảnh</div>
                    </div>
                  )}
                </Upload>
                
                {fileList.length > 0 && (
                  <Button 
                    type="primary" 
                    onClick={handleMultipleUpload}
                    loading={multipleUploadLoading}
                    style={{ marginTop: 8 }}
                  >
                    Upload {fileList.length} ảnh
                  </Button>
                )}
                
                <div style={{ fontSize: '12px', color: '#999', marginTop: 4 }}>
                  Tối đa 15 ảnh, mỗi ảnh không quá 5MB
                </div>
              </div>

              {/* Hiển thị ảnh hiện có */}
              {getCurrentHotelImages().length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ marginBottom: 8, fontWeight: 'bold' }}>
                    Ảnh hiện có ({getCurrentHotelImages().length}):
                  </div>
                  <div className="hotel-images-container">
                    {getCurrentHotelImages().map((imageUrl, index) => (
                      <div key={index} className="hotel-image-item">
                        <Image
                        key={index}
                        width={80}
                        height={80}
                        src={imageUrl}
                        style={{ objectFit: 'cover', borderRadius: '4px' }}
                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                      />
                        <CloseOutlined 
                          className="image-remove" 
                          onClick={() => handleDeleteImage(imageUrl)}
                          title="Xóa ảnh"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Form.Item>
          )}
          
          <Form.Item
            name="description"
            label="Mô tả"
          >
            <TextArea rows={4} placeholder="Nhập mô tả về khách sạn" />
          </Form.Item>
          
          <Form.Item
            name="hotelStatus"
            label="Trạng thái hoạt động"
            valuePropName="checked"
          >
            <Switch checkedChildren="Hoạt động" unCheckedChildren="Đóng cửa" />
          </Form.Item>

          <Form.Item className="form-actions">
            <Button type="default" onClick={handleCancel} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {currentHotel ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem chi tiết */}
      <Modal
        title="Chi tiết khách sạn"
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
                showAddEditModal(currentHotel);
              }}
            >
              Chỉnh sửa
            </Button>
          ),
        ].filter(Boolean)}
        width={700}
      >
        {currentHotel && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Tên khách sạn">{currentHotel.hotelName}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{currentHotel.address}</Descriptions.Item>
            <Descriptions.Item label="Loại khách sạn">{currentHotel.hotelType || 'Không có'}</Descriptions.Item>
            <Descriptions.Item label="Ngày mở cửa">
              {currentHotel.openDay ? dayjs(currentHotel.openDay).format('DD/MM/YYYY') : 'Không có'}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {currentHotel.hotelStatus ? 'Đang hoạt động' : 'Tạm đóng cửa'}
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả">{currentHotel.description || 'Không có mô tả'}</Descriptions.Item>
            {currentHotel.hotelImage && (
              <Descriptions.Item label="Hình ảnh chính">
                <img 
                  src={currentHotel.hotelImage} 
                  alt={currentHotel.hotelName} 
                  className="hotel-detail-image"
                />
              </Descriptions.Item>
            )}
            {getCurrentHotelImages().length > 0 && (
              <Descriptions.Item label={`Ảnh chi tiết (${getCurrentHotelImages().length})`}>
                <Image.PreviewGroup>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {getCurrentHotelImages().map((imageUrl, index) => (
                      <Image
                        key={index}
                        width={80}
                        height={80}
                        src={imageUrl}
                        style={{ objectFit: 'cover', borderRadius: '4px' }}
                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                      />
                    ))}
                  </div>
                </Image.PreviewGroup>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}

export default Hotel;