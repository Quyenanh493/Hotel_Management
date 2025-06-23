import db from '../models/index';

const amenitiesService = {
    // Lấy tất cả tiện nghi
    getAllAmenities: async () => {
        try {
            const amenities = await db.Amenities.findAll({
                include: [
                    {
                        model: db.RoomAmenities,
                        as: 'AmenitiesInRoom', 
                        include: [db.Room]
                    }
                ]
            });
            return {
                EM: 'Lấy danh sách tiện nghi thành công',
                EC: 0,
                DT: amenities
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

    // Lấy tiện nghi theo ID
    getAmenityById: async (amenityId) => {
        try {
            const amenity = await db.Amenities.findByPk(amenityId, {
                include: [
                    {
                        model: db.RoomAmenities,
                        as: 'AmenitiesInRoom',  // Thêm alias vào đây
                        include: [db.Room]
                    }
                ]
            });
            
            if (!amenity) {
                return {
                    EM: 'Không tìm thấy tiện nghi',
                    EC: 1,
                    DT: []
                };
            }
            
            return {
                EM: 'Lấy thông tin tiện nghi thành công',
                EC: 0,
                DT: amenity
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

    // Lấy tiện nghi theo ID phòng
    getAmenityByRoomId: async (roomId) => {
        try {
            // Kiểm tra phòng có tồn tại không
            const room = await db.Room.findByPk(roomId);
            
            if (!room) {
                return {
                    EM: 'Không tìm thấy phòng',
                    EC: 1,
                    DT: []
                };
            }
            
            // Lấy danh sách tiện nghi của phòng thông qua mối quan hệ nhiều-nhiều
            const amenities = await db.Amenities.findAll({
                include: [
                    {
                        model: db.Room,
                        as: 'Rooms',
                        where: { roomId: roomId },
                        through: { attributes: [] },
                        required: true
                    }
                ]
            });
            
            return {
                EM: 'Lấy danh sách tiện nghi của phòng thành công',
                EC: 0,
                DT: amenities
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

    // Tạo tiện nghi mới
    createAmenity: async (amenityData) => {
        try {
            const newAmenity = await db.Amenities.create({
                amenitiesName: amenityData.amenitiesName,
                description: amenityData.description,
                price: amenityData.price,
                icon: amenityData.icon || 'wifi', 
                amenitiesStatus: amenityData.amenitiesStatus !== undefined ? amenityData.amenitiesStatus : true,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            
            return {
                EM: 'Tạo tiện nghi thành công',
                EC: 0,
                DT: newAmenity
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

    // Cập nhật tiện nghi
    updateAmenity: async (amenityId, amenityData) => {
        try {
            const amenity = await db.Amenities.findByPk(amenityId);
            
            if (!amenity) {
                return {
                    EM: 'Không tìm thấy tiện nghi',
                    EC: 1,
                    DT: []
                };
            }
            
            await amenity.update({
                amenitiesName: amenityData.amenitiesName !== undefined ? amenityData.amenitiesName : amenity.amenitiesName,
                description: amenityData.description !== undefined ? amenityData.description : amenity.description,
                price: amenityData.price !== undefined ? amenityData.price : amenity.price,
                icon: amenityData.icon !== undefined ? amenityData.icon : amenity.icon,
                amenitiesStatus: amenityData.amenitiesStatus !== undefined ? amenityData.amenitiesStatus : amenity.amenitiesStatus,
                updatedAt: new Date()
            });
            
            return {
                EM: 'Cập nhật tiện nghi thành công',
                EC: 0,
                DT: amenity
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

    // Xóa tiện nghi
    deleteAmenity: async (amenityId) => {
        const transaction = await db.sequelize.transaction();
        
        try {
            const amenity = await db.Amenities.findByPk(amenityId);
            
            if (!amenity) {
                await transaction.rollback();
                return {
                    EM: 'Không tìm thấy tiện nghi',
                    EC: 1,
                    DT: []
                };
            }
            
            // Xóa liên kết phòng-tiện nghi trước
            await db.RoomAmenities.destroy({
                where: { amenitiesId: amenityId },
                transaction
            });
            
            // Xóa tiện nghi
            await amenity.destroy({ transaction });
            
            await transaction.commit();
            return {
                EM: 'Xóa tiện nghi thành công',
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

export default amenitiesService;