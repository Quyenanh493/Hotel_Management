import React from 'react';
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
  SmileOutlined,
  QuestionOutlined
} from '@ant-design/icons';

const ICON_MAP = {
  'wifi': WifiOutlined,
  'coffee': CoffeeOutlined,
  'car': CarOutlined,
  'spa': HeartOutlined,
  'laundry': SettingOutlined,
  'minibar': ShopOutlined,
  'room-service': PhoneOutlined,
  'gym': TrophyOutlined,
  'pool': EnvironmentOutlined,
  'bed': RestOutlined,
  'safe': SafetyOutlined,
  'concierge': CustomerServiceOutlined,
  'bank': BankOutlined,
  'balcony': HomeOutlined,
  'air-condition': ThunderboltOutlined,
  'elevator': ApartmentOutlined,
  'maintenance': ToolOutlined,
  'gift': GiftOutlined,
  'clock': ClockCircleOutlined,
  'meeting': TeamOutlined,
  'restaurant': FireOutlined,
  'newspaper': SnippetsOutlined,
  'library': BookOutlined,
  'photography': CameraOutlined,
  'music': SoundOutlined,
  'internet': GlobalOutlined,
  'events': CalendarOutlined,
  'vip': StarOutlined,
  'medical': MedicineBoxOutlined,
  'entertainment': SmileOutlined
};

const IconRenderer = ({ iconType, style = {}, ...props }) => {
  const IconComponent = ICON_MAP[iconType] || QuestionOutlined;
  
  return <IconComponent style={style} {...props} />;
};

export default IconRenderer; 