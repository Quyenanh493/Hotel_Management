import { useState, useEffect } from 'react';
import { Row, Col, Card, Button, DatePicker, Form, Input, Select, Divider, Pagination, notification, Rate } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { getCities, getHotelsByCity, getAllHotels, searchAvailableHotels, searchAvailableHotelsSimple } from '../../services/hotelService';
import './Room.scss';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { resetSearch } from '../../redux/search/searchSlice'; 

const { RangePicker } = DatePicker;
const { Option } = Select;

function Room() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [hotels, setHotels] = useState([]);
  const [allHotels, setAllHotels] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notiApi, contextHolder] = notification.useNotification();
  const [selectedDates, setSelectedDates] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  
  // Lấy dữ liệu tìm kiếm từ Redux store
  const searchData = useSelector(state => state.search);
  
  // State cho bộ chọn khách
  const [guestCounts, setGuestCounts] = useState(searchData.guestCounts || {
    rooms: 1,
    adults: 2,
    children: 0
  });
  const [guestSelectorVisible, setGuestSelectorVisible] = useState(false);

  // Xử lý thay đổi số lượng khách
  const handleGuestChange = (type, action) => {
    setGuestCounts(prev => {
      const newCounts = { ...prev };
      
      if (action === 'increase') {
        newCounts[type] += 1;
      } else if (action === 'decrease') {
        newCounts[type] = Math.max(type === 'children' ? 0 : 1, newCounts[type] - 1);
      }
      
      // Cập nhật giá trị vào form sau khi thay đổi
      form.setFieldsValue({
        guestInfo: `${newCounts.rooms} phòng, ${newCounts.adults + newCounts.children} khách`
      });
      
      return newCounts;
    });
  };

  // Tạo chuỗi hiển thị số phòng và khách
  const guestSummary = `${guestCounts.rooms} phòng, ${guestCounts.adults + guestCounts.children} khách`;
  
  useEffect(() => {
    // Load data khi component mount
    fetchInitialData();
    
    // Load data từ Redux nếu có
    if (searchData.dateIn && searchData.dateOut) {
      setSelectedDates([dayjs(searchData.dateIn), dayjs(searchData.dateOut)]);
    }
    if (searchData.city) {
      setSelectedCity(searchData.city);
      form.setFieldsValue({ city: searchData.city });
    }
    if (searchData.guestCounts) {
      setGuestCounts(searchData.guestCounts);
    }
    
    // Set form values
    form.setFieldsValue({
      guestInfo: guestSummary,
      city: searchData.city || '',
      dates: searchData.dateIn && searchData.dateOut ? [dayjs(searchData.dateIn), dayjs(searchData.dateOut)] : null
    });
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // Lấy danh sách thành phố
      const citiesResponse = await getCities();
      if (citiesResponse && citiesResponse.DT) {
        setCities(citiesResponse.DT);
      }

      // Lấy tất cả khách sạn
      const hotelsResponse = await getAllHotels();
      if (hotelsResponse && hotelsResponse.DT) {
        // Chỉ hiển thị khách sạn đang hoạt động
        const activeHotels = hotelsResponse.DT.filter(hotel => hotel.hotelStatus === true);
        setAllHotels(activeHotels);
        setHotels(activeHotels);
        setPagination(prev => ({
          ...prev,
          total: activeHotels.length
        }));
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
      notiApi.error({
        message: 'Lỗi',
        description: 'Không thể tải dữ liệu. Vui lòng thử lại.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (values) => {
    try {
      setLoading(true);
      
      const { city, dates } = values;
      
      // Kiểm tra dữ liệu đầu vào
      if (!city) {
        notiApi.warning({
          message: 'Thiếu thông tin',
          description: 'Vui lòng chọn thành phố để tìm kiếm.'
        });
        return;
      }

      if (!dates || dates.length !== 2) {
        notiApi.warning({
          message: 'Thiếu thông tin',
          description: 'Vui lòng chọn ngày nhận phòng và trả phòng.'
        });
        return;
      }

      setSelectedDates(dates);
      setSelectedCity(city);

      // Tìm kiếm khách sạn có sẵn theo tiêu chí chi tiết
      const searchCriteria = {
        city: city,
        dateIn: dates[0].format('YYYY-MM-DD'),
        dateOut: dates[1].format('YYYY-MM-DD'),
        roomCount: guestCounts.rooms,
        guestCount: guestCounts.adults + guestCounts.children
      };

      const response = await searchAvailableHotels(searchCriteria);
      if (response && response.DT) {
        // Filter thêm lần nữa để đảm bảo chỉ có khách sạn đang hoạt động
        const activeHotels = response.DT.filter(hotel => hotel.hotelStatus !== false);
        setHotels(activeHotels);
        setPagination(prev => ({
          ...prev,
          current: 1,
          total: activeHotels.length
        }));
        
        if (activeHotels.length === 0) {
          notiApi.info({
            message: 'Không có kết quả',
            description: 'Không tìm thấy khách sạn nào đang hoạt động phù hợp với tiêu chí tìm kiếm của bạn.'
          });
        } else {
          notiApi.success({
            message: 'Tìm kiếm thành công',
            description: `Tìm thấy ${activeHotels.length} khách sạn đang hoạt động phù hợp với yêu cầu của bạn.`
          });
        }
      }
    } catch (error) {
      console.error('Lỗi khi tìm kiếm:', error);
      notiApi.error({
        message: 'Lỗi tìm kiếm',
        description: 'Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setSelectedDates(null);
    setSelectedCity(null);
    setGuestCounts({ rooms: 1, adults: 2, children: 0 });
    // Chỉ hiển thị khách sạn đang hoạt động
    const activeHotels = allHotels.filter(hotel => hotel.hotelStatus === true);
    setHotels(activeHotels);
    setPagination(prev => ({
      ...prev,
      current: 1,
      total: activeHotels.length
    }));
    dispatch(resetSearch());
  };

  const handlePageChange = (page, pageSize) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize: pageSize
    }));
  };

  // Lấy dữ liệu cho trang hiện tại
  const getCurrentPageData = () => {
    const startIndex = (pagination.current - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    if (!Array.isArray(hotels)) {
      return [];
    }
    
    return hotels.slice(startIndex, endIndex);
  };

  // Hàm tạo giới hạn ngày cho DatePicker
  const disabledDate = (current) => {
    // Không cho phép chọn ngày trong quá khứ
    return current && current < dayjs().startOf('day');
  };

  const handleViewDetail = (hotelId) => {
    // Chuyển đến trang chi tiết khách sạn với thông tin tìm kiếm
    navigate(`/hotel-detail/${hotelId}`, {
      state: {
        dateIn: selectedDates ? selectedDates[0].format('YYYY-MM-DD') : null,
        dateOut: selectedDates ? selectedDates[1].format('YYYY-MM-DD') : null,
        guestCounts: guestCounts
      }
    });
  };

  return (
    <div className="room">
      {contextHolder}
      <div className="room__header">
        <h1 className="room__title">Tìm Kiếm Khách Sạn</h1>
        <p className="room__subtitle">Khám phá những khách sạn tốt nhất cho chuyến đi của bạn</p>
      </div>

      {/* Form tìm kiếm */}
      <div className="room__search">
        <Form form={form} onFinish={handleSearch} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Form.Item 
                label="Thành phố" 
                name="city"
                rules={[{ required: true, message: 'Vui lòng chọn thành phố!' }]}
              >
                <Select 
                  placeholder="Chọn thành phố"
                  loading={loading}
                  showSearch
                  filterOption={(input, option) =>
                    option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {cities.map(city => (
                    <Option key={city} value={city}>{city}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            
            <Col xs={24} sm={12} md={6}>
              <Form.Item 
                label="Ngày nhận - trả phòng" 
                name="dates"
                rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
              >
                <RangePicker 
                  style={{ width: '100%' }}
                  placeholder={['Ngày nhận phòng', 'Ngày trả phòng']}
                  disabledDate={disabledDate}
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Form.Item label="Số phòng và khách" name="guestInfo">
                <div className="room__guest-selector">
                  <Input
                    value={guestSummary}
                    readOnly
                    onClick={() => setGuestSelectorVisible(!guestSelectorVisible)}
                    placeholder="Chọn số phòng và khách"
                    suffix={<SearchOutlined />}
                  />
                  {guestSelectorVisible && (
                    <div className="room__guest-dropdown">
                      <div className="room__guest-item">
                        <span>Phòng</span>
                        <div className="room__guest-controls">
                          <Button size="small" onClick={() => handleGuestChange('rooms', 'decrease')}>-</Button>
                          <span>{guestCounts.rooms}</span>
                          <Button size="small" onClick={() => handleGuestChange('rooms', 'increase')}>+</Button>
                        </div>
                      </div>
                      <div className="room__guest-item">
                        <span>Người lớn</span>
                        <div className="room__guest-controls">
                          <Button size="small" onClick={() => handleGuestChange('adults', 'decrease')}>-</Button>
                          <span>{guestCounts.adults}</span>
                          <Button size="small" onClick={() => handleGuestChange('adults', 'increase')}>+</Button>
                        </div>
                      </div>
                      <div className="room__guest-item">
                        <span>Trẻ em</span>
                        <div className="room__guest-controls">
                          <Button size="small" onClick={() => handleGuestChange('children', 'decrease')}>-</Button>
                          <span>{guestCounts.children}</span>
                          <Button size="small" onClick={() => handleGuestChange('children', 'increase')}>+</Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Form.Item label=" ">
                <div className="room__search-buttons">
                  <Button type="primary" htmlType="submit" loading={loading} icon={<SearchOutlined />}>
                    Tìm kiếm
                  </Button>
                  <Button onClick={handleReset}>
                    Đặt lại
                  </Button>
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>

      <Divider />

      {/* Danh sách khách sạn */}
      <div className="room__content">
        <Row gutter={[24, 24]}>
          {getCurrentPageData().map(hotel => (
            <Col xs={24} sm={24} md={12} lg={12} xl={12} key={hotel.hotelId}>
              <Card className="room__card" loading={loading}>
                <div className="room__card-image">
                  <img 
                    src={hotel.hotelImage || 'https://via.placeholder.com/400x250?text=Hotel+Image'} 
                    alt={hotel.hotelName}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x250?text=Hotel+Image';
                    }}
                  />
                </div>
                <div className="room__card-info">
                  <div className="room__card-header">
                    <h2 className="room__card-name">{hotel.hotelName}</h2>
                    <div className="room__card-type">
                      <span className="room__card-type-badge">{hotel.hotelType}</span>
                    </div>
                  </div>
                  
                  <div className="room__card-location">
                    <span className="room__card-location-icon">Đ/C: </span>
                    <span className="room__card-location-text">{hotel.address}</span>
                  </div>
                  
                  <div className="room__card-description">
                    <p>{hotel.description || 'Khách sạn sang trọng với đầy đủ tiện nghi hiện đại'}</p>
                  </div>
                  
                  <Divider className="room__card-divider" />
                  
                  <div className="room__card-actions">
                    <Button 
                      type="primary" 
                      className="room__card-btn"
                      onClick={() => handleViewDetail(hotel.hotelId)}
                      block
                    >
                      Xem Chi Tiết
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      
      {/* Pagination */}
      <div className="room__pagination">
        <Pagination
          current={pagination.current}
          total={pagination.total}
          pageSize={pagination.pageSize}
          showSizeChanger
          showQuickJumper
          showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} khách sạn`}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default Room;
