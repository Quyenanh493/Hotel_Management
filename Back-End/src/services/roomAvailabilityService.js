import db from '../models/index';
import { Op } from 'sequelize';

const roomAvailabilityService = {
    // Lấy tất cả thông tin phòng trống
    getAllRoomAvailabilities: async () => {
        try {
            const roomAvailabilities = await db.RoomAvailability.findAll({
                include: [
                    {
                        model: db.Room,
                        include: [
                            {
                                model: db.Hotel
                            }
                        ]
                    },
                    {
                        model: db.FactBooking
                    }
                ]
            });
            
            return {
                EM: 'Lấy danh sách phòng trống thành công',
                EC: 0,
                DT: roomAvailabilities
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

    // Lấy thông tin phòng trống theo ID
    getRoomAvailabilityById: async (roomAvailabilityId) => {
        try {
            const roomAvailability = await db.RoomAvailability.findByPk(roomAvailabilityId, {
                include: [
                    {
                        model: db.Room,
                        include: [
                            {
                                model: db.Hotel
                            }
                        ]
                    },
                    {
                        model: db.FactBooking
                    }
                ]
            });
            
            if (!roomAvailability) {
                return {
                    EM: 'Không tìm thấy thông tin phòng trống',
                    EC: 1,
                    DT: []
                };
            }
            
            return {
                EM: 'Lấy thông tin phòng trống thành công',
                EC: 0,
                DT: roomAvailability
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

    // Tạo thông tin phòng trống mới
    createRoomAvailability: async (roomAvailabilityData) => {
        const transaction = await db.sequelize.transaction();
        
        try {
            // Kiểm tra dữ liệu đầu vào
            if (!roomAvailabilityData.roomId || !roomAvailabilityData.dateIn || !roomAvailabilityData.dateOut) {
                await transaction.rollback();
                return {
                    EM: 'Thiếu thông tin bắt buộc: roomId, dateIn, dateOut',
                    EC: 1,
                    DT: []
                };
            }

            // Kiểm tra số lượng phòng còn lại
            const room = await db.Room.findByPk(roomAvailabilityData.roomId);
            if (!room) {
                await transaction.rollback();
                return {
                    EM: 'Không tìm thấy phòng',
                    EC: 1,
                    DT: []
                };
            }

            // Kiểm tra nếu maxRoom <= 0, không thể đặt thêm
            if (room.maxRoom <= 0) {
                await transaction.rollback();
                return {
                    EM: 'Phòng đã hết, không thể đặt thêm',
                    EC: 1,
                    DT: []
                };
            }

            // Tạo thông tin phòng trống
            const newRoomAvailability = await db.RoomAvailability.create({
                roomId: roomAvailabilityData.roomId,
                dateIn: roomAvailabilityData.dateIn,
                dateOut: roomAvailabilityData.dateOut,
                isAvailable: roomAvailabilityData.isAvailable !== undefined ? roomAvailabilityData.isAvailable : true,
                bookingId: roomAvailabilityData.bookingId,
                createdAt: new Date(),
                updatedAt: new Date()
            }, { transaction });

            // Nếu đây là đơn đặt phòng (isAvailable = false), giảm số lượng phòng
            if (roomAvailabilityData.isAvailable === false && roomAvailabilityData.bookingId) {
                await room.update({
                    maxRoom: room.maxRoom - 1
                }, { transaction });
            }

            await transaction.commit();
            
            return {
                EM: 'Tạo thông tin phòng trống thành công',
                EC: 0,
                DT: newRoomAvailability
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

    // Cập nhật thông tin phòng trống
    updateRoomAvailability: async (roomAvailabilityId, roomAvailabilityData) => {
        const transaction = await db.sequelize.transaction();
        
        try {
            const roomAvailability = await db.RoomAvailability.findByPk(roomAvailabilityId);
            
            if (!roomAvailability) {
                await transaction.rollback();
                return {
                    EM: 'Không tìm thấy thông tin phòng trống',
                    EC: 1,
                    DT: []
                };
            }

            // Lưu trạng thái cũ để so sánh
            const oldIsAvailable = roomAvailability.isAvailable;
            
            // Cập nhật thông tin phòng trống
            await roomAvailability.update({
                roomId: roomAvailabilityData.roomId !== undefined ? roomAvailabilityData.roomId : roomAvailability.roomId,
                dateIn: roomAvailabilityData.dateIn !== undefined ? roomAvailabilityData.dateIn : roomAvailability.dateIn,
                dateOut: roomAvailabilityData.dateOut !== undefined ? roomAvailabilityData.dateOut : roomAvailability.dateOut,
                isAvailable: roomAvailabilityData.isAvailable !== undefined ? roomAvailabilityData.isAvailable : roomAvailability.isAvailable,
                bookingId: roomAvailabilityData.bookingId !== undefined ? roomAvailabilityData.bookingId : roomAvailability.bookingId,
                updatedAt: new Date()
            }, { transaction });

            // Nếu trạng thái isAvailable thay đổi, cập nhật maxRoom
            if (oldIsAvailable !== roomAvailabilityData.isAvailable) {
                const room = await db.Room.findByPk(roomAvailability.roomId);
                
                if (room) {
                    // Nếu từ available -> unavailable, giảm maxRoom
                    if (oldIsAvailable === true && roomAvailabilityData.isAvailable === false) {
                        if (room.maxRoom <= 0) {
                            await transaction.rollback();
                            return {
                                EM: 'Phòng đã hết, không thể đặt thêm',
                                EC: 1,
                                DT: []
                            };
                        }
                        await room.update({
                            maxRoom: room.maxRoom - 1
                        }, { transaction });
                    } 
                    // Nếu từ unavailable -> available, tăng maxRoom
                    else if (oldIsAvailable === false && roomAvailabilityData.isAvailable === true) {
                        await room.update({
                            maxRoom: room.maxRoom + 1
                        }, { transaction });
                    }
                }
            }

            await transaction.commit();
            
            return {
                EM: 'Cập nhật thông tin phòng trống thành công',
                EC: 0,
                DT: roomAvailability
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

    // Xóa thông tin phòng trống
    deleteRoomAvailability: async (roomAvailabilityId) => {
        const transaction = await db.sequelize.transaction();
        
        try {
            const roomAvailability = await db.RoomAvailability.findByPk(roomAvailabilityId);
            
            if (!roomAvailability) {
                await transaction.rollback();
                return {
                    EM: 'Không tìm thấy thông tin phòng trống',
                    EC: 1,
                    DT: []
                };
            }

            // Nếu phòng đang không available (đã đặt), khi xóa cần tăng maxRoom
            if (roomAvailability.isAvailable === false) {
                const room = await db.Room.findByPk(roomAvailability.roomId);
                if (room) {
                    await room.update({
                        maxRoom: room.maxRoom + 1
                    }, { transaction });
                }
            }
            
            await roomAvailability.destroy({ transaction });
            
            await transaction.commit();
            
            return {
                EM: 'Xóa thông tin phòng trống thành công',
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
    },

    // Kiểm tra phòng có sẵn trong khoảng thời gian
    checkRoomAvailability: async (roomId, dateIn, dateOut) => {
        try {
            // Kiểm tra số lượng phòng còn lại
            const room = await db.Room.findByPk(roomId);
            if (!room) {
                return {
                    EM: 'Không tìm thấy phòng',
                    EC: 1,
                    DT: { isAvailable: false }
                };
            }

            // Nếu maxRoom <= 0, phòng không còn trống
            if (room.maxRoom <= 0) {
                return {
                    EM: 'Phòng đã hết, không thể đặt thêm',
                    EC: 0,
                    DT: { isAvailable: false, remainingRooms: 0 }
                };
            }

            // Kiểm tra xem phòng có đang được đặt trong khoảng thời gian này không
            const overlappingBookings = await db.RoomAvailability.count({
                where: {
                    roomId: roomId,
                    isAvailable: false,
                    [Op.or]: [
                        {
                            // Trường hợp 1: dateIn nằm trong khoảng đã đặt
                            dateIn: {
                                [Op.lte]: dateOut,
                                [Op.gte]: dateIn
                            }
                        },
                        {
                            // Trường hợp 2: dateOut nằm trong khoảng đã đặt
                            dateOut: {
                                [Op.lte]: dateOut,
                                [Op.gte]: dateIn
                            }
                        },
                        {
                            // Trường hợp 3: khoảng thời gian bao trùm khoảng đã đặt
                            dateIn: {
                                [Op.lte]: dateIn
                            },
                            dateOut: {
                                [Op.gte]: dateOut
                            }
                        }
                    ]
                }
            });

            // Tính số phòng còn lại sau khi trừ đi số đơn đặt phòng trùng thời gian
            const remainingRooms = room.maxRoom - overlappingBookings;
            const isAvailable = remainingRooms > 0;

            return {
                EM: isAvailable ? 'Phòng có sẵn trong khoảng thời gian này' : 'Phòng không có sẵn trong khoảng thời gian này',
                EC: 0,
                DT: { 
                    isAvailable: isAvailable,
                    remainingRooms: remainingRooms
                }
            };
        } catch (error) {
            console.log(error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: { isAvailable: false }
            };
        }
    },

    // Tìm kiếm phòng trống theo tiêu chí
    searchAvailableRooms: async (dateIn, dateOut, roomType, guestCount, city, hotelId) => {
        try {
            // Chuyển đổi chuỗi ngày thành đối tượng Date
            const startDate = new Date(dateIn);
            const endDate = new Date(dateOut);
            
            // Xây dựng điều kiện where cho Room
            let roomWhereCondition = {
                ...(roomType && { roomType: roomType }),
                ...(guestCount && { maxCustomer: { [Op.gte]: guestCount } }),
                maxRoom: { [Op.gt]: 0 } // Chỉ lấy phòng còn chỗ trống
            };

            // Xây dựng điều kiện include cho Hotel
            let hotelIncludeCondition = {
                model: db.Hotel
            };

            // Ưu tiên filter theo city trước, nếu không có city thì filter theo hotelId
            if (city) {
                // Nếu có city, filter theo địa chỉ khách sạn chứa tên thành phố
                hotelIncludeCondition.where = {
                    address: {
                        [Op.like]: `%${city}%`
                    }
                };
                
                // Nếu có cả city và hotelId, thêm điều kiện hotelId
                if (hotelId) {
                    hotelIncludeCondition.where.hotelId = hotelId;
                }
            } else if (hotelId) {
                // Nếu chỉ có hotelId (không có city), filter theo hotelId
                roomWhereCondition.hotelId = hotelId;
            }
            
            // Lấy tất cả phòng theo điều kiện
            let rooms = await db.Room.findAll({
                where: roomWhereCondition,
                include: [
                    hotelIncludeCondition,
                    {
                        model: db.Amenities,
                        as: 'Amenities',
                        through: { attributes: [] }
                    }
                ]
            });

            // Kiểm tra từng phòng xem có sẵn trong khoảng thời gian không
            const availableRooms = [];
            for (const room of rooms) {
                // Đếm số lượng đặt phòng trùng thời gian
                const overlappingBookings = await db.RoomAvailability.count({
                    where: {
                        roomId: room.roomId,
                        isAvailable: false,
                        [Op.or]: [
                            {
                                dateIn: {
                                    [Op.lte]: endDate,
                                    [Op.gte]: startDate
                                }
                            },
                            {
                                dateOut: {
                                    [Op.lte]: endDate,
                                    [Op.gte]: startDate
                                }
                            },
                            {
                                dateIn: {
                                    [Op.lte]: startDate
                                },
                                dateOut: {
                                    [Op.gte]: endDate
                                }
                            }
                        ]
                    }
                });

                // Tính số phòng còn lại
                const remainingRooms = room.maxRoom - overlappingBookings;
                
                // Nếu còn phòng trống, thêm vào danh sách kết quả
                if (remainingRooms > 0) {
                    const roomData = room.toJSON();
                    roomData.remainingRooms = remainingRooms;
                    availableRooms.push(roomData);
                }
            }

            return {
                EM: `Tìm kiếm phòng trống thành công${city ? ` tại ${city}` : ''}${hotelId ? ' trong khách sạn đã chọn' : ''}`,
                EC: 0,
                DT: availableRooms
            };
        } catch (error) {
            console.log('Error in searchAvailableRooms:', error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    }
};

export default roomAvailabilityService;