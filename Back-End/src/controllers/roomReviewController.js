import roomReviewService from '../services/roomReviewService';

const roomReviewController = {
    // Lấy tất cả đánh giá phòng
    getAllRoomReviews: async (req, res, next) => {
        try {
            let data = await roomReviewService.getAllRoomReviews();
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in getAllRoomReviews:", error);
            next(error);
        }
    },

    // Lấy đánh giá phòng theo ID
    getRoomReviewById: async (req, res, next) => {
        try {
            const reviewId = req.params.id;
            let data = await roomReviewService.getRoomReviewById(reviewId);
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in getRoomReviewById:", error);
            next(error);
        }
    },

    // Lấy tất cả đánh giá theo roomId
    getRoomReviewsByRoomId: async (req, res, next) => {
        try {
            const roomId = req.params.roomId;
            let data = await roomReviewService.getRoomReviewsByRoomId(roomId);
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in getRoomReviewsByRoomId:", error);
            next(error);
        }
    },

    // Lấy tất cả đánh giá theo hotelId
    getRoomReviewsByHotelId: async (req, res, next) => {
        try {
            const hotelId = req.params.hotelId;
            let data = await roomReviewService.getRoomReviewsByHotelId(hotelId);
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in getRoomReviewsByHotelId:", error);
            next(error);
        }
    },

    // Lấy tất cả đánh giá theo customerId
    getRoomReviewsByCustomerId: async (req, res, next) => {
        try {
            const customerId = req.params.customerId;
            let data = await roomReviewService.getRoomReviewsByCustomerId(customerId);
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in getRoomReviewsByCustomerId:", error);
            next(error);
        }
    },

    // Tạo đánh giá phòng mới
    createRoomReview: async (req, res, next) => {
        try {
            const reviewData = req.body;
            let data = await roomReviewService.createRoomReview(reviewData);
            
            return res.status(201).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in createRoomReview:", error);
            next(error);
        }
    },

    // Cập nhật đánh giá phòng
    updateRoomReview: async (req, res, next) => {
        try {
            const reviewId = req.params.id;
            const reviewData = req.body;
            let data = await roomReviewService.updateRoomReview(reviewId, reviewData);
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in updateRoomReview:", error);
            next(error);
        }
    },

    // Xóa đánh giá phòng
    deleteRoomReview: async (req, res, next) => {
        try {
            const reviewId = req.params.id;
            let data = await roomReviewService.deleteRoomReview(reviewId);
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in deleteRoomReview:", error);
            next(error);
        }
    }
};

export default roomReviewController; 