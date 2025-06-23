import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Result, Typography, Card, Descriptions, Button, Divider, Spin } from 'antd';
import { CheckCircleOutlined, HomeOutlined, HistoryOutlined, PrinterOutlined } from '@ant-design/icons';
import './PaymentSuccess.scss';
import { getFactBookingHistory } from '../../services/bookingService';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState(null);
  
  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('orderId');
  const amount = queryParams.get('amount');
  
  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }
      
      try {
        // Fetch booking history to get details about this order
        const response = await getFactBookingHistory();
        
        if (response && response.EC === 0 && response.DT) {
          // Find the booking that matches this order ID
          const booking = response.DT.find(b => b.bookingId === parseInt(orderId));
          if (booking) {
            setBookingDetails(booking);
          }
        }
      } catch (error) {
        console.error('Error fetching booking details:', error);
        
        // Xử lý lỗi 401 - Unauthorized
        if (error.response && error.response.status === 401) {
          // Hiển thị thông báo lỗi nhưng vẫn hiển thị thông tin đơn hàng cơ bản
          console.log('Authentication error. Will show limited booking info.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookingDetails();
  }, [orderId]);
  
  const handlePrint = () => {
    window.print();
  };
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };
  
  return (
    <div className="payment-success-container">
      <Card className="payment-result-card">
        <Result
          status="success"
          icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
          title="THANH TOÁN THÀNH CÔNG"
          subTitle={
            <div>
              <p>Mã đơn: #{orderId}</p>
              <p>Tổng tiền: {formatCurrency(amount || 0)}</p>
              <p>Kiểu thanh toán: Online</p>
            </div>
          }
        />
        
        <Divider />
        
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
            <Text>Đang tải thông tin đặt phòng...</Text>
          </div>
        ) : bookingDetails ? (
          <div className="booking-details">
            <Title level={4}>Chi tiết đặt phòng</Title>
            
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Khách hàng">{bookingDetails.Customer?.customerName || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{bookingDetails.Customer?.phoneNumber || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Email">{bookingDetails.Customer?.email || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Ngày nhận phòng">
                {bookingDetails.dateIn ? dayjs(bookingDetails.dateIn).format('DD/MM/YYYY') : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày trả phòng">
                {bookingDetails.dateOut ? dayjs(bookingDetails.dateOut).format('DD/MM/YYYY') : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền">
                {bookingDetails.Payment ? formatCurrency(bookingDetails.Payment.amount) : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái thanh toán">
                <Text type="success" strong>Đã thanh toán</Text>
              </Descriptions.Item>
            </Descriptions>
            
          </div>
        ) : (
          <Paragraph>
            Không tìm thấy thông tin chi tiết đặt phòng. Vui lòng kiểm tra lại mã đơn hàng hoặc liên hệ với chúng tôi.
          </Paragraph>
        )}
        
        <Divider />
        
        <div className="action-buttons">
          <Button type="primary" icon={<HomeOutlined />} onClick={() => navigate('/')}>
            Trang chủ
          </Button>
          <Button icon={<HistoryOutlined />} onClick={() => navigate('/history-room')}>
            Lịch sử đặt phòng
          </Button>
          <Button icon={<PrinterOutlined />} onClick={handlePrint}>
            In hóa đơn
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default PaymentSuccess; 