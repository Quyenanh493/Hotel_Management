import request from '../utils/request';

// Lấy tất cả các thanh toán
export const getAllPayments = async () => {
  try {
    const response = await request.get('payment');
    return response;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách thanh toán:', error);
    throw error;
  }
};

// Lấy thông tin thanh toán theo ID đặt phòng
export const getPaymentByBookingId = async (bookingId) => {
  try {
    const response = await request.get(`payment/${bookingId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin thanh toán cho đặt phòng ID ${bookingId}:`, error);
    throw error;
  }
};

// Kiểm tra trạng thái thanh toán theo ID đặt phòng
export const checkPaymentStatus = async (bookingId) => {
  try {
    const response = await request.get(`payment/status/${bookingId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi kiểm tra trạng thái thanh toán cho đặt phòng ID ${bookingId}:`, error);
    throw error;
  }
};

// Hoàn tiền giao dịch
export const refundTransaction = async (data) => {
  try {
    const response = await request.post('payment/refund', data);
    return response;
  } catch (error) {
    console.error('Lỗi khi hoàn tiền giao dịch:', error);
    throw error;
  }
};

// Truy vấn kết quả giao dịch
export const queryTransactionStatus = async (transactionCode) => {
  try {
    const response = await request.get(`payment/query-dr/${transactionCode}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi truy vấn trạng thái giao dịch ${transactionCode}:`, error);
    throw error;
  }
}; 