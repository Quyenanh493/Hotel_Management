import request from '../utils/request';

// Lấy tổng doanh thu
export const getTotalRevenue = async (year) => {
  try {
    const url = year ? `dashboard/revenue?year=${year}` : 'dashboard/revenue';
    const response = await request.get(url);
    return response.DT;
  } catch (error) {
    console.error('Lỗi khi lấy tổng doanh thu:', error);
    throw error;
  }
};


// Lấy số lượng đơn đặt phòng
export const getBookingCount = async (year) => {
  try {
    const url = year ? `dashboard/bookings/count?year=${year}` : 'dashboard/bookings/count';
    const response = await request.get(url);
    return response.DT;
  } catch (error) {
    console.error('Lỗi khi lấy số lượng đơn đặt phòng:', error);
    throw error;
  }
};

// Lấy số lượng phòng
export const getRoomCount = async () => {
  try {
    const response = await request.get('dashboard/rooms');
    return response.DT;
  } catch (error) {
    console.error('Lỗi khi lấy số lượng phòng:', error);
    throw error;
  }
};

// Lấy số liệu đăng ký theo tháng
export const getCustomerRegisterByMonth = async (year) => {
  try {
    const response = await request.get(`dashboard/customers/monthly?year=${year}`);
    return response.DT;
  } catch (error) {
    console.error('Lỗi khi lấy số liệu đăng ký theo tháng:', error);
    throw error;
  }
};

// Lấy doanh thu theo khách sạn
export const getRevenueByHotel = async (year) => {
  try {
    const response = await request.get(`dashboard/revenue/hotels?year=${year}`);
    return response.DT;
  } catch (error) {
    console.error('Lỗi khi lấy doanh thu theo khách sạn:', error);
    throw error;
  }
};
