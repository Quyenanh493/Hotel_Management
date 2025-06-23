import db from '../models';
import { Op, fn, col, literal } from 'sequelize';

const dashboardService = {
  // Tổng doanh thu đã thu về (chỉ tính các payment đã Paid)
  getTotalRevenue: async (year) => {
    try {
      if (!year || isNaN(year)) {
        year = new Date().getFullYear();
      }

      const total = await db.Payment.sum('amount', {
        where: { 
          statusPayment: 'Paid',
          createdAt: {
            [Op.gte]: new Date(`${year}-01-01`),
            [Op.lte]: new Date(`${year}-12-31`)
          }
        }
      });
      return {
        EM: 'Lấy tổng doanh thu thành công',
        EC: 0,
        DT: total || 0
      };
    } catch (error) {
      console.error('Error in getTotalRevenue:', error);
      return {
        EM: 'Lỗi khi lấy tổng doanh thu',
        EC: -1,
        DT: 0
      };
    }
  },

  // Tổng số phòng khách sạn
  getRoomCount: async () => {
    try {
      const count = await db.Room.count();
      return {
        EM: 'Lấy số lượng phòng thành công',
        EC: 0,
        DT: count
      };
    } catch (error) {
      console.error('Error in getRoomCount:', error);
      return {
        EM: 'Lỗi khi lấy số lượng phòng',
        EC: -1,
        DT: 0
      };
    }
  },

  // Số khách hàng đăng ký theo tháng trong năm
  getCustomerRegisterByMonth: async (year) => {
    try {
      if (!year || isNaN(year)) {
        return {
          EM: 'Năm không hợp lệ',
          EC: 1,
          DT: []
        };
      }

      const bookings = await db.FactBooking.findAll({
        attributes: [
          [fn('MONTH', col('orderDate')), 'month'],
          [fn('COUNT', col('customerId')), 'count']
        ],
        where: {
          orderDate: {
            [Op.gte]: new Date(`${year}-01-01`),
            [Op.lte]: new Date(`${year}-12-31`)
          }
        },
        group: [fn('MONTH', col('orderDate'))],
        raw: true
      });

      // Tạo mảng 12 tháng với số lượng 0
      const monthlyData = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        count: 0
      }));

      // Cập nhật số liệu thực tế
      bookings.forEach(booking => {
        monthlyData[booking.month - 1].count = booking.count;
      });

      return {
        EM: 'Lấy số liệu đăng ký theo tháng thành công',
        EC: 0,
        DT: monthlyData
      };
    } catch (error) {
      console.error('Error in getCustomerRegisterByMonth:', error);
      return {
        EM: 'Lỗi khi lấy số liệu đăng ký theo tháng',
        EC: -1,
        DT: []
      };
    }
  },

  // Tổng tiền kiếm được của mỗi khách sạn trong năm
  getRevenueByHotel: async (year) => {
    try {
      if (!year || isNaN(year)) {
        return {
          EM: 'Năm không hợp lệ',
          EC: 1,
          DT: []
        };
      }

      // Lấy tất cả các khách sạn
      const hotels = await db.Hotel.findAll({
        attributes: ['hotelId', 'hotelName'],
        raw: true
      });

      // Lấy doanh thu từng khách sạn
      const revenueData = await db.FactBookingDetail.findAll({
        attributes: [
          [db.sequelize.col('FactBooking.hotelId'), 'hotelId'],
          [db.sequelize.fn('SUM', db.sequelize.col('totalAmount')), 'totalRevenue']
        ],
        include: [
          {
            model: db.FactBooking,
            attributes: [],
            where: {
              orderDate: {
                [Op.gte]: new Date(`${year}-01-01`),
                [Op.lte]: new Date(`${year}-12-31`)
              }
            }
          }
        ],
        where: {
          bookingStatus: {
            [Op.in]: ['Completed', 'Confirmed']
          }
        },
        group: ['FactBooking.hotelId'],
        raw: true
      });

      // Gộp thông tin khách sạn với doanh thu
      const result = hotels.map(hotel => {
        const found = revenueData.find(r => r.hotelId === hotel.hotelId);
        return {
          hotelId: hotel.hotelId, 
          hotelName: hotel.hotelName,
          totalRevenue: found ? Number(found.totalRevenue) : 0
        };
      });

      return {
        EM: 'Lấy doanh thu theo khách sạn thành công',
        EC: 0,
        DT: result
      };
    } catch (error) {
      console.error('Error in getRevenueByHotel:', error);
      return {
        EM: 'Lỗi khi lấy doanh thu theo khách sạn',
        EC: -1,
        DT: []
      };
    }
  },

  // Đếm tổng số lượng đơn đặt phòng (booking count)
  getBookingCount: async (year) => {
    try {
      if (!year || isNaN(year)) {
        year = new Date().getFullYear();
      }

      const count = await db.FactBooking.count({
        where: {
          orderDate: {
            [Op.gte]: new Date(`${year}-01-01`),
            [Op.lte]: new Date(`${year}-12-31`)
          }
        }
      });

      return {
        EM: 'Lấy số lượng đơn đặt phòng thành công',
        EC: 0,
        DT: count
      };
    } catch (error) {
      console.error('Error in getBookingCount:', error);
      return {
        EM: 'Lỗi khi lấy số lượng đơn đặt phòng',
        EC: -1,
        DT: 0
      };
    }
  },

};

export default dashboardService; 