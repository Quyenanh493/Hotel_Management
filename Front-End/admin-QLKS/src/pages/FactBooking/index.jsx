import { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Card, Tag, Modal, message, Descriptions, DatePicker } from 'antd';
import { 
  SearchOutlined, 
  DeleteOutlined, 
  ExclamationCircleOutlined,
  EyeOutlined,
  BookOutlined,
  EditOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { getAllBookings, getBookingById, deleteBooking } from '../../services/factBookingService';
import { getBookingDetailsByBookingId } from '../../services/factBookingDetailService';
import dayjs from 'dayjs';
import './FactBooking.scss';
import { usePermissions } from '../../contexts/PermissionContext';

const { confirm } = Modal;
const { RangePicker } = DatePicker;

function FactBooking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [bookingDetails, setBookingDetails] = useState([]);
  const [dateRange, setDateRange] = useState(null);

  // Get permission utilities
  const { canCreate, canUpdate, canDelete, isLoading: permissionLoading } = usePermissions();
  const hasCreatePermission = canCreate('bookings');
  const hasUpdatePermission = canUpdate('bookings');
  const hasDeletePermission = canDelete('bookings');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await getAllBookings();
      if (response && response.DT) {
        setBookings(response.DT);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đơn đặt phòng:', error);
      message.error('Không thể tải danh sách đơn đặt phòng');
    } finally {
      setLoading(false);
    }
  };

  const showViewModal = async (bookingId) => {
    try {
      setLoading(true);
      const response = await getBookingById(bookingId);
      if (response && response.DT) {
        setCurrentBooking(response.DT);
        setIsViewModalVisible(true);
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin đơn đặt phòng:', error);
      message.error('Không thể tải thông tin chi tiết đơn đặt phòng');
    } finally {
      setLoading(false);
    }
  };

  const showDetailModal = async (bookingId) => {
    try {
      setLoading(true);
      // Lấy thông tin đơn đặt phòng
      const bookingResponse = await getBookingById(bookingId);
      if (bookingResponse && bookingResponse.DT) {
        setCurrentBooking(bookingResponse.DT);
      }

      // Lấy chi tiết đơn đặt phòng
      const detailResponse = await getBookingDetailsByBookingId(bookingId);
      if (detailResponse && detailResponse.DT) {
        setBookingDetails(detailResponse.DT);
      }

      setIsDetailModalVisible(true);
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết đơn đặt phòng:', error);
      message.error('Không thể tải chi tiết đơn đặt phòng');
    } finally {
      setLoading(false);
    }
  };

  const handleViewCancel = () => {
    setIsViewModalVisible(false);
    setCurrentBooking(null);
  };

  const handleDetailCancel = () => {
    setIsDetailModalVisible(false);
    setBookingDetails([]);
    setCurrentBooking(null);
  };

  const showDeleteConfirm = (bookingId) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa đơn đặt phòng này?',
      icon: <ExclamationCircleOutlined />,
      content: `Đơn đặt phòng: ${bookingId}`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deleteBooking(bookingId);
          message.success('Xóa đơn đặt phòng thành công');
          fetchBookings();
        } catch (error) {
          console.error('Lỗi khi xóa đơn đặt phòng:', error);
          message.error('Không thể xóa đơn đặt phòng');
        }
      },
    });
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const filteredData = bookings.filter(item => {
    let matchesSearch = true;
    let matchesDateRange = true;

    // Lọc theo từ khóa tìm kiếm
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      const customerName = item.Customer?.customerName?.toLowerCase() || '';
      const hotelName = item.Hotel?.hotelName?.toLowerCase() || '';
      const bookingIdStr = item.bookingId.toString();
      
      matchesSearch = customerName.includes(searchLower) ||
                      hotelName.includes(searchLower) ||
                      bookingIdStr.includes(searchLower);
    }

    // Lọc theo khoảng thời gian
    if (dateRange && dateRange[0] && dateRange[1]) {
      const dateIn = dayjs(item.dateIn);
      const startDate = dayjs(dateRange[0]);
      const endDate = dayjs(dateRange[1]);
      
      // Kiểm tra xem dateIn có nằm trong khoảng từ startDate đến endDate không
      // Sử dụng phương pháp so sánh trực tiếp thay vì hàm isBetween
      matchesDateRange = (dateIn.isAfter(startDate) || dateIn.isSame(startDate, 'day')) && 
                         (dateIn.isBefore(endDate) || dateIn.isSame(endDate, 'day'));
    }

    return matchesSearch && matchesDateRange;
  });

  // Format số tiền thành tiền Việt Nam
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Format ngày tháng
  const formatDate = (dateString) => {
    return dayjs(dateString).format('DD/MM/YYYY HH:mm');
  };

  // Xác định trạng thái thanh toán
  const getPaymentStatus = (booking) => {
    const paymentStatus = booking.Payment?.statusPayment || 'Unpaid';
    
    switch (paymentStatus.toLowerCase()) {
      case 'paid':
        return <Tag color="green">Đã thanh toán</Tag>;
      case 'pending':
        return <Tag color="orange">Đang xử lý</Tag>;
      case 'canceled':
        return <Tag color="red">Đã hủy</Tag>;
      default:
        return <Tag color="red">Chưa thanh toán</Tag>;
    }
  };

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'bookingId',
      key: 'bookingId',
      sorter: (a, b) => a.bookingId - b.bookingId,
    },
    {
      title: 'Khách hàng',
      dataIndex: ['Customer', 'customerName'],
      key: 'customerName',
      sorter: (a, b) => a.Customer?.customerName?.localeCompare(b.Customer?.customerName),
    },
    {
      title: 'Khách sạn',
      dataIndex: ['Hotel', 'hotelName'],
      key: 'hotelName',
      sorter: (a, b) => a.Hotel?.hotelName?.localeCompare(b.Hotel?.hotelName),
    },
    {
      title: 'Ngày check-in',
      dataIndex: 'dateIn',
      key: 'dateIn',
      render: (dateIn) => formatDate(dateIn),
      sorter: (a, b) => new Date(a.dateIn) - new Date(b.dateIn),
    },
    {
      title: 'Ngày check-out',
      dataIndex: 'dateOut',
      key: 'dateOut',
      render: (dateOut) => formatDate(dateOut),
      sorter: (a, b) => new Date(a.dateOut) - new Date(b.dateOut),
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (orderDate) => formatDate(orderDate),
      sorter: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
    },
    {
      title: 'Trạng thái',
      key: 'paymentStatus',
      render: (_, record) => getPaymentStatus(record),
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
            onClick={() => showViewModal(record.bookingId)}
          />
          {hasUpdatePermission && (
          <Button 
            type="default" 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => showDetailModal(record.bookingId)}
          />
          )}
          {hasDeletePermission && (
          <Button 
            type="primary" 
            danger 
            icon={<DeleteOutlined />} 
            size="small" 
            onClick={() => showDeleteConfirm(record.bookingId)}
          />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="factbooking-page">
      <Card
        title={
          <Space>
            <BookOutlined />
            <span>Quản lý đơn đặt phòng</span>
          </Space>
        }
      >
        <div className="table-actions" style={{ marginBottom: 16 }}>
          <Space size="middle" style={{ marginBottom: 16 }}>
            <Input
              placeholder="Tìm kiếm theo khách hàng, khách sạn..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={handleSearch}
              style={{ width: 300 }}
            />
            <RangePicker 
              placeholder={["Từ ngày", "Đến ngày"]} 
              onChange={handleDateRangeChange}
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
          rowKey="bookingId"
          loading={loading || permissionLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} đơn đặt phòng`,
          }}
        />
      </Card>

      {/* Modal xem thông tin đơn đặt phòng */}
      <Modal
        title="Thông tin đơn đặt phòng"
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
                showDetailModal(currentBooking.bookingId);
              }}
            >
              Chỉnh sửa
            </Button>
          ),
        ].filter(Boolean)}
        width={700}
      >
        {currentBooking && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Mã đơn đặt phòng">{currentBooking.bookingId}</Descriptions.Item>
            <Descriptions.Item label="Khách hàng">{currentBooking.Customer?.customerName}</Descriptions.Item>
            <Descriptions.Item label="Email">{currentBooking.Customer?.email}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{currentBooking.Customer?.phoneNumber}</Descriptions.Item>
            <Descriptions.Item label="Khách sạn">{currentBooking.Hotel?.hotelName}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ khách sạn">{currentBooking.Hotel?.address}</Descriptions.Item>
            <Descriptions.Item label="Ngày check-in">{formatDate(currentBooking.dateIn)}</Descriptions.Item>
            <Descriptions.Item label="Ngày check-out">{formatDate(currentBooking.dateOut)}</Descriptions.Item>
            <Descriptions.Item label="Ngày đặt phòng">{formatDate(currentBooking.orderDate)}</Descriptions.Item>
            <Descriptions.Item label="Tổng số tiền">
              {formatCurrency(currentBooking.Payment?.amount || 0)}
            </Descriptions.Item>
            <Descriptions.Item label="Phương thức thanh toán">
              {currentBooking.Payment?.paymentMethod === 'Cash' ? 'Tiền mặt' : 
               currentBooking.Payment?.paymentMethod === 'CreditCard' ? 'Thẻ tín dụng' :
               currentBooking.Payment?.paymentMethod === 'BankTransfer' ? 'Chuyển khoản' :
               currentBooking.Payment?.paymentMethod === 'VNPay' ? 'VNPay' : 'Chưa xác định'}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái thanh toán">
              {getPaymentStatus(currentBooking)}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Modal xem chi tiết đơn đặt phòng */}
      <Modal
        title="Chi tiết đơn đặt phòng"
        visible={isDetailModalVisible}
        onCancel={handleDetailCancel}
        footer={[
          <Button key="back" onClick={handleDetailCancel}>
            Đóng
          </Button>,
        ]}
        width={800}
      >
        {currentBooking && (
          <>
            <div className="booking-header" style={{ marginBottom: '20px' }}>
              <h3>Đơn đặt phòng: #{currentBooking.bookingId}</h3>
              <p>
                <strong>Khách hàng:</strong> {currentBooking.Customer?.customerName} | 
                <strong> Khách sạn:</strong> {currentBooking.Hotel?.hotelName} |
                <strong> Ngày đặt:</strong> {formatDate(currentBooking.orderDate)}
              </p>
              <p>
                <strong>Check-in:</strong> {formatDate(currentBooking.dateIn)} | 
                <strong> Check-out:</strong> {formatDate(currentBooking.dateOut)}
              </p>
            </div>

            <Table
              dataSource={bookingDetails}
              rowKey="bookingDetailId"
              pagination={false}
              columns={[
                {
                  title: 'Phòng',
                  dataIndex: ['Room', 'roomName'],
                  key: 'roomName',
                },
                {
                  title: 'Loại phòng',
                  dataIndex: ['Room', 'roomType'],
                  key: 'roomType',
                },
                {
                  title: 'Số lượng',
                  dataIndex: 'roomCount',
                  key: 'roomCount',
                },
                {
                  title: 'Người lớn',
                  dataIndex: 'adultCount',
                  key: 'adultCount',
                },
                {
                  title: 'Trẻ em',
                  dataIndex: 'childrenCount',
                  key: 'childrenCount',
                },
                {
                  title: 'Đơn giá',
                  dataIndex: 'specialRate',
                  key: 'specialRate',
                  render: (price) => formatCurrency(price),
                },
                {
                  title: 'Thành tiền',
                  dataIndex: 'totalAmount',
                  key: 'totalAmount',
                  render: (amount) => formatCurrency(amount),
                },
              ]}
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={6}>
                    <strong>Tổng cộng</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <strong>
                      {formatCurrency(
                        bookingDetails.reduce((sum, item) => sum + parseFloat(item.totalAmount || 0), 0)
                      )}
                    </strong>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            />

            {bookingDetails.some(detail => detail.specialRequests) && (
              <div style={{ marginTop: '20px' }}>
                <h3>Yêu cầu đặc biệt</h3>
                {bookingDetails
                  .filter(detail => detail.specialRequests)
                  .map(detail => (
                    <p key={detail.bookingDetailId}>
                      <strong>{detail.Room?.roomName}:</strong> {detail.specialRequests}
                    </p>
                  ))
                }
              </div>
            )}
          </>
        )}
      </Modal>
    </div>
  );
}

export default FactBooking;