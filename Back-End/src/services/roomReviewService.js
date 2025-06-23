import db from '../models/index';
const { Op } = require('sequelize');

const roomReviewService = {
    // Lấy tất cả đánh giá phòng
    getAllRoomReviews: async () => {
        try {
            const reviews = await db.RoomReview.findAll({
                include: [
                    {
                        model: db.Room,
                        required: false
                    },
                    {
                        model: db.Customer,
                        required: false
                    }
                ]
            });
            return {
                EM: 'Lấy danh sách đánh giá phòng thành công',
                EC: 0,
                DT: reviews
            };
        } catch (error) {
            console.log(error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Lấy đánh giá phòng theo ID
    getRoomReviewById: async (reviewId) => {
        try {
            if (!Number.isInteger(parseInt(reviewId))) {
                return {
                    EM: 'ID đánh giá không hợp lệ',
                    EC: 1,
                    DT: []
                };
            }

            const review = await db.RoomReview.findByPk(reviewId, {
                include: [
                    {
                        model: db.Room,
                        required: false
                    },
                    {
                        model: db.Customer,
                        required: false
                    }
                ]
            });
            
            if (!review) {
                return {
                    EM: 'Không tìm thấy đánh giá phòng',
                    EC: 1,
                    DT: []
                };
            }
            
            return {
                EM: 'Lấy thông tin đánh giá phòng thành công',
                EC: 0,
                DT: review
            };
        } catch (error) {
            console.log(error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Lấy tất cả đánh giá theo roomId
    getRoomReviewsByRoomId: async (roomId) => {
        try {
            if (!Number.isInteger(parseInt(roomId))) {
                return {
                    EM: 'ID phòng không hợp lệ',
                    EC: 1,
                    DT: []
                };
            }

            const reviews = await db.RoomReview.findAll({
                where: { roomId: roomId },
                include: [
                    {
                        model: db.Room,
                        required: false
                    },
                    {
                        model: db.Customer,
                        required: false
                    }
                ]
            });
            
            return {
                EM: 'Lấy danh sách đánh giá phòng thành công',
                EC: 0,
                DT: reviews
            };
        } catch (error) {
            console.log(error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Lấy tất cả đánh giá theo hotelId
    getRoomReviewsByHotelId: async (hotelId) => {
        try {
            if (!Number.isInteger(parseInt(hotelId))) {
                return {
                    EM: 'ID khách sạn không hợp lệ',
                    EC: 1,
                    DT: []
                };
            }

            const reviews = await db.RoomReview.findAll({
                include: [
                    {
                        model: db.Room,
                        required: true,
                        where: { hotelId: hotelId },
                        include: [
                            {
                                model: db.Hotel,
                                required: false
                            }
                        ]
                    },
                    {
                        model: db.Customer,
                        required: false
                    }
                ],
                order: [['createdAt', 'DESC']]
            });
            
            return {
                EM: 'Lấy danh sách đánh giá phòng theo khách sạn thành công',
                EC: 0,
                DT: reviews
            };
        } catch (error) {
            console.log(error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Lấy tất cả đánh giá theo customerId
    getRoomReviewsByCustomerId: async (customerId) => {
        try {
            if (!Number.isInteger(parseInt(customerId))) {
                return {
                    EM: 'ID khách hàng không hợp lệ',
                    EC: 1,
                    DT: []
                };
            }

            const reviews = await db.RoomReview.findAll({
                where: { customerId: customerId },
                include: [
                    {
                        model: db.Room,
                        required: false
                    },
                    {
                        model: db.Customer,
                        required: false
                    }
                ]
            });
            
            return {
                EM: 'Lấy danh sách đánh giá phòng thành công',
                EC: 0,
                DT: reviews
            };
        } catch (error) {
            console.log(error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Tạo đánh giá phòng mới và cập nhật đánh giá trung bình của phòng
    createRoomReview: async (reviewData) => {
        const transaction = await db.sequelize.transaction();
        
        try {
            if (!reviewData.roomId || !reviewData.customerId || !reviewData.rating) {
                await transaction.rollback();
                return {
                    EM: 'Thiếu thông tin bắt buộc: roomId, customerId, rating',
                    EC: 1,
                    DT: []
                };
            }

            // Kiểm tra phòng có tồn tại không
            const room = await db.Room.findByPk(reviewData.roomId);
            if (!room) {
                await transaction.rollback();
                return {
                    EM: 'Không tìm thấy phòng',
                    EC: 1,
                    DT: []
                };
            }

            // Kiểm tra khách hàng có tồn tại không
            const customer = await db.Customer.findByPk(reviewData.customerId);
            if (!customer) {
                await transaction.rollback();
                return {
                    EM: 'Không tìm thấy khách hàng',
                    EC: 1,
                    DT: []
                };
            }

            // Tạo đánh giá mới
            const newReview = await db.RoomReview.create({
                roomId: reviewData.roomId,
                customerId: reviewData.customerId,
                rating: reviewData.rating,
                comment: reviewData.comment || '',
                createdAt: new Date(),
                updatedAt: new Date()
            }, { transaction });

            // Cập nhật đánh giá trung bình và tổng số đánh giá của phòng
            const allReviews = await db.RoomReview.findAll({
                where: { roomId: reviewData.roomId },
                attributes: ['rating']
            });

            const totalReview = allReviews.length;
            const sumRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = totalReview > 0 ? (sumRating / totalReview).toFixed(1) : 0;

            await room.update({
                averageRating: averageRating,
                totalReview: totalReview
            }, { transaction });

            await transaction.commit();
            
            const createdReview = await db.RoomReview.findByPk(newReview.reviewId, {
                include: [
                    {
                        model: db.Room,
                        required: false
                    },
                    {
                        model: db.Customer,
                        required: false
                    }
                ]
            });
            
            return {
                EM: 'Tạo đánh giá phòng thành công',
                EC: 0,
                DT: createdReview
            };
        } catch (error) {
            await transaction.rollback();
            console.log(error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Cập nhật đánh giá phòng
    updateRoomReview: async (reviewId, reviewData) => {
        const transaction = await db.sequelize.transaction();
        
        try {
            const review = await db.RoomReview.findByPk(reviewId);
            
            if (!review) {
                await transaction.rollback();
                return {
                    EM: 'Không tìm thấy đánh giá phòng',
                    EC: 1,
                    DT: []
                };
            }
            
            await review.update({
                rating: reviewData.rating !== undefined ? reviewData.rating : review.rating,
                comment: reviewData.comment !== undefined ? reviewData.comment : review.comment,
                updatedAt: new Date()
            }, { transaction });
            
            // Cập nhật đánh giá trung bình và tổng số đánh giá của phòng
            const room = await db.Room.findByPk(review.roomId);
            const allReviews = await db.RoomReview.findAll({
                where: { roomId: review.roomId },
                attributes: ['rating']
            });

            const totalReview = allReviews.length;
            const sumRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = totalReview > 0 ? (sumRating / totalReview).toFixed(1) : 0;

            await room.update({
                averageRating: averageRating,
                totalReview: totalReview
            }, { transaction });
            
            await transaction.commit();
            
            const updatedReview = await db.RoomReview.findByPk(reviewId, {
                include: [
                    {
                        model: db.Room,
                        required: false
                    },
                    {
                        model: db.Customer,
                        required: false
                    }
                ]
            });
            
            return {
                EM: 'Cập nhật đánh giá phòng thành công',
                EC: 0,
                DT: updatedReview
            };
        } catch (error) {
            await transaction.rollback();
            console.log(error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Xóa đánh giá phòng
    deleteRoomReview: async (reviewId) => {
        const transaction = await db.sequelize.transaction();
        
        try {
            const review = await db.RoomReview.findByPk(reviewId);
            
            if (!review) {
                await transaction.rollback();
                return {
                    EM: 'Không tìm thấy đánh giá phòng',
                    EC: 1,
                    DT: []
                };
            }
            
            const roomId = review.roomId;
            
            await review.destroy({ transaction });
            
            // Cập nhật đánh giá trung bình và tổng số đánh giá của phòng
            const room = await db.Room.findByPk(roomId);
            const allReviews = await db.RoomReview.findAll({
                where: { roomId: roomId },
                attributes: ['rating']
            });

            const totalReview = allReviews.length;
            const sumRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = totalReview > 0 ? (sumRating / totalReview).toFixed(1) : 0;

            await room.update({
                averageRating: averageRating,
                totalReview: totalReview
            }, { transaction });
            
            await transaction.commit();
            
            return {
                EM: 'Xóa đánh giá phòng thành công',
                EC: 0,
                DT: []
            };
        } catch (error) {
            await transaction.rollback();
            console.log(error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    }
};

export default roomReviewService; 