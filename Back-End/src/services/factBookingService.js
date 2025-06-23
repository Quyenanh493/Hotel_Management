import db from '../models/index';

const factBookingService = {
    // Lấy tất cả đơn đặt phòng
    getAllBookings: async () => {
        try {
            const bookings = await db.FactBooking.findAll({
                include: [
                    {
                        model: db.Customer,
                        required: false
                    },
                    {
                        model: db.Hotel,
                        required: false
                    },
                    {
                        model: db.FactBookingDetail,
                        required: false
                    },
                    {
                        model: db.Payment,
                        required: false
                    }
                ]
            });
            return {
                EM: 'Lấy danh sách đơn đặt phòng thành công',
                EC: 0,
                DT: bookings
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

    // Lấy đơn đặt phòng theo ID
    getBookingById: async (bookingId) => {
        try {
            if (!Number.isInteger(parseInt(bookingId))) {
                return {
                    EM: 'ID đơn đặt phòng không hợp lệ',
                    EC: 1,
                    DT: []
                };
            }

            const booking = await db.FactBooking.findByPk(bookingId, {
                include: [
                    {
                        model: db.Customer,
                        required: false
                    },
                    {
                        model: db.Hotel,
                        required: false
                    },
                    {
                        model: db.FactBookingDetail,
                        required: false,
                        include: [
                            {
                                model: db.Room,
                                required: false
                            }
                        ]
                    },
                    {
                        model: db.Payment,
                        required: false
                    }
                ]
            });
            
            if (!booking) {
                return {
                    EM: 'Không tìm thấy đơn đặt phòng',
                    EC: 1,
                    DT: []
                };
            }
            
            return {
                EM: 'Lấy thông tin đơn đặt phòng thành công',
                EC: 0,
                DT: booking
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

    // Lấy đơn đặt phòng theo Customer ID
    getBookingsByCustomerId: async (customerId) => {
        try {
            if (!Number.isInteger(parseInt(customerId))) {
                return {
                    EM: 'ID khách hàng không hợp lệ',
                    EC: 1,
                    DT: []
                };
            }

            const bookings = await db.FactBooking.findAll({
                where: { customerId: customerId },
                include: [
                    {
                        model: db.Customer,
                        required: false
                    },
                    {
                        model: db.Hotel,
                        required: false
                    },
                    {
                        model: db.FactBookingDetail,
                        required: false
                    },
                    {
                        model: db.Payment,
                        required: false
                    }
                ]
            });
            
            return {
                EM: 'Lấy danh sách đơn đặt phòng theo khách hàng thành công',
                EC: 0,
                DT: bookings
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

    // Tạo đơn đặt phòng mới
    createBooking: async (bookingData) => {
        const transaction = await db.sequelize.transaction();
        
        try {
            if (!bookingData.customerId || !bookingData.hotelId || !bookingData.dateIn || !bookingData.dateOut) {
                await transaction.rollback();
                return {
                    EM: 'Thiếu thông tin bắt buộc: customerId, hotelId, dateIn, dateOut',
                    EC: 1,
                    DT: []
                };
            }

            const newBooking = await db.FactBooking.create({
                customerId: bookingData.customerId,
                hotelId: bookingData.hotelId,
                dateIn: bookingData.dateIn,
                dateOut: bookingData.dateOut,
                orderDate: bookingData.orderDate || new Date(),
                createdAt: new Date(),
                updatedAt: new Date()
            }, { transaction });
            
            await transaction.commit();
            
            const createdBooking = await db.FactBooking.findByPk(newBooking.bookingId, {
                include: [
                    {
                        model: db.Customer,
                        required: false
                    },
                    {
                        model: db.Hotel,
                        required: false
                    }
                ]
            });
            
            return {
                EM: 'Tạo đơn đặt phòng thành công',
                EC: 0,
                DT: createdBooking
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

    // Cập nhật đơn đặt phòng
    updateBooking: async (bookingId, bookingData) => {
        const transaction = await db.sequelize.transaction();
        
        try {
            const booking = await db.FactBooking.findByPk(bookingId);
            
            if (!booking) {
                await transaction.rollback();
                return {
                    EM: 'Không tìm thấy đơn đặt phòng',
                    EC: 1,
                    DT: []
                };
            }
            
            await booking.update({
                customerId: bookingData.customerId !== undefined ? bookingData.customerId : booking.customerId,
                hotelId: bookingData.hotelId !== undefined ? bookingData.hotelId : booking.hotelId,
                dateIn: bookingData.dateIn !== undefined ? bookingData.dateIn : booking.dateIn,
                dateOut: bookingData.dateOut !== undefined ? bookingData.dateOut : booking.dateOut,
                orderDate: bookingData.orderDate !== undefined ? bookingData.orderDate : booking.orderDate,
                updatedAt: new Date()
            }, { transaction });
            
            await transaction.commit();
            
            const updatedBooking = await db.FactBooking.findByPk(bookingId, {
                include: [
                    {
                        model: db.Customer,
                        required: false
                    },
                    {
                        model: db.Hotel,
                        required: false
                    },
                    {
                        model: db.FactBookingDetail,
                        required: false
                    },
                    {
                        model: db.Payment,
                        required: false
                    }
                ]
            });
            
            return {
                EM: 'Cập nhật đơn đặt phòng thành công',
                EC: 0,
                DT: updatedBooking
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

    // Xóa đơn đặt phòng
    deleteBooking: async (bookingId) => {
        const transaction = await db.sequelize.transaction();
        
        try {
            const booking = await db.FactBooking.findByPk(bookingId);
            
            if (!booking) {
                await transaction.rollback();
                return {
                    EM: 'Không tìm thấy đơn đặt phòng',
                    EC: 1,
                    DT: []
                };
            }
            
            // Xóa Payment liên kết (nếu có)
            await db.Payment.destroy({
                where: { bookingId: bookingId },
                transaction
            });
            
            // Xóa FactBookingDetailAmenities liên quan thông qua BookingDetail
            const bookingDetails = await db.FactBookingDetail.findAll({
                where: { bookingId: bookingId }
            });
            
            for (const detail of bookingDetails) {
                await db.FactBookingDetailAmenities.destroy({
                    where: { bookingDetailId: detail.bookingDetailId },
                    transaction
                });
            }
            
            // Xóa FactBookingDetail liên kết
            await db.FactBookingDetail.destroy({
                where: { bookingId: bookingId },
                transaction
            });
            
            // Xóa RoomAvailability liên kết
            await db.RoomAvailability.destroy({
                where: { bookingId: bookingId },
                transaction
            });
            
            // Xóa FactBooking
            await booking.destroy({ transaction });
            
            await transaction.commit();
            
            return {
                EM: 'Xóa đơn đặt phòng thành công',
                EC: 0,
                DT: {}
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

export default factBookingService; 