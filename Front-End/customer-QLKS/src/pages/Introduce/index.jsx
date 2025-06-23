import { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Typography, 
  Divider, 
  Card, 
  Carousel, 
  Statistic, 
  Empty, 
  Spin,
  Button,
  List,
  Timeline,
  Tag
} from 'antd';
import { 
  HomeOutlined, 
  StarOutlined, 
  TeamOutlined, 
  CalendarOutlined, 
  EnvironmentOutlined,
  ArrowRightOutlined,
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getDefaultHotel } from '../../services/hotelService';
import './Introduce.scss';

const { Title, Paragraph, Text } = Typography;

function Introduce() {
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        setLoading(true);
        const response = await getDefaultHotel();
        console.log(response);
        
        if (response && response.EC === 0 && response.DT) {
          setHotel(response.DT);
        } else {
          throw new Error(response?.EM || 'Không thể tải thông tin khách sạn');
        }
      } catch (err) {
        console.error('Lỗi khi lấy thông tin khách sạn:', err);
        setError(err.message || 'Đã xảy ra lỗi khi tải thông tin khách sạn');
      } finally {
        setLoading(false);
      }
    };

    fetchHotelData();
  }, []);

  const goToRooms = () => {
    navigate('/room');
  };

  if (loading) {
    return (
      <div className="introduce-loading">
        <Spin size="large" />
        <Text>Đang tải thông tin khách sạn...</Text>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="introduce-error">
        <Empty
          description={error || 'Không tìm thấy thông tin khách sạn'}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  const hotelAmenities = [
    { title: 'Hồ Bơi', description: 'Hồ bơi vô cực với tầm nhìn tuyệt đẹp', icon: '🏊‍♂️' },
    { title: 'Nhà Hàng', description: 'Phục vụ ẩm thực đa dạng từ Á đến Âu', icon: '🍽️' },
    { title: 'Spa & Massage', description: 'Dịch vụ spa cao cấp giúp thư giãn', icon: '💆‍♀️' },
    { title: 'Phòng Gym', description: 'Phòng tập hiện đại với đầy đủ thiết bị', icon: '🏋️‍♂️' },
    { title: 'Wi-Fi Miễn Phí', description: 'Kết nối internet tốc độ cao', icon: '📶' },
    { title: 'Đưa Đón Sân Bay', description: 'Dịch vụ đưa đón sân bay theo yêu cầu', icon: '🚗' }
  ];

  const hotelHistory = [
    {
      year: '2010',
      event: 'Khởi công xây dựng khách sạn'
    },
    {
      year: '2012',
      event: 'Khánh thành và đi vào hoạt động'
    },
    {
      year: '2015',
      event: 'Nâng cấp và mở rộng quy mô'
    },
    {
      year: '2018',
      event: 'Đạt chứng nhận khách sạn 5 sao'
    },
    {
      year: '2020',
      event: 'Cải tiến dịch vụ và trang thiết bị'
    }
  ];

  const nearbyAttractions = [
    'Trung tâm thương mại (2km)',
    'Bảo tàng lịch sử (3km)',
    'Bãi biển (5km)',
    'Công viên giải trí (3.5km)',
    'Chợ đêm (1.8km)',
    'Phố đi bộ (1.2km)'
  ];

  return (
    <div className="introduce-page">
      {/* Hero Banner */}
      {/* <div className="introduce-banner">
        <Carousel autoplay effect="fade" className="introduce-carousel">
          {carouselImages.map((image, index) => (
            <div key={index}>
              <div 
                className="carousel-item" 
                style={{ backgroundImage: `url(${image})` }}
              >
                <div className="carousel-content">
                  <Title level={1}>{hotel.hotelName}</Title>
                  <div className="hotel-badges">
                    <Tag color="blue">{hotel.hotelType || 'Khách sạn cao cấp'}</Tag>
                    <Tag color="green">Đang hoạt động</Tag>
                  </div>
                  <Paragraph>{hotel.address}</Paragraph>
                  <Button type="primary" size="large" onClick={goToRooms}>
                    Đặt Phòng Ngay <ArrowRightOutlined />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div> */}

      <div className="introduce-container">
        {/* Giới Thiệu */}
        <section className="introduce-section">
          <Title level={2} className="section-title">Giới Thiệu Về Chúng Tôi</Title>
          <Divider className="section-divider" />
          <Row gutter={[32, 32]} align="middle">
            <Col xs={24} md={12}>
              <div className="content-box">
                <Paragraph className="introduction-text">
                  {hotel.description || 
                    `${hotel.hotelName} là một khách sạn sang trọng tọa lạc tại vị trí đắc địa giữa trung tâm thành phố. Với kiến trúc hiện đại và nội thất tinh tế, chúng tôi cam kết mang đến cho quý khách trải nghiệm lưu trú hoàn hảo với dịch vụ chuyên nghiệp và thân thiện.`
                  }
                </Paragraph>
                
                <div className="hotel-info">
                  <div className="info-item">
                    <CalendarOutlined className="info-icon" />
                    <div>
                      <Text strong>Ngày Thành Lập:</Text>
                      <Text> {new Date(hotel.openDay).toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit', year: 'numeric'})}</Text>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <EnvironmentOutlined className="info-icon" />
                    <div>
                      <Text strong>Địa Chỉ:</Text>
                      <Text> {hotel.address}</Text>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <PhoneOutlined className="info-icon" />
                    <div>
                      <Text strong>Liên Hệ:</Text>
                      <Text> +84 (28) 3823 4999</Text>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <MailOutlined className="info-icon" />
                    <div>
                      <Text strong>Email:</Text>
                      <Text> info@{hotel.hotelName.toLowerCase().replace(/\s+/g, '')}hotel.com</Text>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <ClockCircleOutlined className="info-icon" />
                    <div>
                      <Text strong>Giờ Làm Việc:</Text>
                      <Text> Check-in: 14:00 | Check-out: 12:00</Text>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="image-container">
                <img
                  src={hotel.hotelImage || 'https://via.placeholder.com/600x400/f0f0f0/999999?text=Hotel+Image'}
                  alt={hotel.hotelName}
                  className="featured-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x400/f0f0f0/999999?text=No+Image+Available';
                  }}
                  loading="lazy"
                />
              </div>
            </Col>
          </Row>
        </section>
        
        {/* Tiện Nghi & Dịch Vụ */}
        <section className="introduce-section">
          <Title level={2} className="section-title">Tiện Nghi & Dịch Vụ</Title>
          <Divider className="section-divider" />
          <Row gutter={[24, 24]}>
            {hotelAmenities.map((item, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <Card className="amenity-card" hoverable>
                  <div className="amenity-icon">{item.icon}</div>
                  <div className="amenity-content">
                    <Title level={4}>{item.title}</Title>
                    <Paragraph>{item.description}</Paragraph>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </section>
        
        {/* Số Liệu Thống Kê */}
        <section className="introduce-section stats-section">
          <Row gutter={[24, 24]}>
            <Col xs={12} md={6}>
              <Card className="stat-card">
                <Statistic 
                  title="Năm Hoạt Động" 
                  value={new Date().getFullYear() - new Date(hotel.openDay).getFullYear()} 
                  suffix="năm"
                  prefix={<CalendarOutlined />} 
                />
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card className="stat-card">
                <Statistic 
                  title="Số Phòng" 
                  value={hotel.Rooms?.length || 50} 
                  prefix={<HomeOutlined />} 
                />
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card className="stat-card">
                <Statistic 
                  title="Đánh Giá" 
                  value={4.8} 
                  suffix="/5" 
                  precision={1}
                  prefix={<StarOutlined />} 
                />
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card className="stat-card">
                <Statistic 
                  title="Nhân Viên" 
                  value={hotel.Users?.length || 35} 
                  prefix={<TeamOutlined />} 
                />
              </Card>
            </Col>
          </Row>
        </section>
        
        {/* Vị Trí & Lịch Sử */}
        <section className="introduce-section">
          <Row gutter={[48, 48]}>
            <Col xs={24} lg={12}>
              <div className="content-box">
                <Title level={3}>Vị Trí</Title>
                <Divider />
                <Paragraph>
                  {hotel.hotelName} tọa lạc tại {hotel.address}, một vị trí đắc địa với nhiều tiện ích xung quanh. Từ đây, quý khách có thể dễ dàng di chuyển đến các điểm tham quan và mua sắm nổi tiếng trong thành phố.
                </Paragraph>
                
                <Title level={4}>Các Địa Điểm Lân Cận:</Title>
                <List
                  size="small"
                  bordered
                  dataSource={nearbyAttractions}
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                  className="nearby-list"
                />
                
                <div className="map-container">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3779.6543248183077!2d105.69434537490079!3d18.67283856733188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3139cddf0bf20f23%3A0x86154b56a284fa6d!2zOTkgTMOqIER14bqpbiwgQsOqzIFuIFRodeG7tSwgVGjDoG5oIHBo4buRIFZpbmgsIE5naOG7hyBBbiwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1689175967462!5m2!1svi!2s"
                    width="100%"
                    height="300"
                    style={{ border: 0, borderRadius: '8px', marginTop: '20px' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Hotel Location"
                  ></iframe>
                </div>
              </div>
            </Col>
            
            <Col xs={24} lg={12}>
              <div className="content-box">
                <Title level={3}>Lịch Sử Phát Triển</Title>
                <Divider />
                <Paragraph>
                  Từ ngày thành lập đến nay, {hotel.hotelName} đã trải qua nhiều giai đoạn phát triển để trở thành một trong những khách sạn hàng đầu trong khu vực.
                </Paragraph>
                
                <div className="history-timeline">
                  <Timeline mode="left">
                    {hotelHistory.map((item, index) => (
                      <Timeline.Item key={index} label={item.year}>
                        <div className="timeline-content">
                          <Text strong>{item.event}</Text>
                        </div>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </div>
              </div>
            </Col>
          </Row>
        </section>
        
        {/* CTA Section */}
        <section className="introduce-cta">
          <div className="cta-content">
            <Title level={2}>Trải Nghiệm Dịch Vụ Của Chúng Tôi</Title>
            <Paragraph>
              Đặt phòng ngay hôm nay để nhận được ưu đãi đặc biệt và bắt đầu kỳ nghỉ tuyệt vời tại {hotel.hotelName}.
            </Paragraph>
            <Button type="primary" size="large" onClick={goToRooms}>
              Đặt Phòng Ngay <ArrowRightOutlined />
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Introduce;