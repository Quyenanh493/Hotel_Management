import db from '../models/index';
const { Op } = require('sequelize');

const roomService = {
    // Các hàm hiện có giữ nguyên
    getAllRooms: async () => {
        try {
            const rooms = await db.Room.findAll({
                include: [
                    {
                        model: db.Amenities,
                        as: 'Amenities',
                        through: { attributes: [] },
                        required: false
                    },
                    {
                        model: db.Hotel,
                        required: false
                    }
                ]
            });

            // Tính số phòng trống hiện tại cho mỗi phòng và cập nhật trạng thái
            const roomsWithAvailability = await Promise.all(rooms.map(async (room) => {
                const roomData = room.toJSON();
                
                // Tính tổng số phòng đang được đặt hiện tại
                const today = new Date();
                const bookedRoomsCount = await db.sequelize.query(`
                    SELECT COALESCE(SUM(fbd.roomCount), 0) as totalBookedRooms
                    FROM FactBookingDetail fbd
                    INNER JOIN FactBooking fb ON fbd.bookingId = fb.bookingId
                    WHERE fbd.roomId = :roomId 
                    AND fbd.bookingStatus NOT IN ('Cancelled', 'Refunded')
                    AND fb.dateIn <= :today 
                    AND fb.dateOut > :today
                `, {
                    replacements: { 
                        roomId: room.roomId,
                        today: today
                    },
                    type: db.sequelize.QueryTypes.SELECT
                });

                const bookedRooms = bookedRoomsCount[0]?.totalBookedRooms || 0;
                roomData.currentlyAvailable = Math.max(0, room.maxRoom - bookedRooms);
                
                // Tự động cập nhật trạng thái nếu không phải bảo trì
                if (room.roomStatus !== 'Maintenance') {
                    let newStatus = 'Available';
                    if (bookedRooms >= room.maxRoom) {
                        newStatus = 'Occupied';
                    }
                    
                    // Cập nhật trạng thái nếu khác với hiện tại
                    if (room.roomStatus !== newStatus) {
                        await room.update({
                            roomStatus: newStatus,
                            updatedAt: new Date()
                        });
                        roomData.roomStatus = newStatus;
                    }
                }
                
                return roomData;
            }));

            return {
                EM: 'Lấy danh sách phòng thành công',
                EC: 0,
                DT: roomsWithAvailability
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

    getRoomById: async (roomId) => {
        try {
            if (!Number.isInteger(parseInt(roomId))) {
                return {
                    EM: 'ID phòng không hợp lệ',
                    EC: 1,
                    DT: []
                };
            }

            const room = await db.Room.findByPk(roomId, {
                include: [
                    {
                        model: db.Amenities,
                        as: 'Amenities',
                        through: { attributes: [] },
                        required: false
                    },
                    {
                        model: db.Hotel,
                        required: false
                    }
                ]
            });
            
            if (!room) {
                return {
                    EM: 'Không tìm thấy phòng',
                    EC: 1,
                    DT: []
                };
            }
            
            return {
                EM: 'Lấy thông tin phòng thành công',
                EC: 0,
                DT: room
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

    createRoom: async (roomData) => {
        const transaction = await db.sequelize.transaction();
        
        try {
            if (!roomData.hotelId || !roomData.roomName || !roomData.roomType || !roomData.maxCustomer || !roomData.price) {
                await transaction.rollback();
                return {
                    EM: 'Thiếu thông tin bắt buộc: hotelId, roomName, roomType, maxCustomer, price',
                    EC: 1,
                    DT: []
                };
            }

            const newRoom = await db.Room.create({
                hotelId: roomData.hotelId,
                roomName: roomData.roomName,
                roomType: roomData.roomType,
                roomStatus: roomData.roomStatus || 'Available',
                maxCustomer: roomData.maxCustomer,
                maxRoom: roomData.maxRoom || 1,
                price: roomData.price,
                roomImage: roomData.roomImage,
                averageRating: roomData.averageRating || 0.0,
                totalReview: roomData.totalReview || 0,
                description: roomData.description || '',
                createdAt: new Date(),
                updatedAt: new Date()
            }, { transaction });

            if (roomData.amenities && roomData.amenities.length > 0) {
                const amenitiesExist = await db.Amenities.findAll({
                    where: { amenitiesId: roomData.amenities }
                });
                if (amenitiesExist.length !== roomData.amenities.length) {
                    await transaction.rollback();
                    return {
                        EM: 'Một số tiện nghi không tồn tại',
                        EC: 1,
                        DT: []
                    };
                }

                const roomAmenitiesData = roomData.amenities.map(amenityId => ({
                    roomId: newRoom.roomId,
                    amenitiesId: amenityId,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }));
                
                await db.RoomAmenities.bulkCreate(roomAmenitiesData, { transaction });
            }

            await transaction.commit();
            
            const createdRoom = await db.Room.findByPk(newRoom.roomId, {
                include: [
                    {
                        model: db.Amenities,
                        as: 'Amenities',
                        through: { attributes: [] },
                        required: false
                    },
                    {
                        model: db.Hotel,
                        required: false
                    }
                ]
            });
            
            return {
                EM: 'Tạo phòng thành công',
                EC: 0,
                DT: createdRoom
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

    updateRoom: async (roomId, roomData) => {
        const transaction = await db.sequelize.transaction();
        
        try {
            const room = await db.Room.findByPk(roomId);
            
            if (!room) {
                await transaction.rollback();
                return {
                    EM: 'Không tìm thấy phòng',
                    EC: 1,
                    DT: []
                };
            }
            
            // Tính toán số phòng hiện tại đã được đặt
            const today = new Date();
            const bookedRoomsCount = await db.sequelize.query(`
                SELECT COALESCE(SUM(fbd.roomCount), 0) as totalBookedRooms
                FROM FactBookingDetail fbd
                INNER JOIN FactBooking fb ON fbd.bookingId = fb.bookingId
                WHERE fbd.roomId = :roomId 
                AND fbd.bookingStatus NOT IN ('Cancelled', 'Refunded')
                AND fb.dateIn <= :today 
                AND fb.dateOut > :today
            `, {
                replacements: { 
                    roomId: roomId,
                    today: today
                },
                type: db.sequelize.QueryTypes.SELECT
            });

            const bookedRooms = bookedRoomsCount[0]?.totalBookedRooms || 0;

            // Xác định trạng thái phòng dựa trên số lượng đã đặt
            let finalRoomStatus = roomData.roomStatus !== undefined ? roomData.roomStatus : room.roomStatus;
            const finalMaxRoom = roomData.maxRoom !== undefined ? roomData.maxRoom : room.maxRoom;
            
            // Nếu không phải trạng thái bảo trì được chọn thủ công, tự động cập nhật trạng thái
            if (roomData.roomStatus === undefined || roomData.roomStatus !== 'Maintenance') {
                if (bookedRooms >= finalMaxRoom) {
                    finalRoomStatus = 'Occupied';
                } else if (bookedRooms < finalMaxRoom) {
                    finalRoomStatus = 'Available';
                }
            }
            
            await room.update({
                hotelId: roomData.hotelId !== undefined ? roomData.hotelId : room.hotelId,
                roomName: roomData.roomName !== undefined ? roomData.roomName : room.roomName,
                roomType: roomData.roomType !== undefined ? roomData.roomType : room.roomType,
                roomStatus: finalRoomStatus,
                equipmentAndMinibar: roomData.equipmentAndMinibar !== undefined ? roomData.equipmentAndMinibar : room.equipmentAndMinibar,
                maxCustomer: roomData.maxCustomer !== undefined ? roomData.maxCustomer : room.maxCustomer,
                maxRoom: finalMaxRoom,
                price: roomData.price !== undefined ? roomData.price : room.price,
                roomImage: roomData.roomImage !== undefined ? roomData.roomImage : room.roomImage,
                averageRating: roomData.averageRating !== undefined ? roomData.averageRating : room.averageRating,
                totalReview: roomData.totalReview !== undefined ? roomData.totalReview : room.totalReview,
                description: roomData.description !== undefined ? roomData.description : room.description,
                updatedAt: new Date()
            }, { transaction });
            
            if (roomData.amenities && roomData.amenities.length > 0) {
                const amenitiesExist = await db.Amenities.findAll({
                    where: { amenitiesId: roomData.amenities }
                });
                if (amenitiesExist.length !== roomData.amenities.length) {
                    await transaction.rollback();
                    return {
                        EM: 'Một số tiện nghi không tồn tại',
                        EC: 1,
                        DT: []
                    };
                }

                await db.RoomAmenities.destroy({
                    where: { roomId: roomId },
                    transaction
                });
                
                const roomAmenitiesData = roomData.amenities.map(amenityId => ({
                    roomId: roomId,
                    amenitiesId: amenityId,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }));
                
                await db.RoomAmenities.bulkCreate(roomAmenitiesData, { transaction });
            }
            
            await transaction.commit();
            
            const updatedRoom = await db.Room.findByPk(roomId, {
                include: [
                    {
                        model: db.Amenities,
                        as: 'Amenities',
                        through: { attributes: [] },
                        required: false
                    },
                    {
                        model: db.Hotel,
                        required: false
                    }
                ]
            });
            
            return {
                EM: 'Cập nhật phòng thành công',
                EC: 0,
                DT: updatedRoom
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

    deleteRoom: async (roomId) => {
        const transaction = await db.sequelize.transaction();
        
        try {
            const room = await db.Room.findByPk(roomId);
            
            if (!room) {
                await transaction.rollback();
                return {
                    EM: 'Không tìm thấy phòng',
                    EC: 1,
                    DT: []
                };
            }
            
            await db.RoomAmenities.destroy({
                where: { roomId: roomId },
                transaction
            });
            
            await room.destroy({ transaction });
            
            await transaction.commit();
            return {
                EM: 'Xóa phòng thành công',
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

    // Đặt phòng mới với tích hợp VNPay
    bookRoom: async (bookingData) => {
        const transaction = await db.sequelize.transaction();
        
        try {
            console.log('BookingData received:', JSON.stringify(bookingData, null, 2));
            
            // Kiểm tra dữ liệu đầu vào
            if (!bookingData.customerId || !bookingData.hotelId || !bookingData.dateIn || !bookingData.dateOut || !bookingData.rooms || bookingData.rooms.length === 0) {
                await transaction.rollback();
                return {
                    EM: 'Thiếu thông tin bắt buộc: customerId, hotelId, dateIn, dateOut, rooms',
                    EC: 1,
                    DT: []
                };
            }

            // Kiểm tra phương thức thanh toán
            const validPaymentMethods = ['Cash', 'CreditCard', 'BankTransfer', 'VNPay'];
            if (!bookingData.paymentMethod || !validPaymentMethods.includes(bookingData.paymentMethod)) {
                await transaction.rollback();
                return {
                    EM: 'Phương thức thanh toán không hợp lệ',
                    EC: 1,
                    DT: []
                };
            }

            // Kiểm tra định dạng ngày
            const dateInObj = new Date(bookingData.dateIn);
            const dateOutObj = new Date(bookingData.dateOut);

            if (isNaN(dateInObj.getTime()) || isNaN(dateOutObj.getTime())) {
                await transaction.rollback();
                return {
                    EM: 'Định dạng ngày không hợp lệ',
                    EC: 1,
                    DT: []
                };
            }

            // Kiểm tra khách hàng có tồn tại không
            const customer = await db.Customer.findByPk(bookingData.customerId);
            if (!customer) {
                await transaction.rollback();
                return {
                    EM: 'Không tìm thấy khách hàng',
                    EC: 1,
                    DT: []
                };
            }

            // Kiểm tra khách sạn có tồn tại không
            const hotel = await db.Hotel.findByPk(bookingData.hotelId);
            if (!hotel) {
                await transaction.rollback();
                return {
                    EM: 'Không tìm thấy khách sạn',
                    EC: 1,
                    DT: []
                };
            }

            // Tạo đơn đặt phòng mới
            const newBooking = await db.FactBooking.create({
                customerId: bookingData.customerId,
                hotelId: bookingData.hotelId,
                dateIn: dateInObj,
                dateOut: dateOutObj,
                orderDate: new Date(),
                createdAt: new Date(),
                updatedAt: new Date()
            }, { transaction });

            // Tổng số tiền của đơn đặt phòng
            let totalAmount = 0;

            // Tạo chi tiết đặt phòng cho từng phòng
            for (const roomItem of bookingData.rooms) {
                // Kiểm tra phòng có tồn tại không
                const room = await db.Room.findByPk(roomItem.roomId);
                if (!room) {
                    await transaction.rollback();
                    return {
                        EM: `Không tìm thấy phòng với ID: ${roomItem.roomId}`,
                        EC: 1,
                        DT: []
                    };
                }

                // Kiểm tra phòng có trống trong khoảng thời gian đặt không
                const isAvailable = await checkRoomAvailability(
                    roomItem.roomId,
                    bookingData.dateIn,
                    bookingData.dateOut
                );

                if (!isAvailable) {
                    await transaction.rollback();
                    return {
                        EM: `Phòng ${room.roomName} không còn trống trong khoảng thời gian đã chọn`,
                        EC: 1,
                        DT: []
                    };
                }

                // Tính tổng số tiền cho phòng này
                const days = Math.ceil((dateOutObj - dateInObj) / (1000 * 60 * 60 * 24));
                if (days <= 0) {
                    await transaction.rollback();
                    return {
                        EM: 'Số ngày đặt phòng phải lớn hơn 0',
                        EC: 1,
                        DT: []
                    };
                }
                
                const roomCount = roomItem.roomCount || 1;
                const roomPrice = parseFloat(room.price || 0);
                const roomAmount = roomPrice * days * roomCount;
                
                console.log(`Tính tiền phòng: ID ${room.roomId}, ${room.roomName}`);
                console.log(`- Giá phòng: ${roomPrice.toLocaleString()} VND`);
                console.log(`- Số ngày: ${days}`);
                console.log(`- Số lượng phòng: ${roomCount}`);
                console.log(`- Thành tiền: ${roomAmount.toLocaleString()} VND`);
                
                totalAmount += roomAmount;

                // Tạo chi tiết đặt phòng
                const bookingDetail = await db.FactBookingDetail.create({
                    bookingId: newBooking.bookingId,
                    roomId: roomItem.roomId,
                    specialRequests: roomItem.specialRequests || '',
                    bookingStatus: 'Pending',
                    adultCount: roomItem.adultCount || 1,
                    childrenCount: roomItem.childrenCount || 0,
                    roomCount: roomCount,
                    totalAmount: roomAmount,
                    specialRate: roomPrice,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }, { transaction });

                // Cập nhật trạng thái phòng
                await db.RoomAvailability.create({
                    roomId: roomItem.roomId,
                    dateIn: dateInObj,
                    dateOut: dateOutObj,
                    isAvailable: false,
                    bookingId: newBooking.bookingId,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }, { transaction });

                // Thêm tiện nghi nếu có
                if (roomItem.amenities && roomItem.amenities.length > 0) {
                    // Lấy tất cả amenities để kiểm tra trước
                    const amenityIds = roomItem.amenities.map(item => item.amenitiesId);
                    const validAmenities = await db.Amenities.findAll({
                        where: { amenitiesId: amenityIds }
                    });
                    
                    // Kiểm tra xem có amenity nào không tồn tại
                    const foundAmenityIds = validAmenities.map(a => a.amenitiesId);
                    const missingAmenityIds = amenityIds.filter(id => !foundAmenityIds.includes(id));
                    
                    if (missingAmenityIds.length > 0) {
                        await transaction.rollback();
                        return {
                            EM: `Không tìm thấy tiện nghi với ID: ${missingAmenityIds.join(', ')}`,
                            EC: 1,
                            DT: []
                        };
                    }
                    
                    // Xử lý từng amenity
                    for (const amenityItem of roomItem.amenities) {
                        const amenity = validAmenities.find(a => a.amenitiesId === amenityItem.amenitiesId);
                        
                        // Tính tiền tiện nghi và cộng vào tổng
                        const quantity = amenityItem.quantity || roomCount; // Mặc định lấy bằng roomCount
                        const amenityPrice = parseFloat(amenity.price || 0);
                        const amenityAmount = amenityPrice * quantity * days; // Tính cho số ngày đặt
                        
                        console.log(`Tính tiền tiện ích: ID ${amenity.amenitiesId}, ${amenity.amenitiesName}`);
                        console.log(`- Giá tiện ích: ${amenityPrice.toLocaleString()} VND`);
                        console.log(`- Số lượng: ${quantity}`);
                        console.log(`- Số ngày: ${days}`);
                        console.log(`- Thành tiền: ${amenityAmount.toLocaleString()} VND`);
                        
                        totalAmount += amenityAmount;

                        // Tạo chi tiết tiện nghi
                        await db.FactBookingDetailAmenities.create({
                            bookingDetailId: bookingDetail.bookingDetailId,
                            amenitiesId: amenityItem.amenitiesId,
                            quantity: quantity,
                            price: amenityPrice,
                            createdAt: new Date(),
                            updatedAt: new Date()
                        }, { transaction });
                    }
                }
            }

            // Tạo bản ghi Payment cho đơn đặt phòng
            // Mặc định statusPayment là 'Pending' cho VNPay, 'Unpaid' cho các phương thức khác
            const statusPayment = bookingData.paymentMethod === 'VNPay' ? 'Pending' : 'Unpaid';
            
            console.log(`Tổng số tiền cuối cùng của đơn hàng: ${totalAmount.toLocaleString()} VND`);
            console.log(`Phương thức thanh toán: ${bookingData.paymentMethod}`);
            console.log(`Trạng thái thanh toán ban đầu: ${statusPayment}`);
            
            await db.Payment.create({
                bookingId: newBooking.bookingId,
                amount: totalAmount,
                paymentMethod: bookingData.paymentMethod,
                statusPayment: statusPayment,
                createdAt: new Date(),
                updatedAt: new Date()
            }, { transaction });

            await transaction.commit();

            // Trả về thông tin đặt phòng và tổng số tiền để chuyển đến thanh toán
            return {
                EM: 'Đặt phòng thành công, chuyển đến thanh toán',
                EC: 0,
                DT: {
                    bookingId: newBooking.bookingId,
                    totalAmount: totalAmount,
                    requirePayment: bookingData.paymentMethod === 'VNPay'
                }
            };
        } catch (error) {
            await transaction.rollback();
            console.error('Error in bookRoom:', error.message, error.stack);
            return {
                EM: `Lỗi từ server: ${error.message}`,
                EC: -1,
                DT: []
            };
        }
    },



    getRoomsByHotelId: async (hotelId) => {
        try {
            if (!Number.isInteger(parseInt(hotelId))) {
                return {
                    EM: 'ID khách sạn không hợp lệ',
                    EC: 1,
                    DT: []
                };
            }

            const rooms = await db.Room.findAll({
                where: { hotelId: hotelId },
                include: [
                    {
                        model: db.Amenities,
                        as: 'Amenities',
                        through: { attributes: [] },
                        required: false
                    },
                    {
                        model: db.Hotel,
                        required: false
                    }
                ]
            });

            // Tính số phòng trống hiện tại cho mỗi phòng và cập nhật trạng thái
            const roomsWithAvailability = await Promise.all(rooms.map(async (room) => {
                const roomData = room.toJSON();
                
                // Tính tổng số phòng đang được đặt hiện tại (dựa trên roomCount thực tế)
                const today = new Date();
                const bookedRoomsCount = await db.sequelize.query(`
                    SELECT COALESCE(SUM(fbd.roomCount), 0) as totalBookedRooms
                    FROM FactBookingDetail fbd
                    INNER JOIN FactBooking fb ON fbd.bookingId = fb.bookingId
                    WHERE fbd.roomId = :roomId 
                    AND fbd.bookingStatus NOT IN ('Cancelled', 'Refunded')
                    AND fb.dateIn <= :today 
                    AND fb.dateOut > :today
                `, {
                    replacements: { 
                        roomId: room.roomId,
                        today: today
                    },
                    type: db.sequelize.QueryTypes.SELECT
                });

                const bookedRooms = bookedRoomsCount[0]?.totalBookedRooms || 0;
                roomData.currentlyAvailable = Math.max(0, room.maxRoom - bookedRooms);
                
                // Tự động cập nhật trạng thái nếu không phải bảo trì
                if (room.roomStatus !== 'Maintenance') {
                    let newStatus = 'Available';
                    if (bookedRooms >= room.maxRoom) {
                        newStatus = 'Occupied';
                    }
                    
                    // Cập nhật trạng thái nếu khác với hiện tại
                    if (room.roomStatus !== newStatus) {
                        await room.update({
                            roomStatus: newStatus,
                            updatedAt: new Date()
                        });
                        roomData.roomStatus = newStatus;
                    }
                }
                
                return roomData;
            }));
            
            return {
                EM: 'Lấy danh sách phòng theo khách sạn thành công',
                EC: 0,
                DT: roomsWithAvailability
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



};

async function checkRoomAvailability(roomId, dateIn, dateOut) {
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

        // Tính tổng số phòng đã được đặt trong khoảng thời gian này (dựa trên roomCount thực tế)
        const bookedRoomsCount = await db.sequelize.query(`
            SELECT COALESCE(SUM(fbd.roomCount), 0) as totalBookedRooms
            FROM FactBookingDetail fbd
            INNER JOIN FactBooking fb ON fbd.bookingId = fb.bookingId
            WHERE fbd.roomId = :roomId 
            AND fbd.bookingStatus NOT IN ('Cancelled', 'Refunded')
            AND (
                (fb.dateIn < :dateOut AND fb.dateOut > :dateIn)
            )
        `, {
            replacements: { 
                roomId: roomId,
                dateIn: dateIn,
                dateOut: dateOut
            },
            type: db.sequelize.QueryTypes.SELECT
        });

        const bookedRooms = bookedRoomsCount[0]?.totalBookedRooms || 0;
        
        // Tính số phòng còn lại sau khi trừ đi số phòng đã đặt thực tế
        const remainingRooms = room.maxRoom - bookedRooms;
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
}

export default roomService;