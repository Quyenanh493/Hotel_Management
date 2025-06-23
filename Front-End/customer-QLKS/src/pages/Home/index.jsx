import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, DatePicker, Button, Layout, Row, Col, Card, Tag, Space, Divider, message, Spin } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import dayjs from 'dayjs';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import slide1 from "../../images/slide1.jpg"
import slide2 from "../../images/slide2.jpg"
import slide3 from "../../images/slide3.jpg"
import slide4 from "../../images/slide4.jpg"
import slide5 from "../../images/slide5.jpg"
import { setSearchDates, setGuestCounts } from '../../redux/search/searchSlice';
import { getAllRooms } from '../../services/roomService';
import "./Home.scss" 

const { Content } = Layout;
const { Meta } = Card;

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  // State cho bộ chọn phòng và khách
  const [guestCounts, setGuestCountsState] = useState({
    rooms: 1,
    adults: 2,
    children: 0
  });
  const [guestSelectorVisible, setGuestSelectorVisible] = useState(false);
  const [dateIn, setDateIn] = useState(null);
  const [dateOut, setDateOut] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch rooms from API
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const response = await getAllRooms();
        if (response && response.EC === 0 && response.DT) {
          // Lấy 3 phòng đầu tiên để hiển thị
          setRooms(response.DT.slice(0, 3));
        } else {
          message.error('Không thể tải danh sách phòng');
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách phòng:', error);
        message.error('Đã xảy ra lỗi khi tải danh sách phòng');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Xử lý thay đổi số lượng phòng và khách
  const handleGuestChange = (type, action) => {
    setGuestCountsState(prev => {
      const newCounts = { ...prev };
      
      if (action === 'increase') {
        newCounts[type] += 1;
      } else if (action === 'decrease') {
        newCounts[type] = Math.max(type === 'children' ? 0 : 1, newCounts[type] - 1);
      }
      
      return newCounts;
    });
  };

  // Tạo chuỗi hiển thị số phòng và khách
  const guestSummary = `${guestCounts.rooms} phòng, ${guestCounts.adults + guestCounts.children} khách`;

  // Xử lý khi chọn ngày nhận phòng
  const handleCheckInDateChange = (date) => {
    setDateIn(date);
  };

  // Xử lý khi chọn ngày trả phòng
  const handleCheckOutDateChange = (date) => {
    setDateOut(date);
  };

  // Hàm tạo giới hạn ngày cho DatePicker
  const disabledDate = (current) => {
    return current && current < dayjs().startOf('day');
  };

  // Xử lý khi nhấn nút tìm phòng
  const handleSearchRooms = () => {
    if (!dateIn || !dateOut) {
      return;
    }

    // Lưu thông tin tìm kiếm vào Redux store
    dispatch(setSearchDates({
      dateIn: dateIn.format('YYYY-MM-DD'),
      dateOut: dateOut.format('YYYY-MM-DD')
    }));
    
    dispatch(setGuestCounts(guestCounts));

    // Chuyển hướng đến trang phòng
    navigate('/room');
  };


  const sliderData = [
    {
      id: 1,
      image: slide1,
    },
    {
      id: 2,
      image: slide2,
    },
    {
      id: 3,
      image: slide3,
    },
    {
      id: 4,
      image: slide4,
    },
    {
      id: 5,
      image: slide5,
    }
  ];

  // Hàm lấy danh sách tiện nghi từ dữ liệu phòng
  const getAmenities = (room) => {
    let amenities = [];
    
    // Phòng ngủ luôn có
    amenities.push('Phòng Ngủ');
    
    // Thêm các tiện nghi khác dựa trên trường Amenities nếu có
    if (room.Amenities && room.Amenities.length > 0) {
      room.Amenities.forEach(amenity => {
        if (amenity.amenityName === 'Ban Công' || 
            amenity.amenityName === 'Phòng Bếp' || 
            amenity.amenityName === 'Ghế sofa') {
          amenities.push(amenity.amenityName);
        }
      });
    }
    
    return amenities;
  };
  
  // Hàm lấy danh sách trang thiết bị từ dữ liệu phòng
  const getFeatures = (room) => {
    let features = [];
    
    // Wifi luôn có
    features.push('Wifi');
    
    // Thêm các trang thiết bị khác dựa trên trường Amenities nếu có
    if (room.Amenities && room.Amenities.length > 0) {
      room.Amenities.forEach(amenity => {
        if (amenity.amenityName === 'Điều Hoà' || 
            amenity.amenityName === 'Nóng Lạnh' || 
            amenity.amenityName === 'Tivi' ||
            amenity.amenityName === 'Máy Sưởi') {
          features.push(amenity.amenityName);
        }
      });
    }
    
    return features;
  };

  return (
    <Layout className="home">
      <Content>
        <div className='home__section'>
          {/* Slider */}
          <Row>
            <Col span={24}>
              <div className="home__slider">
                <Swiper
                  modules={[Navigation, Pagination, Autoplay, EffectFade]}
                  spaceBetween={0}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 5000, disableOnInteraction: false }}
                  effect="fade"
                  loop={true}
                  className="home__slider-main"
                >
                  {sliderData.map((slide) => (
                    <SwiperSlide key={slide.id}>
                      <div className="home__slider-item">
                        <img src={slide.image} alt={`Slide ${slide.id}`} />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </Col>
          </Row>

          {/* Tim phong */}
          <Row justify="center">
            <Col xs={24} sm={22} md={20} lg={18} xl={18}>
              <div className="home__hero">
                <div className="home__search-container">
                  <div className="home__search-title">Tìm Phòng</div>
                  <Form 
                    form={form}
                    layout="vertical" 
                    className="home__search-form"
                    onFinish={handleSearchRooms}
                  >
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12} md={6}>
                        <Form.Item 
                          label="Ngày Nhận Phòng" 
                          className="home__date-picker"
                          name="dateIn"
                          rules={[{ required: true, message: 'Vui lòng chọn ngày nhận phòng!' }]}
                        >
                          <DatePicker 
                            format="DD/MM/YYYY" 
                            placeholder="dd/mm/yyyy" 
                            style={{ width: '100%' }} 
                            onChange={handleCheckInDateChange}
                            disabledDate={disabledDate}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={6}>
                        <Form.Item 
                          label="Ngày Trả Phòng" 
                          className="home__date-picker"
                          name="dateOut"
                          rules={[{ required: true, message: 'Vui lòng chọn ngày trả phòng!' }]}
                        >
                          <DatePicker 
                            format="DD/MM/YYYY" 
                            placeholder="dd/mm/yyyy" 
                            style={{ width: '100%' }} 
                            onChange={handleCheckOutDateChange}
                            disabledDate={(current) => {
                              // Không cho phép chọn ngày trong quá khứ và trước ngày nhận phòng
                              return (current && current < dayjs().startOf('day')) || 
                                     (dateIn && current && current < dateIn);
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={6}>
                        <Form.Item
                          label="Số phòng và khách"
                          name="guestInfo"
                          initialValue={guestSummary}
                          rules={[{ required: true, message: 'Vui lòng chọn số phòng và khách!' }]}
                        >
                          <div className="home__guest-selector">
                            <div 
                              className="home__guest-display"
                              onClick={() => setGuestSelectorVisible(!guestSelectorVisible)}
                            >
                              <span>{guestSummary}</span>
                            </div>
                            {guestSelectorVisible && (
                              <div className="home__guest-dropdown">
                                <div className="home__guest-item">
                                  <span className="home__guest-label">Phòng</span>
                                  <div className="home__guest-controls">
                                    <Button 
                                      className="home__guest-btn"
                                      onClick={() => handleGuestChange('rooms', 'decrease')}
                                      disabled={guestCounts.rooms <= 1}
                                    >−</Button>
                                    <span className="home__guest-count">{guestCounts.rooms}</span>
                                    <Button 
                                      className="home__guest-btn"
                                      onClick={() => handleGuestChange('rooms', 'increase')}
                                    >+</Button>
                                  </div>
                                </div>
                                <div className="home__guest-item">
                                  <span className="home__guest-label">Người lớn</span>
                                  <div className="home__guest-controls">
                                    <Button 
                                      className="home__guest-btn"
                                      onClick={() => handleGuestChange('adults', 'decrease')}
                                      disabled={guestCounts.adults <= 1}
                                    >−</Button>
                                    <span className="home__guest-count">{guestCounts.adults}</span>
                                    <Button 
                                      className="home__guest-btn"
                                      onClick={() => handleGuestChange('adults', 'increase')}
                                    >+</Button>
                                  </div>
                                </div>
                                <div className="home__guest-item">
                                  <span className="home__guest-label">Trẻ em</span>
                                  <div className="home__guest-controls">
                                    <Button 
                                      className="home__guest-btn"
                                      onClick={() => handleGuestChange('children', 'decrease')}
                                      disabled={guestCounts.children <= 0}
                                    >−</Button>
                                    <span className="home__guest-count">{guestCounts.children}</span>
                                    <Button 
                                      className="home__guest-btn"
                                      onClick={() => handleGuestChange('children', 'increase')}
                                    >+</Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={6}>
                        <Form.Item label=" " className="home__search-button-wrapper">
                          <Button 
                            type="primary" 
                            htmlType="submit" 
                            className="home__search-btn" 
                            style={{ width: '100%' }}
                          >
                            Tìm Phòng
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </div>
              </div>
            </Col>
          </Row>

          {/* Phòng nổi bật */}
          <Row justify="center" className="home__featured-rooms-section">
            <Col xs={24} sm={22} md={20} lg={18} xl={18}>
              <div className="home__featured">
                <h2 className="home__featured-title">PHÒNG NỔI BẬT</h2>
                <div className="home__featured-subtitle">Khám phá các loại phòng sang trọng của chúng tôi</div>
                {loading ? (
                  <div className="home__loading">
                    <Spin size="large" />
                    <p>Đang tải danh sách phòng...</p>
                  </div>
                ) : (
                  <>
                    <Row gutter={[24, 24]} style={{ marginTop: '30px' }}>
                      {rooms.length > 0 ? rooms.map(room => (
                        <Col xs={24} sm={12} lg={8} key={room.roomId}>
                          <Card
                            className="home__room-card"
                            cover={
                              <div className="home__room-image">
                                <img 
                                  alt={room.roomName} 
                                  src={room.roomImage} 
                                />
                              </div>
                            }
                            bordered={false}
                          >
                            <div className="home__room-header">
                              <h3 className="home__room-title">{room.roomName}</h3>
                              <div className="home__room-price">{room.price?.toLocaleString('vi-VN')} vnd mỗi đêm</div>
                            </div>
                            
                            <div className="home__room-section">
                              <h4 className="home__room-section-title">Cơ sở</h4>
                              <div className="home__room-amenities">
                                {getAmenities(room).map((amenity, index) => (
                                  <Tag key={index} className="home__room-tag">{amenity}</Tag>
                                ))}
                              </div>
                            </div>
                            
                            <div className="home__room-section">
                              <h4 className="home__room-section-title">Tiện nghi & Trang thiết bị</h4>
                              <div className="home__room-amenities">
                                {getFeatures(room).map((feature, index) => (
                                  <Tag key={index} className="home__room-tag">{feature}</Tag>
                                ))}
                              </div>
                            </div>
                            
                          </Card>
                        </Col>
                      )) : (
                        <div className="home__no-rooms">
                          <p>Không tìm thấy phòng nào</p>
                        </div>
                      )}
                    </Row>
                    <div className="home__view-more">
                      <Button 
                        className="home__view-more-btn" 
                        onClick={() => navigate('/room')}
                      >
                        Xem Thêm {">>>"}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </Col>
          </Row>

          {/* Phần Liên hệ */}
          <Row justify="center" className="home__contact-section">
            <Col xs={24} sm={22} md={20} lg={18} xl={18}>
              <div className="home__contact">
                <h2 className="home__section-title">LIÊN HỆ</h2>
                <Row gutter={[48, 32]}>
                  <Col xs={24} md={12}>
                    <div className="home__map">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3779.6543248183077!2d105.69434537490079!3d18.67283856733188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3139cddf0bf20f23%3A0x86154b56a284fa6d!2zOTkgTMOqIER14bqpbiwgQsOqzIFuIFRodeG7tSwgVGjDoG5oIHBo4buRIFZpbmgsIE5naOG7hyBBbiwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1689175967462!5m2!1svi!2s"
                        width="100%"
                        height="100%"
                        style={{ border: 0, borderRadius: '8px' }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Hotel Location"
                      ></iframe>
                    </div>
                  </Col>
                  <Col xs={24} md={12}>
                    <div className="home__contact-info">
                      <h3 className="home__contact-title">Bạn cần hỗ trợ? Hãy gọi ngay</h3>
                      <div className="home__contact-item">
                        <i className="fas fa-phone-alt"></i>
                        <a href="tel:+84974562765">+84974562765</a>
                      </div>
                      <div className="home__contact-item">
                        <i className="fas fa-phone-alt"></i>
                        <a href="tel:+84974562765">+84974562765</a>
                      </div>
                      
                      <h3 className="home__contact-title">Theo dõi ngay</h3>
                      <div className="home__contact-social">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="home__social-link">
                          <i className="fab fa-facebook-f"></i>
                          <span>Facebook</span>
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="home__social-link">
                          <i className="fab fa-instagram"></i>
                          <span>Instagram</span>
                        </a>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          
        </div>
      </Content>
    </Layout>
  )
}

export default Home;
