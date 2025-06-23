import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import { useEffect, useState } from 'react';

/**
 * Component bảo vệ route, chỉ cho phép truy cập khi đã có thông tin đặt phòng
 * @param {Object} props 
 * @param {React.ReactNode} props.children Component con
 * @returns {React.ReactNode}
 */
const ProtectedBookingRoute = ({ children }) => {
  const bookingInfo = useSelector((state) => state.booking.bookingInfo);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const [isValidBooking, setIsValidBooking] = useState(false);
  
  useEffect(() => {
    // Kiểm tra thông tin đặt phòng từ Redux store
    const hasValidReduxBooking = bookingInfo && 
                              bookingInfo.roomId && 
                              bookingInfo.checkInDate && 
                              bookingInfo.checkOutDate;
                              
    // Kiểm tra thông tin đặt phòng từ localStorage
    let hasValidLocalBooking = false;
    try {
      const savedState = JSON.parse(localStorage.getItem('bookingState') || '{}');
      hasValidLocalBooking = savedState && 
                         savedState.roomId && 
                         savedState.dateIn && 
                         savedState.dateOut;
    } catch (error) {
      console.error('Lỗi khi đọc bookingState từ localStorage:', error);
      hasValidLocalBooking = false;
    }
    
    // Cả thông tin từ Redux và localStorage đều phải hợp lệ
    const isValid = hasValidReduxBooking && hasValidLocalBooking;
    setIsValidBooking(isValid);
    
    if (!isValid) {
      // Hiển thị thông báo khi không có thông tin đặt phòng hợp lệ
      api.warning({
        message: 'Thông báo',
        description: 'Vui lòng chọn phòng trước khi tiếp tục đặt tiện ích.',
        duration: 3,
      });
      
      // Chuyển hướng sau khi hiển thị thông báo
      navigate('/room', { replace: true });
    }
  }, [bookingInfo, api, navigate]);

  if (!isValidBooking) {
    return contextHolder; // Render notification context
  }

  // Nếu đã có thông tin đặt phòng hợp lệ, hiển thị component con
  return (
    <>
      {contextHolder}
      {children}
    </>
  );
};

export default ProtectedBookingRoute; 