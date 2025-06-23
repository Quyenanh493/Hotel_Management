import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Card, Row, Col, notification, Modal, Spin, message } from 'antd';
import { ReloadOutlined, CreditCardOutlined, CommentOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { 
  getFactBookingHistory, 
  createPaymentUrl, 
  checkPaymentStatus, 
  queryTransactionStatus, 
  cancelBooking 
} from '../../services/bookingService';
import { checkCustomerReviewed, getRoomReviewsByCustomerId } from '../../services/roomReviewService';
import ReviewForm from '../../components/ReviewForm';
import './HistoryRoom.scss';

const { Title } = Typography;

function HistoryRoom() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  console.log("bookings",bookings);
  const [notiApi, contextHolder] = notification.useNotification();
  const [messageApi] = message.useMessage();
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [isVNPayModalVisible, setIsVNPayModalVisible] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [selectedTransactionCode, setSelectedTransactionCode] = useState(null);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentStatusInterval, setPaymentStatusInterval] = useState(null);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedRoomForReview, setSelectedRoomForReview] = useState(null);
  const [userReviews, setUserReviews] = useState({});

  const fetchBookingHistory = async () => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await getFactBookingHistory(userData.customerId);
      if (response && response.EC === 0) {
        setBookings(response.DT);
        
        // Kiểm tra đánh giá của người dùng sau khi lấy dữ liệu đặt phòng
        await checkUserReviews(userData.customerId, response.DT);
      } else {
        notiApi.error({
          message: 'Lỗi',
          description: response?.EM || 'Không thể tải lịch sử đặt phòng'
        });
      }
    } catch (error) {
      console.error('Lỗi khi tải lịch sử đặt phòng:', error);
      notiApi.error({
        message: 'Lỗi',
        description: 'Đã xảy ra lỗi khi tải lịch sử đặt phòng'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingHistory();
  }, []);

  // Thêm useEffect để debug dữ liệu booking
  useEffect(() => {
    if (bookings && bookings.length > 0) {
      console.log('Chi tiết booking đầu tiên:', bookings[0]);
      if (bookings[0].FactBookingDetails && bookings[0].FactBookingDetails.length > 0) {
        console.log('Chi tiết phòng:', bookings[0].FactBookingDetails[0]);
      }
    }
  }, [bookings]);

  // Hủy interval khi component unmount
  useEffect(() => {
    return () => {
      if (paymentStatusInterval) {
        clearInterval(paymentStatusInterval);
      }
    };
  }, [paymentStatusInterval]);

  // Kiểm tra trạng thái thanh toán
  const checkPaymentStatusHandler = async () => {
    if (!selectedBookingId) return;
    
    setCheckingPayment(true);
    try {
      // Sử dụng checkPaymentStatus và queryTransactionStatus để kiểm tra đa chiều
      const response = await checkPaymentStatus(selectedBookingId);
      
      if (response && response.EC === 0) {
        const payment = response.DT;
        setPaymentStatus(payment.statusPayment);
        
        // Nếu trạng thái vẫn là Pending và có mã giao dịch, thử sử dụng queryDr để kiểm tra
        if (payment.statusPayment === 'Pending' && payment.transactionCode) {
          setSelectedTransactionCode(payment.transactionCode);
          try {
            const queryResponse = await queryTransactionStatus(payment.transactionCode);
            if (queryResponse && queryResponse.EC === 0) {
              // Nếu kết quả từ queryDr là thanh toán thành công
              if (queryResponse.DT.status === 'Success') {
                // Cập nhật trạng thái từ kết quả queryDr
                setPaymentStatus('Paid');
                
                // Dừng kiểm tra và hiển thị thông báo
                clearInterval(paymentStatusInterval);
                notiApi.success({
                  message: 'Thanh toán thành công',
                  description: 'Cảm ơn bạn đã thanh toán!'
                });
                setIsVNPayModalVisible(false);
                // Cập nhật lại danh sách đặt phòng
                fetchBookingHistory();
                return;
              }
            }
          } catch (queryError) {
            console.warn('Lỗi khi truy vấn kết quả giao dịch:', queryError);
          }
        }
        
        if (payment.statusPayment === 'Paid') {
          // Thanh toán thành công, dừng kiểm tra và hiển thị thông báo
          clearInterval(paymentStatusInterval);
          notiApi.success({
            message: 'Thanh toán thành công',
            description: 'Cảm ơn bạn đã thanh toán!'
          });
          setIsVNPayModalVisible(false);
          // Cập nhật lại danh sách đặt phòng
          fetchBookingHistory();
        } else if (payment.statusPayment === 'Failed') {
          // Thanh toán thất bại, dừng kiểm tra và hiển thị thông báo
          clearInterval(paymentStatusInterval);
          notiApi.error({
            message: 'Thanh toán thất bại',
            description: 'Vui lòng thử lại hoặc liên hệ hỗ trợ.'
          });
        }
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra trạng thái thanh toán:', error);
    } finally {
      setCheckingPayment(false);
    }
  };

  const handlePayNow = async (bookingId) => {
    try {
      setSelectedBookingId(bookingId);
      setLoading(true);
      
      // Lấy địa chỉ IP
      let ipAddr = '127.0.0.1';
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        ipAddr = ipData.ip;
      } catch (error) {
        console.warn('Không thể lấy IP, sử dụng mặc định:', error);
      }
      
      // Tạo URL thanh toán
      const response = await createPaymentUrl(bookingId, ipAddr);
      
      if (response && response.EC === 0 && response.DT.paymentUrl) {
        setPaymentUrl(response.DT.paymentUrl);
        setIsVNPayModalVisible(true);
        
        // Thiết lập kiểm tra trạng thái thanh toán mỗi 5 giây
        const intervalId = setInterval(checkPaymentStatusHandler, 5000);
        setPaymentStatusInterval(intervalId);
      } else {
        notiApi.error({
          message: 'Lỗi thanh toán',
          description: 'Không thể tạo URL thanh toán. Vui lòng thử lại sau.'
        });
      }
    } catch (error) {
      console.error('Lỗi khi thanh toán:', error);
      notiApi.error({
        message: 'Lỗi thanh toán',
        description: 'Đã xảy ra lỗi khi xử lý thanh toán'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVNPayModalOk = () => {
    // Nếu đang kiểm tra thanh toán, không đóng modal ngay
    if (checkingPayment) return;
    
    // Nếu đã có kết quả thanh toán thì xử lý theo kết quả
    if (paymentStatus === 'Paid') {
      setIsVNPayModalVisible(false);
      fetchBookingHistory();
    } else {
      // Nếu chưa có kết quả, kiểm tra thủ công một lần
      checkPaymentStatusHandler();
      
      // Hiển thị thông báo cho người dùng
      notiApi.info({
        message: 'Đang kiểm tra thanh toán',
        description: 'Vui lòng đợi khi chúng tôi xác nhận trạng thái thanh toán của bạn.'
      });
    }
  };

  const handleVNPayModalCancel = () => {
    if (paymentStatusInterval) {
      clearInterval(paymentStatusInterval);
    }
    setIsVNPayModalVisible(false);
  };

  // Mở URL thanh toán trong cửa sổ mới
  const openPaymentUrl = () => {
    if (paymentUrl) {
      window.open(paymentUrl, '_blank');
    }
  };

  // Hàm hủy đặt phòng
  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await cancelBooking(bookingId);
      if (response && response.EC === 0) {
        messageApi.success('Hủy đặt phòng thành công');
        fetchBookingHistory();
      } else {
        messageApi.error(response?.EM || 'Không thể hủy đặt phòng');
      }
    } catch (error) {
      console.error('Lỗi khi hủy đặt phòng:', error);
      messageApi.error('Đã xảy ra lỗi khi hủy đặt phòng');
    }
  };

  // Hàm kiểm tra xem phòng có thể hủy không (ngày hiện tại < ngày check in)
  const canCancelBooking = (dateIn) => {
    const today = dayjs();
    const checkInDate = dayjs(dateIn);
    return today.isBefore(checkInDate);
  };

  // Thêm hàm kiểm tra đánh giá
  const checkUserReviews = async (customerId, bookings) => {
    try {
      if (!customerId) {
        console.warn('customerId không xác định khi kiểm tra đánh giá:', customerId);
        // Khởi tạo userReviews rỗng nếu không có customerId
        setUserReviews({});
        return;
      }
      
      // Khởi tạo reviewsInfo với tất cả roomId có trong booking = false (chưa đánh giá)
      const reviewsInfo = {};
      
      // Khởi tạo tất cả các phòng có trong booking là chưa đánh giá
      bookings.forEach(booking => {
        if (booking.FactBookingDetails && booking.FactBookingDetails.length > 0) {
          booking.FactBookingDetails.forEach(detail => {
            const roomId = detail.roomId;
            if (roomId) {
              reviewsInfo[roomId] = false; // Mặc định chưa đánh giá
            }
          });
        }
      });
      
      console.log('Khởi tạo reviewsInfo với tất cả roomId:', reviewsInfo);
      
      try {
        // Gọi API để lấy tất cả đánh giá của khách hàng
        const response = await getRoomReviewsByCustomerId(customerId);
        console.log('Kết quả đánh giá từ API:', response);
        
        if (response && response.EC === 0 && response.DT && Array.isArray(response.DT)) {
          const userReviews = response.DT;
          
          // Log tất cả đánh giá
          console.log('Tất cả đánh giá của người dùng:', userReviews);
          
          // Cập nhật trạng thái đã đánh giá cho các phòng có trong danh sách đánh giá
          userReviews.forEach(review => {
            const roomId = parseInt(review.roomId);
            if (reviewsInfo.hasOwnProperty(roomId)) {
              reviewsInfo[roomId] = true;
              console.log(`Đánh dấu phòng ${roomId} đã được đánh giá`);
            }
          });
        } else {
          console.log('Không có đánh giá nào từ API hoặc API trả về lỗi');
        }
      } catch (apiError) {
        console.error('Lỗi khi gọi API đánh giá:', apiError);
        // Giữ nguyên reviewsInfo với tất cả = false nếu API lỗi
      }
      
      console.log('Cập nhật trạng thái đánh giá cuối cùng:', reviewsInfo);
      setUserReviews(reviewsInfo);
    } catch (error) {
      console.error('Lỗi khi kiểm tra đánh giá:', error);
      // Nếu có lỗi, set tất cả là chưa đánh giá
      setUserReviews({});
    }
  };

  // Hàm mở modal đánh giá
  const handleOpenReview = (room) => {
    if (!room || !room.roomId) {
      console.error('Không có thông tin phòng để đánh giá');
      message.error('Không thể mở đánh giá: thiếu thông tin phòng');
      return;
    }
    
    console.log('Mở modal đánh giá cho phòng:', room);
    setSelectedRoomForReview(room);
    setReviewModalVisible(true);
  };

  // Hàm đóng modal đánh giá
  const handleCloseReview = () => {
    setReviewModalVisible(false);
    setSelectedRoomForReview(null);
  };

  // Hàm xử lý sau khi đánh giá thành công
  const handleReviewSuccess = async () => {
    console.log('Đánh giá thành công, đang cập nhật lại dữ liệu...');
    
    // Đóng modal đánh giá
    setReviewModalVisible(false);
    setSelectedRoomForReview(null);
    
    // Cập nhật lại trạng thái đánh giá của người dùng
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Fetch lại toàn bộ dữ liệu để đảm bảo đồng bộ
    await fetchBookingHistory();
    
    // Thông báo thành công
    messageApi.success('Đánh giá của bạn đã được ghi nhận!');
    
    console.log('Đã cập nhật lại dữ liệu sau khi đánh giá thành công');
  };

  // Hàm kiểm tra điều kiện để hiển thị nút đánh giá
  const canReviewBooking = (dateOut) => {
    // OPTION 1: Cho phép đánh giá ngay sau khi thanh toán thành công (RECOMMENDED)
    const ALLOW_IMMEDIATE_REVIEW = true;
    
    if (ALLOW_IMMEDIATE_REVIEW) {
      return true;
    }
    
    // OPTION 2: Chỉ cho phép đánh giá sau checkout (logic cũ)
    const today = dayjs();
    const checkoutDate = dayjs(dateOut);
    const canReview = today.isAfter(checkoutDate) || today.isSame(checkoutDate, 'day');
    
    console.log('Kiểm tra điều kiện đánh giá (sau checkout):', {
      dateOut: dateOut,
      today: today.format('YYYY-MM-DD'),
      checkoutDate: checkoutDate.format('YYYY-MM-DD'),
      isAfter: today.isAfter(checkoutDate),
      isSame: today.isSame(checkoutDate, 'day'),
      canReview: canReview
    });
    
    return canReview;
  };

  return (
    <div className="history-room">
      {contextHolder}
      
      <div className="history-room__header">
        <Title level={2}>Lịch sử đặt phòng</Title>
        <Button 
          type="primary" 
          icon={<ReloadOutlined />} 
          onClick={fetchBookingHistory}
          loading={loading}
        >
          Làm mới
        </Button>
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : bookings.length === 0 ? (
        <Card className="history-room__card">
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>Bạn chưa có lịch sử đặt phòng nào.</p>
            <Button type="primary" onClick={() => navigate('/room')}>
              Tìm phòng ngay
            </Button>
          </div>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {bookings.map((booking) => {
            // Tính tổng tiền từ các chi tiết đặt phòng nếu có
            let totalPrice = 0;
            let roomName = "Phòng Đơn"; // Mặc định
            let roomType = "Đơn"; // Mặc định
            
            // Sử dụng giá từ Payment trước (ưu tiên)
            if (booking.Payment) {
              totalPrice = Number(booking.Payment.amount || 0);
            }
            
            // Nếu không có Payment hoặc giá trị là 0, thử lấy từ FactBookingDetails
            if (totalPrice === 0 && booking.FactBookingDetails && booking.FactBookingDetails.length > 0) {
              booking.FactBookingDetails.forEach(detail => {
                if (detail.totalAmount) {
                  totalPrice += Number(detail.totalAmount || 0);
                }
                // Thông tin roomType dựa trên specialRate nếu có
                if (detail.specialRate) {
                  const rate = Number(detail.specialRate);
                  if (rate <= 1000000) roomType = "Standard";
                  else if (rate <= 2000000) roomType = "Deluxe";
                  else roomType = "Family";
                }
              });
            }
            
            // Nếu vẫn là 0, thử lấy tổng số ngày * số phòng * giá phòng 
            if (totalPrice === 0 && booking.dateIn && booking.dateOut) {
              const days = dayjs(booking.dateOut).diff(dayjs(booking.dateIn), 'day');
              const roomCount = booking.FactBookingDetails?.[0]?.roomCount || 1;
              const pricePerDay = booking.FactBookingDetails?.[0]?.specialRate || 1000000;
              totalPrice = days * roomCount * Number(pricePerDay);
            }
            
            // Kiểm tra trạng thái thanh toán
            const paymentStatus = booking.Payment?.statusPayment || 'Unpaid';
            const isPaid = paymentStatus === 'Paid';
            
            // Format the dates
            const dateIn = dayjs(booking.dateIn).format('DD-MM-YYYY');
            const dateOut = dayjs(booking.dateOut).format('DD-MM-YYYY');
            const orderDate = dayjs(booking.orderDate).format('DD-MM-YYYY');
            
            // Determine room type based on price or other criteria
            const displayRoomName = roomType === 'Standard' ? 'Phòng Đơn' : 
                                   roomType === 'Deluxe' ? 'Phòng Đôi' : 
                                   roomType === 'Family' ? 'Phòng Gia Đình' : roomName;
            
            return (
              <Col xs={24} md={12} lg={8} key={booking.bookingId}>
                <Card className="booking-card">
                  <Title level={4}>{displayRoomName}</Title>
                  <p className="price">{totalPrice.toLocaleString()} vnd</p>
                  
                  <div className="booking-details">
                    <div className="detail-row">
                      <span className="label">Ngày Vào:</span>
                      <span className="value">{dateIn}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Ngày Trả:</span>
                      <span className="value">{dateOut}</span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="label">Tổng:</span>
                      <span className="value bold">{totalPrice.toLocaleString()} vnd</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">ID Đơn:</span>
                      <span className="value">ORD_{booking.bookingId.toString().padStart(8, '0')}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Ngày Đặt:</span>
                      <span className="value">{orderDate}</span>
                    </div>
                  </div>
                  
                  <div className="booking-actions">
                    <Button
                      type="primary"
                      className={isPaid ? "paid-btn" : "pay-btn"}
                      disabled={isPaid}
                      onClick={isPaid ? undefined : () => handlePayNow(booking.bookingId)}
                    >
                      {isPaid ? "Đã Đặt" : "Đặt Lại"}
                    </Button>
                    
                    {!isPaid && canCancelBooking(booking.dateIn) && (
                      <Button 
                        danger
                        className="cancel-btn"
                        onClick={() => handleCancelBooking(booking.bookingId)}
                      >
                        Hủy Đặt Phòng
                      </Button>
                    )}
                    
                    {booking.FactBookingDetails && booking.FactBookingDetails.map(detail => {
                      // Lấy roomId từ detail.roomId thay vì detail.Room.roomId
                      const roomId = detail.roomId;
                      if (!roomId) return null;
                      
                      // Chỉ hiển thị nút đánh giá khi:
                      // 1. Đã thanh toán thành công
                      // 2. Được phép đánh giá (logic mới: luôn true nếu đã thanh toán)
                      const canReview = isPaid && canReviewBooking(booking.dateOut);
                      const hasReviewed = userReviews[roomId] === true; // Explicit check
                      
                      console.log(`🔍 FIXED DEBUG - BookingID: ${booking.bookingId}, RoomID: ${roomId}:`, {
                        isPaid,
                        canReview,
                        canReviewBooking: canReviewBooking(booking.dateOut),
                        hasReviewed,
                        userReviewsValue: userReviews[roomId],
                        allUserReviews: userReviews,
                        dateOut: booking.dateOut,
                        paymentStatus: booking.Payment?.statusPayment,
                        finalButtonState: {
                          show: isPaid,
                          enabled: canReview && !hasReviewed,
                          text: hasReviewed ? 'Đã đánh giá' : 'Đánh giá'
                        }
                      });
                      
                      // Chỉ hiển thị nút đánh giá nếu đã thanh toán
                      if (!isPaid) {
                        console.log(`Không hiển thị nút đánh giá cho room ${roomId} vì chưa thanh toán`);
                        return null;
                      }
                      
                      // Chuẩn bị dữ liệu room để truyền vào hàm handleOpenReview
                      const roomData = {
                        roomId: roomId,
                        roomName: displayRoomName,
                        specialRate: detail.specialRate,
                        totalAmount: detail.totalAmount
                      };
                      
                      const buttonText = hasReviewed ? 'Đã đánh giá' : 'Đánh giá';
                      const isButtonDisabled = !canReview || hasReviewed;
                      
                      console.log(`Nút ${buttonText} - Disabled: ${isButtonDisabled} (canReview: ${canReview}, hasReviewed: ${hasReviewed})`);
                      
                      return (
                        <Button
                          key={detail.bookingDetailId}
                          type="default"
                          icon={<CommentOutlined />}
                          className="history-room__review-btn"
                          onClick={() => handleOpenReview(roomData)}
                          disabled={isButtonDisabled}
                        >
                          {buttonText}
                        </Button>
                      );
                    })}
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
      
      {/* Modal thanh toán VNPay */}
      <Modal
        title="Thanh toán VNPay"
        open={isVNPayModalVisible}
        onOk={handleVNPayModalOk}
        onCancel={handleVNPayModalCancel}
        footer={[
          <Button key="back" onClick={handleVNPayModalCancel}>
            Đóng
          </Button>,
          <Button 
            key="check" 
            type="default" 
            loading={checkingPayment}
            onClick={checkPaymentStatusHandler}
          >
            Kiểm tra thanh toán
          </Button>,
          <Button 
            key="pay" 
            type="primary" 
            icon={<CreditCardOutlined />}
            onClick={openPaymentUrl}
          >
            Mở trang thanh toán
          </Button>,
        ]}
      >
        <p>Vui lòng click vào nút bên dưới để mở trang thanh toán VNPay.</p>
        <p>Sau khi thanh toán xong, hãy quay lại đây và kiểm tra trạng thái.</p>
        
        {checkingPayment && (
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <Spin />
            <p>Đang kiểm tra trạng thái thanh toán...</p>
          </div>
        )}
        
        {paymentStatus && (
          <div style={{ margin: '20px 0' }}>
            <p>
              <strong>Trạng thái thanh toán: </strong>
              {paymentStatus === 'Paid' ? (
                <span style={{ color: 'green' }}>Thành công</span>
              ) : paymentStatus === 'Failed' ? (
                <span style={{ color: 'red' }}>Thất bại</span>
              ) : (
                <span style={{ color: 'orange' }}>Đang xử lý</span>
              )}
            </p>
          </div>
        )}
      </Modal>
      
      {/* Review Modal */}
      {selectedRoomForReview && (
        <ReviewForm
          roomId={selectedRoomForReview.roomId}
          roomName={selectedRoomForReview.roomName}
          customerId={JSON.parse(localStorage.getItem('user') || '{}').customerId}
          visible={reviewModalVisible}
          onClose={handleCloseReview}
          onSuccess={handleReviewSuccess}
        />
      )}
    </div>
  );
}

export default HistoryRoom;