import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, Row, Col, Form, Input, DatePicker, Button, Typography, Divider, Select, notification, List, Modal, Spin, Result } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import './BookingConfirmation.scss';
import { setBookingInfo, resetBooking, addAmenity } from '../../redux/booking/bookingSlice';
import { getRoomDetails, createBooking, createPaymentUrl, checkPaymentStatus } from '../../services/bookingService';

const { Title, Text } = Typography;
const { Option } = Select;

function BookingConfirmation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [isRoomDetailsFetched, setIsRoomDetailsFetched] = useState(false);
  const [locationState, setLocationState] = useState(null);
  const [notiApi, contextHolder] = notification.useNotification();
  const [roomAmenities, setRoomAmenities] = useState([]);
  const [bookingId, setBookingId] = useState(null);
  const [paymentStatusInterval, setPaymentStatusInterval] = useState(null);

  const bookingInfo = useSelector((state) => state.booking.bookingInfo);
  const selectedAmenities = useSelector((state) => state.booking.selectedAmenities);

  const userData = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch (error) {
      console.error('Error parsing user data:', error);
      return {};
    }
  }, []);

  const fetchRoomDetails = async (roomId, checkInDate, checkOutDate, daysCount, adults, children, roomCount) => {
    try {
      setLoading(true);
      const response = await getRoomDetails(roomId);
      if (response && response.DT) {
        const roomData = response.DT;
        
        if (roomData.Amenities && Array.isArray(roomData.Amenities)) {
          setRoomAmenities(roomData.Amenities);
          roomData.Amenities.forEach(amenity => {
            const isAlreadyAdded = selectedAmenities.some(item => item.id === amenity.amenitiesId);
            if (!isAlreadyAdded) {
              dispatch(addAmenity({
                id: amenity.amenitiesId,
                name: amenity.amenitiesName,
                price: amenity.price || 0,
                quantity: 1,
                isIncluded: true
              }));
            }
          });
        }
        
        let amenitiesTotal = roomData.Amenities ? 
          roomCount * daysCount * roomData.Amenities.reduce((total, item) => total + Number(item.price || 0), 0) : 0;
        
        const totalAmount = roomCount * daysCount * (Number(roomData.price) || 0) + Number(amenitiesTotal);
        
        dispatch(setBookingInfo({
          roomId: roomData.roomId,
          roomName: roomData.roomName,
          roomImage: roomData.roomImage || '',
          roomPrice: Number(roomData.price) || 0,
          checkInDate: dayjs(checkInDate).format('YYYY-MM-DD'),
          checkOutDate: dayjs(checkOutDate).format('YYYY-MM-DD'),
          daysCount: daysCount,
          roomCount: Number(roomCount),
          adultCount: Number(adults),
          childrenCount: Number(children),
          totalAmount: totalAmount,
          hotelInfo: roomData.Hotel || null,
          customerName: userData.customerName || userData.name || '',
          phoneNumber: userData.phoneNumber || userData.phone || '',
        }));
        
        form.setFieldsValue({
          customerName: userData.customerName || userData.name || '',
          phoneNumber: userData.phoneNumber || userData.phone || '',
        });
        
        setIsRoomDetailsFetched(true);
      } else {
        throw new Error('Không tìm thấy thông tin phòng');
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin phòng:', error);
      notiApi.error({
        message: 'Lỗi',
        description: 'Không thể tải thông tin phòng. Vui lòng thử lại.'
      });
      navigate('/room');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadBookingState = () => {
      if (location.state) {
        localStorage.setItem('bookingState', JSON.stringify(location.state));
        setLocationState(location.state);
      } else {
        const savedState = JSON.parse(localStorage.getItem('bookingState') || '{}');
        if (savedState.roomId && savedState.dateIn && savedState.dateOut) {
          setLocationState(savedState);
        } else {
          notiApi.error({
            message: 'Lỗi',
            description: 'Không tìm thấy thông tin đặt phòng.'
          });
          navigate('/room');
        }
      }
    };

    loadBookingState();
  }, [location.state, navigate, notiApi]);

  useEffect(() => {
    if (!locationState) return;

    const { dateIn, dateOut, adults, children, roomCount, roomId } = locationState;
    if (!roomId || !dateIn || !dateOut) {
      notiApi.error({
        message: 'Lỗi',
        description: 'Thiếu thông tin đặt phòng. Vui lòng thử lại.'
      });
      navigate('/room');
      return;
    }

    const checkInDate = dayjs(dateIn);
    const checkOutDate = dayjs(dateOut);
    if (!checkInDate.isValid() || !checkOutDate.isValid() || checkOutDate.isBefore(checkInDate)) {
      notiApi.error({
        message: 'Lỗi',
        description: 'Ngày nhận hoặc trả phòng không hợp lệ.'
      });
      navigate('/room');
      return;
    }
    const daysCount = checkOutDate.diff(checkInDate, 'day');
    if (daysCount <= 0) {
      notiApi.error({
        message: 'Lỗi',
        description: 'Số ngày đặt phòng phải lớn hơn 0.'
      });
      navigate('/room');
      return;
    }

    fetchRoomDetails(roomId, dateIn, dateOut, daysCount, adults, children, roomCount);
  }, [locationState, navigate, notiApi, userData, form, dispatch, selectedAmenities]);

  const calculateTotalAmount = () => {
    const roomTotal = (bookingInfo.roomPrice || 0) * (bookingInfo.daysCount || 1) * (bookingInfo.roomCount || 1);
    const additionalAmenitiesTotal = bookingInfo.roomCount * bookingInfo.daysCount * selectedAmenities
      .filter(item => !item.isIncluded)
      .reduce((total, item) => total + Number(item.price || 0), 0);
    const includedAmenitiesTotal = bookingInfo.roomCount * bookingInfo.daysCount * selectedAmenities
      .filter(item => item.isIncluded)
      .reduce((total, item) => total + Number(item.price || 0), 0);
    
    return roomTotal + additionalAmenitiesTotal + includedAmenitiesTotal;
  };

  const handleDateChange = (field, date) => {
    if (!date) return;

    const formattedDate = date.format('YYYY-MM-DD');
    const currentCheckInDate = dayjs(bookingInfo.checkInDate);
    const currentCheckOutDate = dayjs(bookingInfo.checkOutDate);

    if (field === 'checkInDate') {
      if (dayjs(formattedDate).isAfter(currentCheckOutDate) || dayjs(formattedDate).isBefore(dayjs().startOf('day'))) {
        notiApi.warning({
          message: 'Lỗi',
          description: 'Ngày nhận phòng phải trước ngày trả phòng và không trong quá khứ.'
        });
        return;
      }

      const daysCount = currentCheckOutDate.diff(dayjs(formattedDate), 'day');
      dispatch(setBookingInfo({
        ...bookingInfo,
        checkInDate: formattedDate,
        daysCount: daysCount > 0 ? daysCount : 1,
        totalAmount: calculateTotalAmount()
      }));
    } else if (field === 'checkOutDate') {
      if (dayjs(formattedDate).isBefore(currentCheckInDate) || dayjs(formattedDate).isSame(currentCheckInDate)) {
        notiApi.warning({
          message: 'Lỗi',
          description: 'Ngày trả phòng phải sau ngày nhận phòng ít nhất 1 ngày.'
        });
        return;
      }

      const daysCount = dayjs(formattedDate).diff(currentCheckInDate, 'day');
      dispatch(setBookingInfo({
        ...bookingInfo,
        checkOutDate: formattedDate,
        daysCount: daysCount > 0 ? daysCount : 1,
        totalAmount: calculateTotalAmount()
      }));
    }
  };

  const handleBookNow = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      dispatch(setBookingInfo({
        customerName: values.customerName,
        phoneNumber: values.phoneNumber,
        specialRequests: values.specialRequests,
        paymentMethod: values.paymentMethod,
        totalAmount: calculateTotalAmount()
      }));

      // Chuẩn bị dữ liệu đặt phòng
      const bookingData = {
        customerId: userData.customerId,
        hotelId: bookingInfo.hotelInfo?.hotelId || 1,
        paymentMethod: values.paymentMethod,
        rooms: [{
          roomId: bookingInfo.roomId,
          roomCount: bookingInfo.roomCount || 0,
          adultCount: bookingInfo.adultCount || 0,
          childrenCount: bookingInfo.childrenCount || 0,
          specialRequests: values.specialRequests || "khong yeu cau",
          amenities: selectedAmenities.map(item => ({
            amenitiesId: item.id,
            quantity: bookingInfo.roomCount
          }))
        }],
        dateIn: bookingInfo.checkInDate,
        dateOut: bookingInfo.checkOutDate
      };

      console.log("bookingData", bookingData);

      // Lấy địa chỉ IP của client
      let ipAddr = '127.0.0.1'; // Mặc định localhost
      try {
        const ipResponse = await axios.get('https://api.ipify.org?format=json');
        ipAddr = ipResponse.data.ip;
      } catch (error) {
        console.warn('Không thể lấy IP client, sử dụng IP mặc định:', error);
      }

      // Gửi yêu cầu đặt phòng
      const response = await createBooking(bookingData);
      console.log("response", response);
      
      if (response && response.EC === 0) {
        // Lưu bookingId để sử dụng sau này
        const newBookingId = response.DT.bookingId;
        console.log("newBookingId", newBookingId);
        setBookingId(newBookingId);
        
        if (values.paymentMethod === 'VNPay') {
          // Tạo URL thanh toán VNPay
          const paymentResponse = await createPaymentUrl(newBookingId, ipAddr);
          
          if (paymentResponse && paymentResponse.EC === 0 && paymentResponse.DT.paymentUrl) {
            // Lưu URL thanh toán
            const paymentUrlFromResponse = paymentResponse.DT.paymentUrl;
            
            // Hiển thị thông báo chuyển hướng
            notiApi.info({
              message: 'Chuyển hướng đến trang thanh toán',
              description: 'Bạn đang được chuyển đến trang thanh toán VNPay...',
              duration: 2
            });
            
            // Thiết lập interval kiểm tra trạng thái thanh toán
            const intervalId = setInterval(() => {
              checkPaymentStatus(newBookingId)
                .then(response => {
                  if (response && response.EC === 0) {
                    const payment = response.DT;
                    
                    if (payment.statusPayment === 'Paid') {
                      // Thanh toán thành công, dừng kiểm tra
                      clearInterval(intervalId);
                      
                      // Hiển thị thông báo thành công (nếu người dùng quay lại trang)
                      notiApi.success({
                        message: 'Thanh toán thành công',
                        description: 'Cảm ơn bạn đã đặt phòng và thanh toán!'
                      });
                      
                      // Lưu thông tin vào localStorage để có thể xử lý khi người dùng quay lại
                      localStorage.setItem('payment_status', JSON.stringify({
                        bookingId: newBookingId,
                        status: 'Paid',
                        amount: calculateTotalAmount()
                      }));
                      
                      // Nếu người dùng đang ở trang này, chuyển hướng đến trang thành công
                      if (document.visibilityState === 'visible') {
                        navigate(`/payment/success?orderId=${newBookingId}&amount=${calculateTotalAmount()}`);
                      }
                    } else if (payment.statusPayment === 'Failed') {
                      // Thanh toán thất bại, dừng kiểm tra
                      clearInterval(intervalId);
                      
                      // Lưu thông tin vào localStorage
                      localStorage.setItem('payment_status', JSON.stringify({
                        bookingId: newBookingId,
                        status: 'Failed'
                      }));
                      
                      // Nếu người dùng đang ở trang này, chuyển hướng đến trang thất bại
                      if (document.visibilityState === 'visible') {
                        navigate(`/payment/failed?error=Giao dịch không thành công&code=99`);
                      }
                    }
                  }
                })
                .catch(error => {
                  console.error('Lỗi khi kiểm tra trạng thái thanh toán:', error);
                });
            }, 5000); // Kiểm tra mỗi 5 giây
            
            // Lưu interval ID để có thể xóa khi cần
            setPaymentStatusInterval(intervalId);
            
            // Thiết lập event listener để xử lý khi tab được kích hoạt lại
            const handleVisibilityChange = () => {
              if (document.visibilityState === 'visible') {
                // Kiểm tra xem có thông tin thanh toán trong localStorage không
                const paymentStatus = JSON.parse(localStorage.getItem('payment_status') || '{}');
                if (paymentStatus.bookingId === newBookingId) {
                  if (paymentStatus.status === 'Paid') {
                    navigate(`/payment/success?orderId=${newBookingId}&amount=${paymentStatus.amount}`);
                  } else if (paymentStatus.status === 'Failed') {
                    navigate(`/payment/failed?error=Giao dịch không thành công&code=99`);
                  }
                  // Xóa thông tin thanh toán sau khi đã xử lý
                  localStorage.removeItem('payment_status');
                }
                
                // Kiểm tra trạng thái thanh toán ngay lập tức khi tab được kích hoạt lại
                checkPaymentStatus(newBookingId)
                  .then(response => {
                    if (response && response.EC === 0) {
                      const payment = response.DT;
                      if (payment.statusPayment === 'Paid') {
                        clearInterval(intervalId);
                        navigate(`/payment/success?orderId=${newBookingId}&amount=${calculateTotalAmount()}`);
                      } else if (payment.statusPayment === 'Failed') {
                        clearInterval(intervalId);
                        navigate(`/payment/failed?error=Giao dịch không thành công&code=99`);
                      }
                    }
                  })
                  .catch(error => {
                    console.error('Lỗi khi kiểm tra trạng thái thanh toán:', error);
                  });
              }
            };
            
            // Đăng ký sự kiện visibility change
            document.addEventListener('visibilitychange', handleVisibilityChange);
            
            // Cleanup function để xóa event listener và interval khi component unmount
            const cleanup = () => {
              document.removeEventListener('visibilitychange', handleVisibilityChange);
              clearInterval(intervalId);
            };
            
            // Thêm cleanup vào unload để đảm bảo dọn dẹp khi người dùng rời trang
            window.addEventListener('unload', cleanup);
            
            // Chuyển hướng trực tiếp đến trang thanh toán VNPay
            window.location.href = paymentUrlFromResponse;
          } else {
            notiApi.error({
              message: 'Lỗi thanh toán',
              description: 'Không thể tạo URL thanh toán. Vui lòng thử lại hoặc chọn phương thức khác.'
            });
          }
        } else {
          // Phương thức thanh toán khác
          notiApi.success({
            message: 'Đặt phòng thành công',
            description: 'Đơn đặt phòng của bạn đã được ghi nhận. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!'
          });
          dispatch(resetBooking());
          setTimeout(() => {
            navigate('/history-room');
          }, 2000);
        }
      } else {
        notiApi.error({
          message: 'Đặt phòng thất bại',
          description: response?.EM || 'Có lỗi xảy ra khi đặt phòng. Vui lòng kiểm tra thông tin và thử lại sau!'
        });
      }
    } catch (error) {
      console.error('Lỗi khi đặt phòng:', error);
      
      // Xử lý các loại lỗi khác nhau
      let errorMessage = 'Có lỗi xảy ra khi đặt phòng. Vui lòng thử lại sau!';
      
      if (error.response) {
        // Lỗi từ server
        const { status } = error.response;
        if (status === 401) {
          errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        } else if (status === 400) {
          errorMessage = 'Thông tin đặt phòng không hợp lệ. Vui lòng kiểm tra lại.';
        } else if (status === 409) {
          errorMessage = 'Phòng đã được đặt bởi khách hàng khác. Vui lòng chọn phòng khác.';
        } else if (status >= 500) {
          errorMessage = 'Hệ thống đang bảo trì. Vui lòng thử lại sau ít phút.';
        }
      } else if (error.request) {
        errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet.';
      }
      
      notiApi.error({
        message: 'Đặt phòng thất bại',
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  // Hủy interval khi component unmount
  useEffect(() => {
    return () => {
      if (paymentStatusInterval) {
        clearInterval(paymentStatusInterval);
      }
    };
  }, [paymentStatusInterval]);

  // Kiểm tra trạng thái thanh toán khi quay lại từ trang VNPay
  useEffect(() => {
    const checkPaymentOnReturn = async () => {
      // Kiểm tra xem có phải đang trở lại từ VNPay không
      const paymentStatus = JSON.parse(localStorage.getItem('payment_status') || '{}');
      if (paymentStatus.bookingId) {
        try {
          const response = await checkPaymentStatus(paymentStatus.bookingId);
          if (response && response.EC === 0) {
            const payment = response.DT;
            if (payment.statusPayment === 'Paid') {
              navigate(`/payment/success?orderId=${paymentStatus.bookingId}&amount=${paymentStatus.amount || 0}`);
            } else if (payment.statusPayment === 'Failed') {
              navigate(`/payment/failed?error=Giao dịch không thành công&code=99`);
            }
          }
        } catch (error) {
          console.error('Lỗi khi kiểm tra trạng thái thanh toán:', error);
        } finally {
          localStorage.removeItem('payment_status');
        }
      }
    };
    
    checkPaymentOnReturn();
  }, [navigate]);

  const goToAmenities = () => {
    navigate('/booking-amenities');
  };

  if (loading || !bookingInfo.roomId) {
    return (
      <div className="booking-confirmation">
        {contextHolder}
        <Title level={1} className="booking-confirmation__title">XÁC NHẬN ĐẶT PHÒNG</Title>
        <Text>Đang tải thông tin đặt phòng...</Text>
      </div>
    );
  }

  // Kiểm tra thông tin đặt phòng hợp lệ
  if (!bookingInfo.roomId || !bookingInfo.checkInDate || !bookingInfo.checkOutDate) {
    return (
      <div className="booking-confirmation">
        {contextHolder}
        <Result
          status="warning"
          title="Thông tin đặt phòng không hợp lệ"
          subTitle="Vui lòng chọn phòng và nhập thông tin đặt phòng chính xác."
          extra={
            <Button type="primary" onClick={() => navigate('/room')}>
              Quay lại trang tìm phòng
            </Button>
          }
        />
      </div>
    );
  }

  const includedAmenities = selectedAmenities.filter(item => item.isIncluded);
  const additionalAmenities = selectedAmenities.filter(item => !item.isIncluded);

  return (
    <div className="booking-confirmation">
      {contextHolder}
      <Title level={1} className="booking-confirmation__title">XÁC NHẬN ĐẶT PHÒNG</Title>
      <div className="booking-confirmation__breadcrumb">
        <span>TRANG CHỦ</span> &gt; <span>PHÒNG</span> &gt; <span>XÁC NHẬN</span>
      </div>

      <Row gutter={[24, 24]} className="booking-confirmation__content">
        <Col xs={24} md={12}>
          <Card className="booking-confirmation__room-card">
            <div className="booking-confirmation__room-image">
              <img
                src={bookingInfo.roomImage}
                alt={bookingInfo.roomName || 'Phòng'}
              />
            </div>
            <div className="booking-confirmation__room-info">
              <h2 className="booking-confirmation__room-name">{bookingInfo.roomName || 'Phòng Bình Dân'}</h2>
              <p className="booking-confirmation__room-price">
                {bookingInfo.roomPrice ? Number(bookingInfo.roomPrice).toLocaleString() : '800,000'} vnđ
              </p>
              {bookingInfo.hotelInfo && (
                <p className="booking-confirmation__hotel-name">
                  <strong>Khách sạn:</strong> {bookingInfo.hotelInfo.hotelName}
                </p>
              )}
              <p className="booking-confirmation__room-description">
                {bookingInfo.description || 'Phòng tiêu chuẩn với đầy đủ tiện nghi cơ bản.'}
              </p>
            </div>

            {includedAmenities.length > 0 && (
              <div className="booking-confirmation__amenities booking-confirmation__included-amenities">
                <h3>Tiện nghi có sẵn của phòng:</h3>
                <List
                  itemLayout="horizontal"
                  dataSource={includedAmenities}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        title={item.name}
                        description={`${Number(item.price || 0).toLocaleString()} vnđ`}
                      />
                    </List.Item>
                  )}
                />
              </div>
            )}

            {additionalAmenities.length > 0 && (
              <div className="booking-confirmation__amenities booking-confirmation__additional-amenities">
                <h3>Tiện nghi bổ sung đã chọn:</h3>
                <List
                  itemLayout="horizontal"
                  dataSource={additionalAmenities}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        title={item.name}
                        description={`${Number(item.price || 0).toLocaleString()} vnđ`}
                      />
                    </List.Item>
                  )}
                />
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card className="booking-confirmation__details-card">
            <Title level={3}>CHI TIẾT PHÒNG ĐẶT</Title>

            <Form form={form} layout="vertical" className="booking-confirmation__form">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="customerName"
                    label="Tên"
                    rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="phoneNumber"
                    label="Số Điện Thoại"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="specialRequests" label="Yêu cầu đặc biệt">
                <Input.TextArea rows={3} placeholder="Nhập yêu cầu đặc biệt nếu có" />
              </Form.Item>

              <Form.Item
                name="paymentMethod"
                label="Phương thức thanh toán"
                rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán!' }]}
                initialValue="VNPay"
              >
                <Select>
                  <Option value="Cash">Tiền mặt</Option>
                  <Option value="CreditCard">Thẻ tín dụng</Option>
                  <Option value="BankTransfer">Chuyển khoản ngân hàng</Option>
                  <Option value="VNPay">VNPay (Quét mã QR)</Option>
                </Select>
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Ngày Nhận Phòng">
                    <DatePicker
                      value={dayjs(bookingInfo.checkInDate)}
                      onChange={(date) => handleDateChange('checkInDate', date)}
                      format="DD/MM/YYYY"
                      disabledDate={(current) => current && current < dayjs().startOf('day')}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Ngày Trả Phòng">
                    <DatePicker
                      value={dayjs(bookingInfo.checkOutDate)}
                      onChange={(date) => handleDateChange('checkOutDate', date)}
                      format="DD/MM/YYYY"
                      disabledDate={(current) => current && current <= dayjs(bookingInfo.checkInDate)}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <div className="booking-confirmation__summary">
                <div className="booking-confirmation__summary-item">
                  <span>Số Phòng: {bookingInfo.roomCount || 1}</span>
                </div>
                <div className="booking-confirmation__summary-item">
                  <span>Số người lớn: {bookingInfo.adultCount || 2}</span>
                </div>
                <div className="booking-confirmation__summary-item">
                  <span>Số trẻ em: {bookingInfo.childrenCount || 0}</span>
                </div>
                <div className="booking-confirmation__summary-item">
                  <span>Số ngày đặt: {bookingInfo.daysCount || 1}</span>
                </div>
                
                <Divider />
                
                <div className="booking-confirmation__summary-item">
                  <span>Giá phòng: {(bookingInfo.roomPrice || 0).toLocaleString()} vnđ</span>
                  <span>{((bookingInfo.roomPrice || 0) * (bookingInfo.daysCount || 1) * (bookingInfo.roomCount)).toLocaleString()} vnđ</span>
                </div>
                
                {includedAmenities.length > 0 && (
                  <div className="booking-confirmation__summary-item">
                    <span>Tiện ích có sẵn: {includedAmenities.reduce((total, item) => total + Number(item.price || 0), 0).toLocaleString()} vnđ</span>
                    <span>
                      {(bookingInfo.roomCount * bookingInfo.daysCount * includedAmenities.reduce((total, item) => total + Number(item.price || 0), 0)).toLocaleString()} vnđ
                    </span>
                  </div>
                )}
                
                {additionalAmenities.length > 0 && (
                  <div className="booking-confirmation__summary-item">
                    <span>Tiện ích bổ sung: {additionalAmenities.reduce((total, item) => total + Number(item.price || 0), 0).toLocaleString()} vnđ</span>
                    <span>
                      {(bookingInfo.roomCount * bookingInfo.daysCount * additionalAmenities.reduce((total, item) => total + Number(item.price || 0), 0)).toLocaleString()} vnđ
                    </span>
                  </div>
                )}
                
                <div className="booking-confirmation__summary-item booking-confirmation__summary-total">
                  <span>Tổng số tiền phải trả:</span>
                  <span>{calculateTotalAmount().toLocaleString()} vnđ</span>
                </div>

                <p className='booking-confirmation__danger-text'>
                  <strong>Lưu ý: Hiện tại chính sách điều khoản chúng tôi chưa cho phép hủy đặt phòng khi bạn đã thanh toán đơn hàng thành công, nên hãy cân nhắc kĩ trước khi đặt phòng.Nếu bạn có lý do bất khả kháng khi không thể đến khách sạn, vui lòng liên hệ ngay với chúng tôi để được hỗ trợ.</strong>
                </p>
              </div>

              <div className="booking-confirmation__actions">
                <Button
                  type="primary"
                  className="booking-confirmation__book-btn"
                  onClick={handleBookNow}
                  loading={loading}
                >
                  Đặt Ngay
                </Button>

                <Button
                  type="default"
                  icon={<PlusOutlined />}
                  className="booking-confirmation__amenities-btn"
                  onClick={goToAmenities}
                  disabled={loading}
                >
                  Thêm Tiện Nghi
                </Button>
                
                <Button
                  type="danger"
                  className="booking-confirmation__cancel-btn"
                  onClick={() => {
                    Modal.confirm({
                      title: 'Hủy đặt phòng',
                      content: 'Bạn có chắc chắn muốn hủy đặt phòng? Tất cả thông tin đã chọn sẽ bị mất.',
                      okText: 'Hủy đặt phòng',
                      cancelText: 'Quay lại',
                      okButtonProps: { danger: true },
                      onOk: () => {
                        dispatch(resetBooking());
                        localStorage.removeItem('bookingState');
                        notiApi.success({
                          message: 'Đã hủy đặt phòng',
                          description: 'Thông tin đặt phòng đã được xóa thành công.'
                        });
                        navigate('/room');
                      }
                    });
                  }}
                  disabled={loading}
                >
                  Hủy Đặt Phòng
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default BookingConfirmation;