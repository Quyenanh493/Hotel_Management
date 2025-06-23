import { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Card, Tag, Modal, Form, message, Descriptions, Upload, Spin, Select, InputNumber, Checkbox, Rate, List, Image, Popconfirm } from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ExclamationCircleOutlined,
  UploadOutlined,
  EyeOutlined,
  HomeOutlined,
  LoadingOutlined,
  CloseCircleOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom, getRoomsByHotelId } from '../../services/roomService';
import { getAllHotels } from '../../services/hotelService';
import { uploadImage } from '../../services/uploadImageService';
import { uploadRoomImages, deleteRoomImage } from '../../services/imageUploadService';
import { usePermissions } from '../../contexts/PermissionContext';
import './Room.scss';

const { confirm } = Modal;
const { Option } = Select;
const { TextArea } = Input;

function Room() {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [form] = Form.useForm();
  const [imageUrls, setImageUrls] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [multipleUploadLoading, setMultipleUploadLoading] = useState(false);

  // Get permission utilities
  const { canCreate, canUpdate, canDelete, isLoading: permissionLoading } = usePermissions();
  const hasCreatePermission = canCreate('rooms');
  const hasUpdatePermission = canUpdate('rooms');
  const hasDeletePermission = canDelete('rooms');

  // Hàm để lấy ảnh chi tiết từ currentRoom
  const getCurrentRoomImages = () => {
    if (!currentRoom || !currentRoom.roomImages) return [];
    
    if (Array.isArray(currentRoom.roomImages)) {
      return currentRoom.roomImages;
    }
    
    if (typeof currentRoom.roomImages === 'string') {
      try {
        const parsed = JSON.parse(currentRoom.roomImages);
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.error('Error parsing roomImages JSON:', error);
        // Thử parse như string phân cách bằng dấu phẩy
        return currentRoom.roomImages.split(',').map(img => img.trim()).filter(img => img);
      }
    }
    
    return [];
  };

  useEffect(() => {
    fetchHotels();
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await getAllRooms();
      if (response && response.DT) {
        setRooms(response.DT);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      message.error('Không thể tải danh sách phòng');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomsByHotel = async (hotelId) => {
    setLoading(true);
    try {
      const response = await getRoomsByHotelId(hotelId);
      if (response && response.DT) {
        setRooms(response.DT);
      }
    } catch (error) {
      console.error('Error fetching rooms by hotel:', error);
      message.error('Không thể tải danh sách phòng của khách sạn');
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
      message.error('Không thể tải danh sách khách sạn');
    }
  };

  const showAddEditModal = (room = null) => {
    setCurrentRoom(room);
    setIsModalVisible(true);
    
    if (room) {
      form.setFieldsValue({
        hotelId: room.hotelId,
        roomName: room.roomName,
        roomType: room.roomType,
        roomStatus: room.roomStatus,
        maxCustomer: room.maxCustomer,
        maxRoom: room.maxRoom,
        price: room.price,
        description: room.description,
        roomStar: room.roomStar
      });
      setImageUrls(room.roomImage ? [room.roomImage] : []);
    } else {
      form.resetFields();
      if (selectedHotel) {
        form.setFieldsValue({ hotelId: selectedHotel });
      }
      setImageUrls([]);
    }
    setFileList([]);
  };

  const showViewModal = async (roomId) => {
    try {
      setLoading(true);
      const response = await getRoomById(roomId);
      if (response && response.DT) {
        setCurrentRoom(response.DT);
        setIsViewModalVisible(true);
      }
    } catch (error) {
      console.error('Error fetching room details:', error);
      message.error('Không thể tải thông tin chi tiết phòng');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setImageUrls([]);
    setFileList([]);
  };

  const handleViewCancel = () => {
    setIsViewModalVisible(false);
    setCurrentRoom(null);
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const formData = {
        ...values,
        roomImage: imageUrls[0] // Lấy URL ảnh đầu tiên
      };

      let response;
      if (currentRoom) {
        response = await updateRoom(currentRoom.roomId, formData);
        
        // Kiểm tra nếu maxRoom thay đổi, thông báo về việc tự động cập nhật trạng thái
        if (formData.maxRoom !== currentRoom.maxRoom) {
          message.success('Cập nhật phòng thành công! Trạng thái phòng sẽ được tự động cập nhật dựa trên số lượng đặt phòng hiện tại.');
        } else {
          message.success('Cập nhật phòng thành công');
        }
      } else {
        response = await createRoom(formData);
        message.success('Thêm phòng thành công');
      }

      setIsModalVisible(false);
      form.resetFields();
      
      // Cập nhật lại danh sách phòng theo khách sạn đang chọn
      if (selectedHotel) {
        fetchRoomsByHotel(selectedHotel);
      } else {
        fetchRooms();
      }
    } catch (error) {
      console.error('Error saving room:', error);
      message.error('Lỗi khi lưu thông tin phòng');
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirm = (roomId, roomName) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa phòng này?',
      icon: <ExclamationCircleOutlined />,
      content: `Phòng: ${roomName}`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deleteRoom(roomId);
          message.success('Xóa phòng thành công');
          if (selectedHotel) {
            fetchRoomsByHotel(selectedHotel);
          } else {
            fetchRooms();
          }
        } catch (error) {
          console.error('Error deleting room:', error);
          message.error('Không thể xóa phòng');
        }
      },
    });
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleHotelFilter = (hotelId) => {
    if (hotelId === 'all') {
      setSelectedHotel(null);
      fetchRooms();
    } else {
      setSelectedHotel(hotelId);
      fetchRoomsByHotel(hotelId);
    }
  };

  const filteredData = rooms.filter(item =>
    item.roomName?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.roomType?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Xử lý upload ảnh
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
      setImageUrls([imageUrl]); // Chỉ giữ một ảnh
      onSuccess();
    } catch (error) {
      console.error('Error uploading image:', error);
      onError();
      message.error('Không thể tải lên ảnh');
    } finally {
      setUploadLoading(false);
    }
  };

  // Upload nhiều ảnh cho phòng
  const handleMultipleUpload = async () => {
    if (!currentRoom || fileList.length === 0) {
      message.warning('Vui lòng chọn ảnh để upload');
      return;
    }

    setMultipleUploadLoading(true);
    try {
      const files = fileList.map(file => file.originFileObj);
      const response = await uploadRoomImages(currentRoom.roomId, files);
      
      if (response && response.EC === 0) {
        message.success(`Upload thành công ${response.DT.totalImages} ảnh`);
        // Refresh thông tin phòng để cập nhật ảnh mới
        const updatedRoom = await getRoomById(currentRoom.roomId);
        if (updatedRoom && updatedRoom.DT) {
          setCurrentRoom(updatedRoom.DT);
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
    if (!currentRoom) return;

    try {
      const response = await deleteRoomImage(currentRoom.roomId, imageUrl);
      if (response && response.EC === 0) {
        message.success('Xóa ảnh thành công');
        // Refresh thông tin phòng để cập nhật ảnh
        const updatedRoom = await getRoomById(currentRoom.roomId);
        if (updatedRoom && updatedRoom.DT) {
          setCurrentRoom(updatedRoom.DT);
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
    // Giới hạn tối đa 10 ảnh
    const limitedFileList = newFileList.slice(0, 10);
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
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Khách sạn',
      dataIndex: ['Hotel', 'hotelName'],
      key: 'hotelName',
      sorter: (a, b) => a.Hotel?.hotelName?.localeCompare(b.Hotel?.hotelName),
    },
    {
      title: 'Tên phòng',
      dataIndex: 'roomName',
      key: 'roomName',
      sorter: (a, b) => a.roomName?.localeCompare(b.roomName),
    },
    {
      title: 'Loại phòng',
      dataIndex: 'roomType',
      key: 'roomType',
      sorter: (a, b) => a.roomType?.localeCompare(b.roomType),
    },
    {
      title: 'Giá (VNĐ)',
      dataIndex: 'price',
      key: 'price',
      render: (price) => new Intl.NumberFormat('vi-VN').format(price),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Số người tối đa',
      dataIndex: 'maxCustomer',
      key: 'maxCustomer',
      sorter: (a, b) => a.maxCustomer - b.maxCustomer,
    },
    {
      title: 'Đánh giá sao',
      dataIndex: 'averageRating',
      key: 'averageRating',
      render: (rating) => (
        <Rate 
          disabled 
          allowHalf 
          defaultValue={rating || 0} 
          style={{ fontSize: '14px' }}
        />
      ),
      sorter: (a, b) => a.averageRating - b.averageRating,
    },
    {
      title: 'Số lượng đánh giá',
      dataIndex: 'totalReview',
      key: 'totalReview',
      render: (total) => total || 0,
      sorter: (a, b) => (a.totalReview || 0) - (b.totalReview || 0),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'roomStatus',
      key: 'roomStatus',
      render: (status) => {
        let color = 'green';
        let text = 'Trống';
        
        switch (status?.toLowerCase()) {
          case 'available':
            color = 'green';
            text = 'Trống';
            break;
          case 'occupied':
            color = 'red';
            text = 'Hết phòng';
            break;
          case 'maintenance':
            color = 'orange';
            text = 'Bảo trì';
            break;
          default:
            color = 'green';
            text = 'Trống';
            break;
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EyeOutlined />} 
            size="small" 
            onClick={() => showViewModal(record.roomId)}
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
            onClick={() => showDeleteConfirm(record.roomId, record.roomName)}
          />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="room-page">
      <Card
        title={
          <Space>
            <HomeOutlined />
            <span>Quản lý phòng</span>
          </Space>
        }
        extra={
          hasCreatePermission && (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => showAddEditModal()}>
              Thêm phòng mới
            </Button>
          )
        }
      >
        <div className="table-actions" style={{ marginBottom: 16 }}>
          <Space size="middle">
            <Select
              placeholder="Chọn khách sạn"
              style={{ width: 200 }}
              onChange={handleHotelFilter}
              value={selectedHotel || 'all'}
            >
              <Option value="all">Tất cả khách sạn</Option>
              {hotels.map(hotel => (
                <Option key={hotel.hotelId} value={hotel.hotelId}>{hotel.hotelName}</Option>
              ))}
            </Select>
            <Input
              placeholder="Tìm kiếm theo tên phòng, loại phòng..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={handleSearch}
              style={{ width: 300 }}
            />
          </Space>
        </div>

        <Table
          columns={columns.filter(col => {
            // Always show all columns except action if no permissions
            if (col.key !== 'action') return true;
            // Only show action column if user has at least one action permission
            return hasUpdatePermission || hasDeletePermission;
          })}
          dataSource={filteredData}
          rowKey="roomId"
          loading={loading || permissionLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} phòng`,
          }}
        />
      </Card>

      {/* Modal thêm/sửa phòng */}
      <Modal
        title={currentRoom ? 'Cập nhật phòng' : 'Thêm phòng mới'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="hotelId"
            label="Khách sạn"
            rules={[{ required: true, message: 'Vui lòng chọn khách sạn' }]}
          >
            <Select placeholder="Chọn khách sạn">
              {hotels.map(hotel => (
                <Option key={hotel.hotelId} value={hotel.hotelId}>{hotel.hotelName}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="roomName"
            label="Tên phòng"
            rules={[{ required: true, message: 'Vui lòng nhập tên phòng' }]}
          >
            <Input placeholder="Nhập tên phòng" />
          </Form.Item>

          <Form.Item
            name="roomType"
            label="Loại phòng"
            rules={[{ required: true, message: 'Vui lòng chọn loại phòng' }]}
          >
            <Select placeholder="Chọn loại phòng">
              <Option value="Standard">Standard</Option>
              <Option value="Deluxe">Deluxe</Option>
              <Option value="Suite">Suite</Option>
              <Option value="Family">Family</Option>
              <Option value="Premium">Premium</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá phòng (VNĐ)"
            rules={[{ required: true, message: 'Vui lòng nhập giá phòng' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              min={0}
            />
          </Form.Item>

          <Form.Item
            name="maxCustomer"
            label="Số người tối đa"
            rules={[{ required: true, message: 'Vui lòng nhập số người tối đa' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="maxRoom"
            label="Số lượng phòng"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng phòng' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="roomStatus"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="Available">Trống</Option>
              <Option value="Occupied">Hết phòng</Option>
              <Option value="Maintenance">Bảo trì</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <TextArea rows={4} placeholder="Nhập mô tả phòng" />
          </Form.Item>

          <Form.Item label="Hình ảnh chính">
            <Upload
              listType="picture-card"
              showUploadList={false}
              beforeUpload={beforeUpload}
              customRequest={customUpload}
            >
              {imageUrls.length > 0 ? (
                <img src={imageUrls[0]} alt="room" style={{ width: '100%' }} />
              ) : (
                <div>
                  {uploadLoading ? <LoadingOutlined /> : <UploadOutlined />}
                  <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          {/* Phần upload nhiều ảnh (chỉ hiển thị khi đang edit) */}
          {currentRoom && (
            <Form.Item label="Ảnh phòng chi tiết">
              <div style={{ marginBottom: 16 }}>
                <Upload
                  multiple
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleMultipleFileChange}
                  beforeUpload={beforeUploadMultiple}
                  accept="image/*"
                >
                  {fileList.length >= 10 ? null : (
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
                  Tối đa 10 ảnh, mỗi ảnh không quá 5MB
                </div>
              </div>

              {/* Hiển thị ảnh hiện có */}
              {getCurrentRoomImages().length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ marginBottom: 8, fontWeight: 'bold' }}>
                    Ảnh hiện có ({getCurrentRoomImages().length}):
                  </div>
                  <div className="room-images-container">
                    {getCurrentRoomImages().map((imageUrl, index) => (
                      <div key={index} className="room-image-item">
                        <Image
                        key={index}
                        width={80}
                        height={80}
                        src={imageUrl}
                        style={{ objectFit: 'cover', borderRadius: '4px' }}
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

          <Form.Item>
            <Space>
              <Button onClick={handleCancel}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {currentRoom ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem chi tiết */}
      <Modal
        title="Chi tiết phòng"
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
                handleViewCancel();
                showAddEditModal(currentRoom);
              }}
            >
              Chỉnh sửa
            </Button>
          ),
        ].filter(Boolean)}
        width={700}
      >
        {currentRoom && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Khách sạn">{currentRoom.Hotel?.hotelName}</Descriptions.Item>
            <Descriptions.Item label="Tên phòng">{currentRoom.roomName}</Descriptions.Item>
            <Descriptions.Item label="Loại phòng">{currentRoom.roomType}</Descriptions.Item>
            <Descriptions.Item label="Giá phòng">{new Intl.NumberFormat('vi-VN').format(currentRoom.price)} VNĐ</Descriptions.Item>
            <Descriptions.Item label="Số người tối đa">{currentRoom.maxCustomer}</Descriptions.Item>
            <Descriptions.Item label="Số lượng phòng">{currentRoom.maxRoom}</Descriptions.Item>
            <Descriptions.Item label="Phòng trống hiện tại">
              {currentRoom.currentlyAvailable !== undefined ? 
                `${currentRoom.currentlyAvailable}/${currentRoom.maxRoom} phòng có sẵn` : 
                `${currentRoom.maxRoom} phòng có sẵn`
              }
            </Descriptions.Item>
            <Descriptions.Item label="Đánh giá từ khách hàng">
              <span style={{ marginRight: '10px' }}>
                <Rate disabled allowHalf value={currentRoom.averageRating || 0} style={{ fontSize: '16px' }} />
              </span>
              <span>({parseFloat(currentRoom.averageRating)?.toFixed(1) || '0.0'}) - {currentRoom.totalReview || 0} đánh giá</span>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={
                currentRoom.roomStatus === 'Available' ? 'green' :
                currentRoom.roomStatus === 'Occupied' ? 'red' : 'orange'
              }>
                {currentRoom.roomStatus === 'Available' ? 'Trống' :
                 currentRoom.roomStatus === 'Occupied' ? 'Hết phòng' : 'Bảo trì'}
              </Tag>
            </Descriptions.Item>
            {currentRoom.description && (
              <Descriptions.Item label="Mô tả">{currentRoom.description}</Descriptions.Item>
            )}
            {currentRoom.roomImage && (
              <Descriptions.Item label="Hình ảnh chính">
                <img src={currentRoom.roomImage} alt="room" style={{ maxWidth: '100%' }} />
              </Descriptions.Item>
            )}
            {getCurrentRoomImages().length > 0 && (
              <Descriptions.Item label={`Ảnh chi tiết (${getCurrentRoomImages().length})`}>
                <Image.PreviewGroup>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {getCurrentRoomImages().map((imageUrl, index) => (
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

export default Room; 