import express from 'express';
import dashboardController from '../controllers/dashboardController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

// Tất cả các route dashboard đều yêu cầu xác thực
router.use(authMiddleware.verifyToken);

// Lấy tổng doanh thu
router.get('/revenue', dashboardController.getTotalRevenue);

// Lấy số lượng phòng
router.get('/rooms', dashboardController.getRoomCount);

// Lấy số lượng đơn đặt phòng
router.get('/bookings/count', dashboardController.getBookingCount);

// Lấy số liệu đăng ký theo tháng
router.get('/customers/monthly', dashboardController.getCustomerRegisterByMonth);

// Lấy doanh thu theo khách sạn
router.get('/revenue/hotels', dashboardController.getRevenueByHotel);


export default router; 