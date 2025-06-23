import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Rate, Divider, Spin, Image, Tag, List, Typography, Avatar, Button, notification, Modal, Form, Input } from 'antd';
import { WifiOutlined, CoffeeOutlined, CarOutlined, ShoppingOutlined, UserOutlined, LeftOutlined, RightOutlined, StarOutlined } from '@ant-design/icons';
import { getHotelById } from '../../services/hotelService';
import { getRoomsByHotelId } from '../../services/roomService';
import { getAmenityByRoomId } from '../../services/amenitiesService'; 
import { getRoomReviewsByHotelId, createRoomReview } from '../../services/roomReviewService';
import { getCookie } from '../../helper/cookie';
import dayjs from 'dayjs';
import './RoomDetail.scss';

const { Title, Text, Paragraph } = Typography;

// Hàm này giúp chọn icon phù hợp cho từng loại tiện ích
const getAmenityIcon = (amenityName) => {
  const name = (amenityName || '').toLowerCase();
  
  if (name.includes('wifi') || name.includes('internet')) {
    return <WifiOutlined />;
  } else if (name.includes('coffee') || name.includes('cà phê') || name.includes('trà') || name.includes('tea')) {
    return <CoffeeOutlined />;
  } else if (name.includes('parking') || name.includes('đỗ xe')) {
    return <CarOutlined />;
  } else {
    return <ShoppingOutlined />;
  }
};

