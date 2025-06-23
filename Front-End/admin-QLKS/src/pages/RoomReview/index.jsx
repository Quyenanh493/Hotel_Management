import { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Card, Tag, Modal, Form, message, Select, Rate, Descriptions } from 'antd';
import { 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ExclamationCircleOutlined,
  EyeOutlined,
  StarOutlined
} from '@ant-design/icons';
import { getAllRoomReviews, getRoomReviewById, getRoomReviewsByRoomId, deleteRoomReview, updateRoomReviewStatus } from '../../services/roomReviewService';
import { getAllRooms } from '../../services/roomService';
import { usePermissions } from '../../contexts/PermissionContext';
import './RoomReview.scss';

const { confirm } = Modal;
const { Option } = Select;
const { TextArea } = Input;

function RoomReview() {
  const [reviews, setReviews] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Get permission utilities
  const { canUpdate, canDelete, isLoading: permissionLoading } = usePermissions();
  const hasUpdatePermission = canUpdate('roomReviews');
  const hasDeletePermission = canDelete('roomReviews');

  useEffect(() => {
    fetchRooms();
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await getAllRoomReviews();
      if (response && response.DT) {
        setReviews(response.DT);
      }
    } catch (error) {
      console.error('Error fetching room reviews:', error);
      message.error('Không thể tải danh sách đánh giá phòng');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewsByRoom = async (roomId) => {
    setLoading(true);
    try {
      const response = await getRoomReviewsByRoomId(roomId);
      if (response && response.DT) {
        setReviews(response.DT);
      }
    } catch (error) {
      console.error('Error fetching reviews by room:', error);
      message.error('Không thể tải đánh giá theo phòng');
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await getAllRooms();
      if (response && response.DT) {
        setRooms(response.DT);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      message.error('Không thể tải danh sách phòng');
    }
  };

  const showViewModal = async (reviewId) => {
    try {
      setLoading(true);
      const response = await getRoomReviewById(reviewId);
      if (response && response.DT) {
        setCurrentReview(response.DT);
        setIsViewModalVisible(true);
      }
    } catch (error) {
      console.error('Error fetching review details:', error);
      message.error('Không thể tải thông tin chi tiết đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const handleViewCancel = () => {
    setIsViewModalVisible(false);
    setCurrentReview(null);
  };

  const showDeleteConfirm = (reviewId, roomName) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa đánh giá này?',
      icon: <ExclamationCircleOutlined />,
      content: `Đánh giá cho phòng: ${roomName}`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deleteRoomReview(reviewId);
          message.success('Xóa đánh giá thành công');
          if (selectedRoom) {
            fetchReviewsByRoom(selectedRoom);
          } else {
            fetchReviews();
          }
        } catch (error) {
          console.error('Error deleting review:', error);
          message.error('Không thể xóa đánh giá');
        }
      },
    });
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleRoomFilter = (roomId) => {
    if (roomId === 'all') {
      setSelectedRoom(null);
      fetchReviews();
    } else {
      setSelectedRoom(roomId);
      fetchReviewsByRoom(roomId);
    }
  };

  const handleUpdateStatus = async (reviewId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'hidden' : 'active';
      await updateRoomReviewStatus(reviewId, newStatus);
      message.success(`Đã ${newStatus === 'active' ? 'hiện' : 'ẩn'} đánh giá`);
      
      if (selectedRoom) {
        fetchReviewsByRoom(selectedRoom);
      } else {
        fetchReviews();
      }
    } catch (error) {
      console.error('Error updating review status:', error);
      message.error('Không thể cập nhật trạng thái đánh giá');
    }
  };

  const filteredData = reviews.filter(item =>
    item.comment?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.Room?.roomName?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.Customer?.customerName?.toLowerCase().includes(searchText.toLowerCase())
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
      title: 'Phòng',
      dataIndex: ['Room', 'roomName'],
      key: 'roomName',
      sorter: (a, b) => a.Room?.roomName?.localeCompare(b.Room?.roomName),
    },
    {
      title: 'Khách hàng',
      dataIndex: ['Customer', 'customerName'],
      key: 'customerName',
      sorter: (a, b) => a.Customer?.customerName?.localeCompare(b.Customer?.customerName),
    },
    {
      title: 'Đánh giá sao',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => <Rate disabled defaultValue={rating} />,
      sorter: (a, b) => a.rating - b.rating,
    },
    {
      title: 'Nhận xét',
      dataIndex: 'comment',
      key: 'comment',
      ellipsis: true,
      render: (comment) => comment || '-',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusDisplay = status === 'hidden' ? 'Đã ẩn' : 'Hiển thị';
        const color = status === 'hidden' ? 'red' : 'green';
        return <Tag color={color}>{statusDisplay}</Tag>;
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
            onClick={() => showViewModal(record.reviewId)}
          />
          {hasUpdatePermission && (
          <Button 
            type={record.status === 'hidden' ? 'default' : 'dashed'}
            icon={record.status === 'hidden' ? <EditOutlined /> : <EditOutlined />}
            size="small" 
            onClick={() => handleUpdateStatus(record.reviewId, record.status)}
          >
            {record.status === 'hidden' ? 'Hiển thị' : 'Ẩn'}
          </Button>
          )}
          {hasDeletePermission && (
          <Button 
            type="primary" 
            danger 
            icon={<DeleteOutlined />} 
            size="small" 
            onClick={() => showDeleteConfirm(record.reviewId, record.Room?.roomName)}
          />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="room-review-page">
      <Card
        title={
          <Space>
            <StarOutlined />
            <span>Quản lý đánh giá phòng</span>
          </Space>
        }
      >
        <div className="table-actions" style={{ marginBottom: 16 }}>
          <Space size="middle">
            <Select
              placeholder="Chọn phòng"
              style={{ width: 200 }}
              onChange={handleRoomFilter}
              value={selectedRoom || 'all'}
            >
              <Option value="all">Tất cả phòng</Option>
              {rooms.map(room => (
                <Option key={room.roomId} value={room.roomId}>{room.roomName}</Option>
              ))}
            </Select>
            <Input
              placeholder="Tìm kiếm theo tên khách hàng, nhận xét..."
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
          rowKey="reviewId"
          loading={loading || permissionLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} đánh giá`,
          }}
        />
      </Card>

      {/* Modal xem chi tiết đánh giá */}
      <Modal
        title="Chi tiết đánh giá"
        visible={isViewModalVisible}
        onCancel={handleViewCancel}
        footer={[
          <Button key="back" onClick={handleViewCancel}>
            Đóng
          </Button>,
        ]}
        width={700}
      >
        {currentReview && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Phòng">
              {currentReview.Room?.roomName || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Khách hàng">
              {currentReview.Customer?.customerName || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Email khách hàng">
              {currentReview.Customer?.email || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {currentReview.Customer?.phoneNumber || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Đánh giá">
              <Rate disabled value={currentReview.rating} />
            </Descriptions.Item>
            <Descriptions.Item label="Nhận xét">
              {currentReview.comment || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={currentReview.status === 'hidden' ? 'red' : 'green'}>
                {currentReview.status === 'hidden' ? 'Đã ẩn' : 'Hiển thị'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {new Date(currentReview.createdAt).toLocaleString('vi-VN')}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}

export default RoomReview; 