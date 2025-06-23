import factBookingDetailService from '../services/factBookingDetailService';

const factBookingDetailController = {
    // Lấy tất cả chi tiết đặt phòng
    getAllBookingDetails: async (req, res) => {
        try {
            const result = await factBookingDetailService.getAllBookingDetails();
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in getAllBookingDetails controller:", error);
            return res.status(500).json({
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            });
        }
    },

    // Lấy chi tiết đặt phòng theo ID
    getBookingDetailById: async (req, res) => {
        try {
            const bookingDetailId = req.params.id;
            const result = await factBookingDetailService.getBookingDetailById(bookingDetailId);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in getBookingDetailById controller:", error);
            return res.status(500).json({
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            });
        }
    },
    
    // Lấy tất cả chi tiết đặt phòng theo bookingId
    getBookingDetailsByBookingId: async (req, res) => {
        try {
            const bookingId = req.params.bookingId;
            const result = await factBookingDetailService.getBookingDetailsByBookingId(bookingId);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in getBookingDetailsByBookingId controller:", error);
            return res.status(500).json({
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            });
        }
    },

    // Tạo chi tiết đặt phòng mới
    createBookingDetail: async (req, res) => {
        try {
            const bookingDetailData = req.body;
            const result = await factBookingDetailService.createBookingDetail(bookingDetailData);
            return res.status(201).json(result);
        } catch (error) {
            console.error("Error in createBookingDetail controller:", error);
            return res.status(500).json({
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            });
        }
    },

    // Cập nhật thông tin chi tiết đặt phòng
    updateBookingDetail: async (req, res) => {
        try {
            const bookingDetailId = req.params.id;
            const bookingDetailData = req.body;
            const result = await factBookingDetailService.updateBookingDetail(bookingDetailId, bookingDetailData);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in updateBookingDetail controller:", error);
            return res.status(500).json({
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            });
        }
    },

    // Xóa chi tiết đặt phòng
    deleteBookingDetail: async (req, res) => {
        try {
            const bookingDetailId = req.params.id;
            const result = await factBookingDetailService.deleteBookingDetail(bookingDetailId);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in deleteBookingDetail controller:", error);
            return res.status(500).json({
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            });
        }
    }
};

export default factBookingDetailController; 