// Function to parse hotel images from JSON string to array
const parseHotelImages = (hotelImages, fallbackImage) => {
  if (!hotelImages) return fallbackImage ? [fallbackImage] : [];
  
  try {
    const parsed = JSON.parse(hotelImages);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (error) {
    console.log('Error parsing hotelImages:', error);
  }
  
  // Fallback to single image if parsing fails or array is empty
  return fallbackImage ? [fallbackImage] : [];
};

function RoomDetail() {
  const { hotelId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [notiApi, contextHolder] = notification.useNotification();
  
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hotelImages, setHotelImages] = useState([]);
  const [roomAmenities, setRoomAmenities] = useState({});
  
  // Review states
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedRoomForReview, setSelectedRoomForReview] = useState(null);
  const [reviewForm] = Form.useForm();
  
  // Lấy thông tin tìm kiếm từ location state
  const searchInfo = location.state || {};
  const { dateIn, dateOut, guestCounts } = searchInfo;
  
  // Lấy thông tin người dùng
  const userData = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchHotelDetail = async () => {
      try {
        setLoading(true);
        
        // Lấy thông tin khách sạn
        const hotelResponse = await getHotelById(hotelId);
        if (hotelResponse && hotelResponse.DT) {
          // Kiểm tra khách sạn có đang hoạt động không
          if (hotelResponse.DT.hotelStatus === false) {
            notiApi.error({
              message: 'Khách sạn đã đóng cửa',
              description: 'Khách sạn này hiện tại đã ngừng hoạt động.'
            });
            navigate('/room');
            return;
          }
          
          setHotel(hotelResponse.DT);
          // Parse hotel images
          const images = parseHotelImages(hotelResponse.DT.hotelImages, hotelResponse.DT.hotelImage);
          setHotelImages(images);
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin khách sạn:', error);
        notiApi.error({
          message: 'Lỗi',
          description: 'Không thể tải thông tin khách sạn.'
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchRoomsByHotel = async () => {
      try {
        setRoomsLoading(true);
        
        // Lấy danh sách phòng của khách sạn
        const roomsResponse = await getRoomsByHotelId(hotelId);
        if (roomsResponse && roomsResponse.DT) {
          // Hiển thị cả phòng Available và Occupied (chỉ ẩn phòng Maintenance)
          const visibleRooms = roomsResponse.DT.filter(room => room.roomStatus !== 'Maintenance');
          setRooms(visibleRooms);
          
          // Lấy tiện nghi cho từng phòng
          await fetchAllRoomAmenities(visibleRooms);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách phòng:', error);
        notiApi.error({
          message: 'Lỗi',
          description: 'Không thể tải danh sách phòng.'
        });
      } finally {
        setRoomsLoading(false);
      }
    };

    if (hotelId) {
      fetchHotelDetail();
      fetchRoomsByHotel();
      fetchHotelReviews();
    }
  }, [hotelId]);

  // Lấy đánh giá của khách sạn
  const fetchHotelReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await getRoomReviewsByHotelId(hotelId);
      if (response && response.EC === 0) {
        setReviews(response.DT);
      }
    } catch (error) {
      console.error('Lỗi khi lấy đánh giá khách sạn:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Lấy tiện nghi cho từng phòng
  const fetchRoomAmenities = async (roomId) => {
    try {
      const response = await getAmenityByRoomId(roomId);
      if (response && response.EC === 0) {
        return response.DT;
      }
      return [];
    } catch (error) {
      console.error(`Lỗi khi lấy tiện nghi cho phòng ${roomId}:`, error);
      return [];
    }
  };

  // Lấy tiện nghi cho tất cả các phòng
  const fetchAllRoomAmenities = async (roomsData) => {
    if (!roomsData || roomsData.length === 0) return;
    
    const amenitiesMap = {};
    
    for (const room of roomsData) {
      const amenities = await fetchRoomAmenities(room.roomId);
      amenitiesMap[room.roomId] = amenities;
    }
    
    setRoomAmenities(amenitiesMap);
  };

  const handleBookNow = (roomId) => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const token = getCookie('accessToken');
    if (!token) {
      notiApi.warning({
        message: 'Yêu cầu đăng nhập',
        description: 'Vui lòng đăng nhập để đặt phòng.'
      });
      return;
    }
    
    // Kiểm tra xem có thông tin tìm kiếm không
    if (!dateIn || !dateOut) {
      notiApi.warning({
        message: 'Thiếu thông tin',
        description: 'Vui lòng quay lại trang tìm kiếm và chọn ngày nhận phòng, trả phòng.'
      });
      return;
    }

    // Kiểm tra phòng còn trống không
    const selectedRoom = rooms.find(room => room.roomId === roomId);
    if (selectedRoom && selectedRoom.currentlyAvailable !== undefined && selectedRoom.currentlyAvailable === 0) {
      notiApi.error({
        message: 'Phòng đã hết',
        description: 'Phòng này hiện tại đã hết. Vui lòng chọn phòng khác hoặc thay đổi thời gian.'
      });
      return;
    }
    
    // Chuyển hướng đến trang đặt phòng với thông tin đã chọn
    navigate(`/booking-confirmation`, {
      state: {
        roomId: roomId,
        dateIn: dateIn,
        dateOut: dateOut,
        adults: guestCounts?.adults || 2,
        childrens: guestCounts?.children || 0,
        roomCount: guestCounts?.rooms || 1
      }
    });
  };

  // Xử lý mở modal đánh giá
  const handleOpenReviewModal = (room) => {
    const token = getCookie('accessToken');
    if (!token) {
      notiApi.warning({
        message: 'Yêu cầu đăng nhập',
        description: 'Vui lòng đăng nhập để viết đánh giá.'
      });
      return;
    }
    setSelectedRoomForReview(room);
    setReviewModalVisible(true);
    reviewForm.resetFields();
  };

  // Xử lý đóng modal đánh giá
  const handleCloseReviewModal = () => {
    setReviewModalVisible(false);
    setSelectedRoomForReview(null);
    reviewForm.resetFields();
  };

  // Xử lý submit đánh giá
  const handleSubmitReview = async (values) => {
    try {
      const reviewData = {
        roomId: selectedRoomForReview.roomId,
        customerId: userData.customerId || userData.id,
        rating: values.rating,
        comment: values.comment || ''
      };

      const response = await createRoomReview(reviewData);
      if (response && response.EC === 0) {
        notiApi.success({
          message: 'Thành công',
          description: 'Đánh giá của bạn đã được gửi thành công!'
        });
        handleCloseReviewModal();
        // Refresh reviews và rooms để cập nhật rating
        fetchHotelReviews();
        fetchRoomsByHotel();
      } else {
        notiApi.error({
          message: 'Lỗi',
          description: response?.EM || 'Có lỗi xảy ra khi gửi đánh giá.'
        });
      }
    } catch (error) {
      console.error('Lỗi khi gửi đánh giá:', error);
      notiApi.error({
        message: 'Lỗi',
        description: 'Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.'
      });
    }
  };

  // Tính toán điểm đánh giá trung bình
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="hotel-detail__loading">
        <Spin size="large" tip="Đang tải thông tin khách sạn..." />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="hotel-detail__error">
        <h2>Không tìm thấy thông tin khách sạn</h2>
        <p>Khách sạn bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <Button type="primary" onClick={() => navigate('/room')}>
          Quay lại trang tìm kiếm
        </Button>
      </div>
    );
  }

  return (
    <div className="hotel-detail">
      {contextHolder}
      
      {/* Header thông tin khách sạn */}
      <Card className="hotel-detail__main-card">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={24}>
            <div className="hotel-detail__header">
              <h1 className="hotel-detail__title">{hotel.hotelName}</h1>
              <div className="hotel-detail__meta">
                <div className="hotel-detail__type">
                  <Tag color="blue">{hotel.hotelType}</Tag>
                </div>
                <div className="hotel-detail__address">
                  <span className="hotel-detail__location-icon">Địa chỉ khách sạn: </span>
                  <span>{hotel.address}</span>
                </div>
              </div>
            </div>
          </Col>
          
          {/* Gallery ảnh khách sạn */}
          <Col xs={24}>
            <div className="hotel-detail__image-gallery">
              {hotelImages.length > 0 ? (
                <div className="hotel-detail__gallery-container">
                  {/* Main Image Display */}
                  <div className="hotel-detail__main-image-container">
                    <img
                      className="hotel-detail__main-image"
                      src={hotelImages[currentImageIndex]}
                      alt={`${hotel.hotelName} - Ảnh ${currentImageIndex + 1}`}
                    />
                    
                    {/* Navigation arrows for main image */}
                    {hotelImages.length > 1 && (
                      <>
                        <div 
                          className="hotel-detail__image-nav hotel-detail__image-nav--prev"
                          onClick={() => setCurrentImageIndex(prev => 
                            prev === 0 ? hotelImages.length - 1 : prev - 1
                          )}
                        >
                          <LeftOutlined />
                        </div>
                        <div 
                          className="hotel-detail__image-nav hotel-detail__image-nav--next"
                          onClick={() => setCurrentImageIndex(prev => 
                            prev === hotelImages.length - 1 ? 0 : prev + 1
                          )}
                        >
                          <RightOutlined />
                        </div>
                      </>
                    )}
                    
                    {/* Image counter */}
                    <div className="hotel-detail__image-counter">
                      {currentImageIndex + 1} / {hotelImages.length}
                    </div>
                  </div>

                  {/* Thumbnail Grid */}
                  {hotelImages.length > 1 && (
                    <div className="hotel-detail__thumbnails">
                      <Row gutter={[8, 8]}>
                        {hotelImages.map((image, index) => (
                          <Col xs={6} sm={4} md={3} key={index}>
                            <div 
                              className={`hotel-detail__thumbnail ${
                                index === currentImageIndex ? 'hotel-detail__thumbnail--active' : ''
                              }`}
                              onClick={() => setCurrentImageIndex(index)}
                            >
                              <img
                                src={image}
                                alt={`${hotel.hotelName} - Thumbnail ${index + 1}`}
                                className="hotel-detail__thumbnail-image"
                              />
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hotel-detail__no-image">
                  <div className="hotel-detail__no-image-placeholder">
                    <Image 
                      src="https://via.placeholder.com/800x400?text=No+Image+Available"
                      alt="No image available"
                      preview={false}
                    />
                  </div>
                </div>
              )}
            </div>
          </Col>
          
          {/* Mô tả khách sạn */}
          <Col xs={24}>
            <Divider />
            <div className="hotel-detail__description">
              <h2 className="hotel-detail__section-title">Giới thiệu khách sạn</h2>
              <p className="hotel-detail__description-text">
                {hotel.description || 'Khách sạn sang trọng với đầy đủ tiện nghi hiện đại, không gian thoáng đãng và dịch vụ tuyệt vời. Đây là lựa chọn hoàn hảo cho kỳ nghỉ của bạn với vị trí thuận lợi và các dịch vụ chất lượng cao.'}
              </p>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Danh sách phòng */}
      <Card className="hotel-detail__rooms-card">
        <Row gutter={[24, 24]}>
          <Col xs={24}>
            <div className="hotel-detail__rooms-header">
              <h2 className="hotel-detail__section-title">Danh sách phòng</h2>
              {dateIn && dateOut && (
                <div className="hotel-detail__search-info">
                  <span>Từ {dayjs(dateIn).format('DD/MM/YYYY')} đến {dayjs(dateOut).format('DD/MM/YYYY')}</span>
                  {guestCounts && (
                    <span> • {guestCounts.rooms} phòng, {guestCounts.adults + guestCounts.children} khách</span>
                  )}
                </div>
              )}
            </div>
          </Col>
          
          <Col xs={24}>
            {roomsLoading ? (
              <div className="hotel-detail__rooms-loading">
                <Spin size="large" tip="Đang tải danh sách phòng..." />
              </div>
            ) : rooms.length > 0 ? (
              <Row gutter={[16, 16]}>
                {rooms.map(room => (
                  <Col xs={24} lg={12} key={room.roomId}>
                    <Card className="hotel-detail__room-card">
                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={10}>
                          <div className="hotel-detail__room-image">
                            <img 
                              src={room.roomImage || 'https://via.placeholder.com/300x200?text=Room+Image'} 
                              alt={room.roomName}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/300x200?text=Room+Image';
                              }}
                            />
                          </div>
                        </Col>
                        <Col xs={24} sm={14}>
                          <div className="hotel-detail__room-info">
                            <h3 className="hotel-detail__room-name">{room.roomName}</h3>
                            <div className="hotel-detail__room-type">
                              <Tag color="green">{room.roomType}</Tag>
                            </div>
                            <div className="hotel-detail__room-description">
                              <p>{room.description || 'Phòng sang trọng với đầy đủ tiện nghi hiện đại'}</p>
                            </div>
                            
                            <div className="hotel-detail__room-details">
                              <div className="hotel-detail__room-capacity">
                                <span>👥 Tối đa {room.maxCustomer} khách</span>
                              </div>
                              <div className="hotel-detail__room-available">
                                {room.roomStatus === 'Occupied' ? (
                                  <span className="hotel-detail__sold-out">❌ Hết phòng</span>
                                ) : (
                                  room.currentlyAvailable !== undefined ? (
                                    room.currentlyAvailable > 0 ? (
                                      <span className="hotel-detail__available">🏠 {room.currentlyAvailable} phòng trống</span>
                                    ) : (
                                      <span className="hotel-detail__sold-out">❌ Hết phòng</span>
                                    )
                                  ) : (
                                    <span className="hotel-detail__available">🏠 {room.maxRoom} phòng trống</span>
                                  )
                                )}
                              </div>
                              {room.currentlyAvailable !== undefined && room.currentlyAvailable !== room.maxRoom && room.currentlyAvailable > 0 && (
                                <div className="hotel-detail__room-total">
                                  <span>📋 Tổng cộng {room.maxRoom} phòng</span>
                                </div>
                              )}
                            </div>

                            {/* Tiện nghi phòng */}
                            {roomAmenities[room.roomId] && roomAmenities[room.roomId].length > 0 && (
                              <div className="hotel-detail__room-amenities">
                                <h4>Tiện nghi:</h4>
                                <div className="hotel-detail__amenities-list">
                                  {roomAmenities[room.roomId].slice(0, 3).map((amenity, index) => (
                                    <Tag key={index} icon={getAmenityIcon(amenity.amenitiesName)}>
                                      {amenity.amenitiesName}
                                    </Tag>
                                  ))}
                                  {roomAmenities[room.roomId].length > 3 && (
                                    <Tag>+{roomAmenities[room.roomId].length - 3} tiện nghi khác</Tag>
                                  )}
                                </div>
                              </div>
                            )}

                            <Divider style={{ margin: '15px 0' }} />

                            <div className="hotel-detail__room-footer">
                              <div className="hotel-detail__room-price">
                                <span className="hotel-detail__price-amount">
                                  {Number(room.price).toLocaleString()} vnđ
                                </span>
                                <span className="hotel-detail__price-unit">/đêm</span>
                              </div>
                              <div className="hotel-detail__room-actions">
                                <Button 
                                  type="default" 
                                  icon={<StarOutlined />}
                                  className="hotel-detail__review-btn"
                                  onClick={() => handleOpenReviewModal(room)}
                                >
                                  Đánh giá
                                </Button>
                                {room.roomStatus === 'Occupied' || (room.currentlyAvailable !== undefined && room.currentlyAvailable === 0) ? (
                                  <Button 
                                    type="default" 
                                    className="hotel-detail__sold-out-btn"
                                    disabled
                                  >
                                    Hết phòng
                                  </Button>
                                ) : (
                                  <Button 
                                    type="primary" 
                                    className="hotel-detail__book-btn"
                                    onClick={() => handleBookNow(room.roomId)}
                                  >
                                    Đặt phòng
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="hotel-detail__no-rooms">
                <p>Hiện tại khách sạn này không có phòng trống.</p>
                <Button type="primary" onClick={() => navigate('/room')}>
                  Tìm khách sạn khác
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </Card>

      {/* Phần đánh giá khách sạn */}
      <Card className="hotel-detail__reviews-card">
        <Row gutter={[24, 24]}>
          <Col xs={24}>
            <div className="hotel-detail__reviews-header">
              <h2 className="hotel-detail__section-title">
                Đánh giá từ khách hàng
                {reviews.length > 0 && (
                  <span className="hotel-detail__rating-summary">
                    <Rate disabled value={parseFloat(calculateAverageRating())} allowHalf />
                    <span className="hotel-detail__rating-score">
                      {calculateAverageRating()}/5 ({reviews.length} đánh giá)
                    </span>
                  </span>
                )}
              </h2>
            </div>
          </Col>
          
          <Col xs={24}>
            {reviewsLoading ? (
              <div className="hotel-detail__reviews-loading">
                <Spin size="large" tip="Đang tải đánh giá..." />
              </div>
            ) : reviews.length > 0 ? (
              <List
                dataSource={reviews}
                renderItem={review => (
                  <List.Item className="hotel-detail__review-item">
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          icon={<UserOutlined />} 
                          src={review.Customer?.customerImage}
                        />
                      }
                      title={
                        <div className="hotel-detail__review-header">
                          <span className="hotel-detail__reviewer-name">
                            {review.Customer?.customerName || 'Khách hàng'}
                          </span>
                          <div className="hotel-detail__review-meta">
                            <Rate disabled value={review.rating} />
                            <span className="hotel-detail__review-room">
                              Phòng: {review.Room?.roomName}
                            </span>
                            <span className="hotel-detail__review-date">
                              {dayjs(review.createdAt).format('DD/MM/YYYY')}
                            </span>
                          </div>
                        </div>
                      }
                      description={
                        <div className="hotel-detail__review-content">
                          <p>{review.comment || 'Khách hàng đã đánh giá nhưng không để lại bình luận.'}</p>
                        </div>
                      }
                    />
                  </List.Item>
                )}
                pagination={reviews.length > 5 ? {
                  pageSize: 5,
                  showSizeChanger: false,
                  showQuickJumper: false
                } : false}
              />
            ) : (
              <div className="hotel-detail__no-reviews">
                <p>Chưa có đánh giá nào cho khách sạn này.</p>
                <p>Hãy là người đầu tiên chia sẻ trải nghiệm của bạn!</p>
              </div>
            )}
          </Col>
        </Row>
      </Card>

      {/* Modal đánh giá */}
      <Modal
        title={`Đánh giá phòng ${selectedRoomForReview?.roomName}`}
        visible={reviewModalVisible}
        onCancel={handleCloseReviewModal}
        footer={null}
        className="hotel-detail__review-modal"
      >
        <Form
          form={reviewForm}
          layout="vertical"
          onFinish={handleSubmitReview}
        >
          <Form.Item
            label="Đánh giá chất lượng"
            name="rating"
            rules={[{ required: true, message: 'Vui lòng chọn số sao đánh giá!' }]}
          >
            <Rate allowHalf />
          </Form.Item>
          
          <Form.Item
            label="Bình luận (tùy chọn)"
            name="comment"
          >
            <Input.TextArea
              rows={4}
              placeholder="Chia sẻ trải nghiệm của bạn về phòng này..."
              maxLength={500}
              showCount
            />
          </Form.Item>
          
          <Form.Item>
            <div className="hotel-detail__review-modal-footer">
              <Button onClick={handleCloseReviewModal}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Gửi đánh giá
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default RoomDetail;