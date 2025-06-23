import factBookingService from '../services/factBookingService';

const factBookingController = {
    // Lấy tất cả đơn đặt phòng
    getAllBookings: async (req, res, next) => {
        try {
            let data;
            
            // Nếu là khách hàng đang gọi API (đã được lưu trong req.customerInfo từ middleware)
            if (req.customerInfo) {
                // Lấy danh sách đơn đặt phòng của khách hàng hiện tại
                data = await factBookingService.getBookingsByCustomerId(req.customerInfo.customerId);
            } else {
                // Mặc định lấy tất cả đơn đặt phòng (cho admin/staff)
                data = await factBookingService.getAllBookings();
            }
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in getAllBookings:", error);
            next(error);
        }
    },

    // Lấy đơn đặt phòng theo ID
    getBookingById: async (req, res, next) => {
        try {
            const bookingId = req.params.id;
            let data = await factBookingService.getBookingById(bookingId);
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in getBookingById:", error);
            next(error);
        }
    },

    // Lấy đơn đặt phòng theo Customer ID
    getBookingsByCustomerId: async (req, res, next) => {
        try {
            const customerId = req.params.customerId;
            let data = await factBookingService.getBookingsByCustomerId(customerId);
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in getBookingsByCustomerId:", error);
            next(error);
        }
    },

    // Tạo đơn đặt phòng mới
    createBooking: async (req, res, next) => {
        try {
            const bookingData = req.body;
            let data = await factBookingService.createBooking(bookingData);
            
            return res.status(201).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in createBooking:", error);
            next(error);
        }
    },

    // Cập nhật đơn đặt phòng
    updateBooking: async (req, res, next) => {
        try {
            const bookingId = req.params.id;
            const bookingData = req.body;
            let data = await factBookingService.updateBooking(bookingId, bookingData);
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in updateBooking:", error);
            next(error);
        }
    },

    // Xóa đơn đặt phòng
    deleteBooking: async (req, res, next) => {
        try {
            const bookingId = req.params.id;
            let data = await factBookingService.deleteBooking(bookingId);
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in deleteBooking:", error);
            next(error);
        }
    }
};

export default factBookingController; 