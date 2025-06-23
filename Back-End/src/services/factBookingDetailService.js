import db from '../models/index';

const factBookingDetailService = {
    // Lấy tất cả chi tiết đặt phòng
    getAllBookingDetails: async () => {
        try {
            const bookingDetails = await db.FactBookingDetail.findAll({
                include: [
                    { model: db.FactBooking },
                    { model: db.Room },
                    { 
                        model: db.FactBookingDetailAmenities,
                        include: [{ model: db.Amenities }]
                    }
                ]
            });
            
            return {
                EM: 'Lấy danh sách chi tiết đặt phòng thành công',
                EC: 0,
                DT: bookingDetails
            };
        } catch (error) {
            console.error("Error in getAllBookingDetails service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Lấy chi tiết đặt phòng theo ID
    getBookingDetailById: async (bookingDetailId) => {
        try {
            const bookingDetail = await db.FactBookingDetail.findByPk(bookingDetailId, {
                include: [
                    { model: db.FactBooking },
                    { model: db.Room },
                    { 
                        model: db.FactBookingDetailAmenities,
                        include: [{ model: db.Amenities }]
                    }
                ]
            });
            
            if (!bookingDetail) {
                return {
                    EM: 'Không tìm thấy chi tiết đặt phòng',
                    EC: 1,
                    DT: []
                };
            }
            
            return {
                EM: 'Lấy thông tin chi tiết đặt phòng thành công',
                EC: 0,
                DT: bookingDetail
            };
        } catch (error) {
            console.error("Error in getBookingDetailById service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },
    
    // Lấy tất cả chi tiết đặt phòng theo bookingId
    getBookingDetailsByBookingId: async (bookingId) => {
        try {
            const bookingDetails = await db.FactBookingDetail.findAll({
                where: { bookingId: bookingId },
                include: [
                    { model: db.Room },
                    { 
                        model: db.FactBookingDetailAmenities,
                        include: [{ model: db.Amenities }]
                    }
                ]
            });
            
            return {
                EM: 'Lấy danh sách chi tiết đặt phòng theo booking ID thành công',
                EC: 0,
                DT: bookingDetails
            };
        } catch (error) {
            console.error("Error in getBookingDetailsByBookingId service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Tạo chi tiết đặt phòng mới
    createBookingDetail: async (bookingDetailData) => {
        const transaction = await db.sequelize.transaction();
        
        try {
            // Kiểm tra bookingId có tồn tại không
            const booking = await db.FactBooking.findByPk(bookingDetailData.bookingId);
            if (!booking) {
                await transaction.rollback();
                return {
                    EM: 'Không tìm thấy đơn đặt phòng',
                    EC: 1,
                    DT: []
                };
            }
            
            // Kiểm tra roomId có tồn tại không
            const room = await db.Room.findByPk(bookingDetailData.roomId);
            if (!room) {
                await transaction.rollback();
                return {
                    EM: 'Không tìm thấy phòng',
                    EC: 1,
                    DT: []
                };
            }
            
            // Tạo chi tiết đặt phòng mới
            const newBookingDetail = await db.FactBookingDetail.create({
                bookingId: bookingDetailData.bookingId,
                roomId: bookingDetailData.roomId,
                specialRequests: bookingDetailData.specialRequests || '',
                bookingStatus: bookingDetailData.bookingStatus || 'confirmed',
                adultCount: bookingDetailData.adultCount || 1,
                childrenCount: bookingDetailData.childrenCount || 0,
                roomCount: bookingDetailData.roomCount || 1,
                totalAmount: bookingDetailData.totalAmount || 0,
                specialRate: bookingDetailData.specialRate || null,
                createdAt: new Date(),
                updatedAt: new Date()
            }, { transaction });
            
            // Nếu có amenities, tạo các bản ghi trong bảng FactBookingDetailAmenities
            if (bookingDetailData.amenities && bookingDetailData.amenities.length > 0) {
                const amenitiesPromises = bookingDetailData.amenities.map(amenityId => {
                    return db.FactBookingDetailAmenities.create({
                        bookingDetailId: newBookingDetail.bookingDetailId,
                        amenitiesId: amenityId,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }, { transaction });
                });
                
                await Promise.all(amenitiesPromises);
            }
            
            await transaction.commit();
            
            // Lấy chi tiết đặt phòng đã tạo với dữ liệu liên quan
            const bookingDetail = await db.FactBookingDetail.findByPk(newBookingDetail.bookingDetailId, {
                include: [
                    { model: db.FactBooking },
                    { model: db.Room },
                    { 
                        model: db.FactBookingDetailAmenities,
                        include: [{ model: db.Amenities }]
                    }
                ]
            });
            
            return {
                EM: 'Tạo chi tiết đặt phòng thành công',
                EC: 0,
                DT: bookingDetail
            };
        } catch (error) {
            await transaction.rollback();
            console.error("Error in createBookingDetail service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Cập nhật thông tin chi tiết đặt phòng
    updateBookingDetail: async (bookingDetailId, bookingDetailData) => {
        const transaction = await db.sequelize.transaction();
        
        try {
            const bookingDetail = await db.FactBookingDetail.findByPk(bookingDetailId);
            
            if (!bookingDetail) {
                await transaction.rollback();
                return {
                    EM: 'Không tìm thấy chi tiết đặt phòng',
                    EC: 1,
                    DT: []
                };
            }
            
            // Nếu có thay đổi roomId, kiểm tra phòng có tồn tại không
            if (bookingDetailData.roomId && bookingDetailData.roomId !== bookingDetail.roomId) {
                const room = await db.Room.findByPk(bookingDetailData.roomId);
                if (!room) {
                    await transaction.rollback();
                    return {
                        EM: 'Không tìm thấy phòng',
                        EC: 1,
                        DT: []
                    };
                }
            }
            
            // Cập nhật thông tin chi tiết đặt phòng
            await bookingDetail.update({
                roomId: bookingDetailData.roomId !== undefined ? bookingDetailData.roomId : bookingDetail.roomId,
                specialRequests: bookingDetailData.specialRequests !== undefined ? bookingDetailData.specialRequests : bookingDetail.specialRequests,
                bookingStatus: bookingDetailData.bookingStatus !== undefined ? bookingDetailData.bookingStatus : bookingDetail.bookingStatus,
                adultCount: bookingDetailData.adultCount !== undefined ? bookingDetailData.adultCount : bookingDetail.adultCount,
                childrenCount: bookingDetailData.childrenCount !== undefined ? bookingDetailData.childrenCount : bookingDetail.childrenCount,
                roomCount: bookingDetailData.roomCount !== undefined ? bookingDetailData.roomCount : bookingDetail.roomCount,
                totalAmount: bookingDetailData.totalAmount !== undefined ? bookingDetailData.totalAmount : bookingDetail.totalAmount,
                specialRate: bookingDetailData.specialRate !== undefined ? bookingDetailData.specialRate : bookingDetail.specialRate,
                updatedAt: new Date()
            }, { transaction });
            
            // Nếu có cập nhật amenities, xóa các bản ghi cũ và tạo mới
            if (bookingDetailData.amenities) {
                // Xóa các amenities cũ
                await db.FactBookingDetailAmenities.destroy({
                    where: { bookingDetailId: bookingDetailId },
                    transaction
                });
                
                // Tạo các amenities mới
                if (bookingDetailData.amenities.length > 0) {
                    const amenitiesPromises = bookingDetailData.amenities.map(amenityId => {
                        return db.FactBookingDetailAmenities.create({
                            bookingDetailId: bookingDetailId,
                            amenitiesId: amenityId,
                            createdAt: new Date(),
                            updatedAt: new Date()
                        }, { transaction });
                    });
                    
                    await Promise.all(amenitiesPromises);
                }
            }
            
            await transaction.commit();
            
            // Lấy chi tiết đặt phòng đã cập nhật với dữ liệu liên quan
            const updatedBookingDetail = await db.FactBookingDetail.findByPk(bookingDetailId, {
                include: [
                    { model: db.FactBooking },
                    { model: db.Room },
                    { 
                        model: db.FactBookingDetailAmenities,
                        include: [{ model: db.Amenities }]
                    }
                ]
            });
            
            return {
                EM: 'Cập nhật chi tiết đặt phòng thành công',
                EC: 0,
                DT: updatedBookingDetail
            };
        } catch (error) {
            await transaction.rollback();
            console.error("Error in updateBookingDetail service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Xóa chi tiết đặt phòng
    deleteBookingDetail: async (bookingDetailId) => {
        const transaction = await db.sequelize.transaction();
        
        try {
            const bookingDetail = await db.FactBookingDetail.findByPk(bookingDetailId);
            
            if (!bookingDetail) {
                await transaction.rollback();
                return {
                    EM: 'Không tìm thấy chi tiết đặt phòng',
                    EC: 1,
                    DT: []
                };
            }
            
            // Xóa các bản ghi liên quan trong bảng FactBookingDetailAmenities
            await db.FactBookingDetailAmenities.destroy({
                where: { bookingDetailId: bookingDetailId },
                transaction
            });
            
            // Xóa chi tiết đặt phòng
            await bookingDetail.destroy({ transaction });
            
            await transaction.commit();
            
            return {
                EM: 'Xóa chi tiết đặt phòng thành công',
                EC: 0,
                DT: { bookingDetailId }
            };
        } catch (error) {
            await transaction.rollback();
            console.error("Error in deleteBookingDetail service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    }
};

export default factBookingDetailService; 