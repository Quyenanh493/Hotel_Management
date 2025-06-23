import request from '../utils/request';
import { getCookie } from '../helper/cookie';

// Lấy thông tin chi tiết phòng
export const getRoomDetails = async (roomId) => {
  try {
    const response = await request.get(`/rooms/${roomId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin phòng ID ${roomId}:`, error);
    throw error;
  }
};

// Tạo booking mới
export const createBooking = async (bookingData) => {
  try {
    const response = await request.post('/rooms/booking', bookingData);
    return response;
  } catch (error) {
    console.error('Lỗi khi tạo booking:', error);
    throw error;
  }
};

// Tạo URL thanh toán VNPay
export const createPaymentUrl = async (bookingId, ipAddr) => {
  try {
    const response = await request.post('/payment/create-payment-url', { 
      bookingId,
      ipAddr 
    });
    return response;
  } catch (error) {
    console.error('Lỗi khi tạo URL thanh toán VNPay:', error);
    throw error;
  }
};

// Kiểm tra trạng thái thanh toán
export const checkPaymentStatus = async (bookingId) => {
  try {
    const response = await request.get(`/payment/status/${bookingId}`);
    return response;
  } catch (error) {
    console.error('Lỗi khi kiểm tra trạng thái thanh toán:', error);
    throw error;
  }
};

// Truy vấn kết quả giao dịch VNPay theo mã giao dịch
export const queryTransactionStatus = async (transactionCode) => {
  try {
    const response = await request.get(`/payment/query-dr/${transactionCode}`);
    return response;
  } catch (error) {
    console.error('Lỗi khi truy vấn kết quả giao dịch:', error);
    throw error;
  }
};

// Lấy lịch sử đặt phòng
export const getBookingHistory = async () => {
  try {
    const response = await request.get('/customers/booking-history');
    return response;
  } catch (error) {
    console.error('Lỗi khi lấy lịch sử đặt phòng:', error);
    throw error;
  }
};

// Lấy lịch sử đặt phòng từ factBooking API
export const getFactBookingHistory = async (customerId) => {
  try {
    // Kiểm tra token trước khi gọi API
    const accessToken = getCookie('accessToken');
    if (!accessToken || accessToken === 'undefined' || accessToken === 'null') {
      console.warn('Access token không hợp lệ, có thể cần đăng nhập lại');
      throw new Error('Bạn cần đăng nhập để xem lịch sử đặt phòng');
    }

    // Nếu có customerId, sẽ lấy theo customerId, ngược lại lấy theo token
    if (customerId) {
      const response = await request.get(`/bookings/customer/${customerId}`);
      return response;
    } else {
      // Mặc định lấy theo token đã xác thực (khách hàng hiện tại)
      const response = await request.get('/bookings');
      return response;
    }
  } catch (error) {
    console.error('Lỗi khi lấy lịch sử đặt phòng từ factBooking:', error);
    
    // Xử lý lỗi cụ thể nếu cần
    if (error.response) {
      console.log('Response status:', error.response.status);
      if (error.response.status === 401) {
        console.log('Unauthorized access. User may need to login again.');
      }
    }
    
    throw error;
  }
};

// Hủy đặt phòng
export const cancelBooking = async (bookingId) => {
  try {
    const response = await request.delete(`/bookings/${bookingId}`);
    return response;
  } catch (error) {
    console.error('Lỗi khi hủy đặt phòng:', error);
    throw error;
  }
};

// Hoàn tiền giao dịch (chỉ dành cho admin)
export const refundTransaction = async (data) => {
  try {
    const response = await request.post('/payment/refund', data);
    return response;
  } catch (error) {
    console.error('Lỗi khi hoàn tiền giao dịch:', error);
    throw error;
  }
};