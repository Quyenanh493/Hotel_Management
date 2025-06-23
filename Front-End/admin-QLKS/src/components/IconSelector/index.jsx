import React, { useState } from 'react';
import { Card, Row, Col, Typography } from 'antd';
import {
  WifiOutlined,
  CoffeeOutlined,
  CarOutlined,
  CustomerServiceOutlined,
  SettingOutlined,
  ShopOutlined,
  PhoneOutlined,
  TrophyOutlined,
  EnvironmentOutlined,
  SafetyOutlined,
  HeartOutlined,
  BankOutlined,
  HomeOutlined,
  ThunderboltOutlined,
  ApartmentOutlined,
  ToolOutlined,
  GiftOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  RestOutlined,
  FireOutlined,
  SnippetsOutlined,
  BookOutlined,
  CameraOutlined,
  SoundOutlined,
  GlobalOutlined,
  CalendarOutlined,
  StarOutlined,
  MedicineBoxOutlined,
  SmileOutlined
} from '@ant-design/icons';
import './IconSelector.scss';

const { Text } = Typography;

const AMENITY_ICONS = [
  { key: 'wifi', icon: <WifiOutlined />, name: 'Wi-Fi', value: 'wifi' },
  { key: 'coffee', icon: <CoffeeOutlined />, name: 'Breakfast', value: 'coffee' },
  { key: 'car', icon: <CarOutlined />, name: 'Airport Transfer', value: 'car' },
  { key: 'spa', icon: <HeartOutlined />, name: 'Spa Service', value: 'spa' },
  { key: 'laundry', icon: <SettingOutlined />, name: 'Laundry', value: 'laundry' },
  { key: 'minibar', icon: <ShopOutlined />, name: 'Mini Bar', value: 'minibar' },
  { key: 'room-service', icon: <PhoneOutlined />, name: 'Room Service', value: 'room-service' },
  { key: 'gym', icon: <TrophyOutlined />, name: 'Gym Access', value: 'gym' },
  { key: 'pool', icon: <EnvironmentOutlined />, name: 'Swimming Pool', value: 'pool' },
  { key: 'bed', icon: <RestOutlined />, name: 'Extra Bed', value: 'bed' },
  { key: 'safe', icon: <SafetyOutlined />, name: 'Safe Box', value: 'safe' },
  { key: 'concierge', icon: <CustomerServiceOutlined />, name: 'Concierge', value: 'concierge' },
  { key: 'bank', icon: <BankOutlined />, name: 'Banking', value: 'bank' },
  { key: 'balcony', icon: <HomeOutlined />, name: 'Balcony', value: 'balcony' },
  { key: 'air-condition', icon: <ThunderboltOutlined />, name: 'Air Conditioning', value: 'air-condition' },
  { key: 'elevator', icon: <ApartmentOutlined />, name: 'Elevator', value: 'elevator' },
  { key: 'maintenance', icon: <ToolOutlined />, name: 'Maintenance', value: 'maintenance' },
  { key: 'gift', icon: <GiftOutlined />, name: 'Gift Shop', value: 'gift' },
  { key: 'clock', icon: <ClockCircleOutlined />, name: '24h Service', value: 'clock' },
  { key: 'meeting', icon: <TeamOutlined />, name: 'Meeting Room', value: 'meeting' },
  { key: 'restaurant', icon: <FireOutlined />, name: 'Restaurant', value: 'restaurant' },
  { key: 'newspaper', icon: <SnippetsOutlined />, name: 'Newspaper', value: 'newspaper' },
  { key: 'library', icon: <BookOutlined />, name: 'Library', value: 'library' },
  { key: 'photography', icon: <CameraOutlined />, name: 'Photography', value: 'photography' },
  { key: 'music', icon: <SoundOutlined />, name: 'Music', value: 'music' },
  { key: 'internet', icon: <GlobalOutlined />, name: 'Internet', value: 'internet' },
  { key: 'events', icon: <CalendarOutlined />, name: 'Events', value: 'events' },
  { key: 'vip', icon: <StarOutlined />, name: 'VIP Service', value: 'vip' },
  { key: 'medical', icon: <MedicineBoxOutlined />, name: 'Medical', value: 'medical' },
  { key: 'entertainment', icon: <SmileOutlined />, name: 'Entertainment', value: 'entertainment' }
];

const IconSelector = ({ value, onChange, disabled = false }) => {
  const [selectedIcon, setSelectedIcon] = useState(value || '');

  const handleIconSelect = (iconValue) => {
    setSelectedIcon(iconValue);
    if (onChange) {
      onChange(iconValue);
    }
  };

  return (
    <div className="icon-selector">
      <Text strong style={{ marginBottom: 16, display: 'block' }}>
        Chọn icon cho tiện nghi:
      </Text>
      <div className="selected-icon-preview">
        {selectedIcon && (
          <Card size="small" style={{ marginBottom: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>
              {AMENITY_ICONS.find(icon => icon.value === selectedIcon)?.icon}
            </div>
            <Text type="secondary">
              {AMENITY_ICONS.find(icon => icon.value === selectedIcon)?.name}
            </Text>
          </Card>
        )}
      </div>
      <div className="icon-grid">
        <Row gutter={[8, 8]}>
          {AMENITY_ICONS.map((iconItem) => (
            <Col key={iconItem.key} span={4}>
              <Card
                size="small"
                hoverable={!disabled}
                className={`icon-card ${selectedIcon === iconItem.value ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
                onClick={() => !disabled && handleIconSelect(iconItem.value)}
                style={{ 
                  textAlign: 'center', 
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  border: selectedIcon === iconItem.value ? '2px solid #1890ff' : '1px solid #d9d9d9'
                }}
              >
                <div style={{ fontSize: 20, marginBottom: 4 }}>
                  {iconItem.icon}
                </div>
                <Text style={{ fontSize: 10 }} ellipsis>
                  {iconItem.name}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default IconSelector; 