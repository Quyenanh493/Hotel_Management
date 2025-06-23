import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Result, Typography, Card, Button, Divider } from 'antd';
import { CloseCircleOutlined, HomeOutlined, ReloadOutlined } from '@ant-design/icons';
import './PaymentFailure.scss';

const { Title, Text, Paragraph } = Typography;

function PaymentFailure() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const error = queryParams.get('error');
  const code = queryParams.get('code');
  
  const handleRetry = () => {
    // Navigate back to the room search page to start a new booking
    navigate('/room');
  };
  
  return (
    <div className="payment-failure-container">
      <Card className="payment-result-card">
        <Result
          status="error"
          icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
          title="THANH TOÁN THẤT BẠI"
          subTitle={
            <div>
              <p>Đã xảy ra lỗi trong quá trình thanh toán</p>
              {code && <p>Mã lỗi: {code}</p>}
            </div>
          }
        />
        
        <Divider />
        
        <div className="error-details">
          <Title level={4}>Chi tiết lỗi</Title>
          <Paragraph>
            {error || 'Không thể hoàn tất giao dịch thanh toán. Vui lòng kiểm tra thông tin thanh toán và thử lại.'}
          </Paragraph>
          
          <Paragraph>
            <Text strong>Các nguyên nhân có thể:</Text>
            <ul>
              <li>Thẻ/tài khoản của bạn không đủ số dư để thực hiện giao dịch</li>
              <li>Thông tin thanh toán không chính xác</li>
              <li>Giao dịch đã bị hủy</li>
              <li>Vấn đề kết nối internet hoặc hệ thống thanh toán</li>
            </ul>
          </Paragraph>
          
          <Paragraph>
            <Text type="secondary">
              Nếu bạn cho rằng đây là lỗi, vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi.
            </Text>
          </Paragraph>
        </div>
        
        <Divider />
        
        <div className="action-buttons">
          <Button type="primary" icon={<HomeOutlined />} onClick={() => navigate('/')}>
            Trang chủ
          </Button>
          <Button icon={<ReloadOutlined />} onClick={handleRetry}>
            Thử lại
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default PaymentFailure; 