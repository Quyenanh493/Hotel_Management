import request from '../utils/request';

// Lấy chi tiết đơn đặt phòng theo ID
export const getBookingDetailById = async (bookingDetailId) => {
  try {
    const response = await request.get(`booking-details/${bookingDetailId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi lấy chi tiết đơn đặt phòng ID ${bookingDetailId}:`, error);
    throw error;
  }
};

// Lấy tất cả chi tiết của một đơn đặt phòng
export const getBookingDetailsByBookingId = async (bookingId) => {
  try {
    const response = await request.get(`booking-details/booking/${bookingId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi lấy chi tiết của đơn đặt phòng ID ${bookingId}:`, error);
    throw error;
  }
}; 