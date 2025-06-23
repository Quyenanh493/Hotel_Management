import roomService from '../services/roomService';

const roomController = {
    // Lấy tất cả phòng
    getAllRooms: async (req, res, next) => {
        try {
            let data = await roomService.getAllRooms();
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in getAllRooms:", error);
            next(error);
        }
    },

    // Lấy phòng theo ID
    getRoomById: async (req, res, next) => {
        try {
            const roomId = req.params.id;
            let data = await roomService.getRoomById(roomId);
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in getRoomById:", error);
            next(error);
        }
    },

    // Tạo phòng mới
    createRoom: async (req, res, next) => {
        try {
            const roomData = req.body;
            
            // Nếu có hình ảnh được tải lên, thêm đường dẫn vào roomData
            if (req.file) {
                roomData.roomImage = req.file.path;
            }
            
            let data = await roomService.createRoom(roomData);
            
            return res.status(201).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in createRoom:", error);
            next(error);
        }
    },

    // Cập nhật phòng
    updateRoom: async (req, res, next) => {
        try {
            const roomId = req.params.id;
            const roomData = req.body;
            
            // Nếu có hình ảnh được tải lên, thêm đường dẫn vào roomData
            if (req.file) {
                roomData.roomImage = req.file.path;
            }
            
            let data = await roomService.updateRoom(roomId, roomData);
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in updateRoom:", error);
            next(error);
        }
    },

    // Xóa phòng
    deleteRoom: async (req, res, next) => {
        try {
            const roomId = req.params.id;
            let data = await roomService.deleteRoom(roomId);
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in deleteRoom:", error);
            next(error);
        }
    },

    // Đặt phòng mới
    bookRoom: async (req, res, next) => {
        try {
            const bookingData = req.body;
            let data = await roomService.bookRoom(bookingData);
            
            return res.status(201).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in bookRoom:", error);
            next(error);
        }
    },

    // Lấy phòng theo hotelId
    getRoomsByHotelId: async (req, res, next) => {
        try {
            const hotelId = req.params.hotelId;
            let data = await roomService.getRoomsByHotelId(hotelId);
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in getRoomsByHotelId:", error);
            next(error);
        }
    }
};

export default roomController;