import request from '../utils/request';

// Lấy tất cả đơn đặt phòng
export const getAllBookings = async () => {
  try {
    const response = await request.get('bookings');
    return response;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn đặt phòng:', error);
    throw error;
  }
};

// Lấy đơn đặt phòng theo ID
export const getBookingById = async (bookingId) => {
  try {
    const response = await request.get(`bookings/${bookingId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin đơn đặt phòng ID ${bookingId}:`, error);
    throw error;
  }
};

// Lấy đơn đặt phòng theo khách hàng
export const getBookingsByCustomerId = async (customerId) => {
  try {
    const response = await request.get(`bookings/customer/${customerId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi lấy đơn đặt phòng của khách hàng ${customerId}:`, error);
    throw error;
  }
};

// Xóa đơn đặt phòng
export const deleteBooking = async (bookingId) => {
  try {
    const response = await request.delete(`bookings/${bookingId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi xóa đơn đặt phòng ID ${bookingId}:`, error);
    throw error;
  }
}; 