import roomAvailabilityService from '../services/roomAvailabilityService';

const roomAvailabilityController = {
    // Lấy tất cả thông tin phòng trống
    getAllRoomAvailabilities: async (req, res, next) => {
        try {
            let data = await roomAvailabilityService.getAllRoomAvailabilities();
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in getAllRoomAvailabilities:", error);
            next(error);
        }
    },

    // Lấy thông tin phòng trống theo ID
    getRoomAvailabilityById: async (req, res, next) => {
        try {
            const roomAvailabilityId = req.params.id;
            let data = await roomAvailabilityService.getRoomAvailabilityById(roomAvailabilityId);
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in getRoomAvailabilityById:", error);
            next(error);
        }
    },

    // Tạo thông tin phòng trống mới
    createRoomAvailability: async (req, res, next) => {
        try {
            const roomAvailabilityData = req.body;
            let data = await roomAvailabilityService.createRoomAvailability(roomAvailabilityData);
            
            return res.status(201).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in createRoomAvailability:", error);
            next(error);
        }
    },

    // Cập nhật thông tin phòng trống
    updateRoomAvailability: async (req, res, next) => {
        try {
            const roomAvailabilityId = req.params.id;
            const roomAvailabilityData = req.body;
            
            let data = await roomAvailabilityService.updateRoomAvailability(roomAvailabilityId, roomAvailabilityData);
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in updateRoomAvailability:", error);
            next(error);
        }
    },

    // Xóa thông tin phòng trống
    deleteRoomAvailability: async (req, res, next) => {
        try {
            const roomAvailabilityId = req.params.id;
            let data = await roomAvailabilityService.deleteRoomAvailability(roomAvailabilityId);
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in deleteRoomAvailability:", error);
            next(error);
        }
    },

    // Kiểm tra phòng có sẵn trong khoảng thời gian
    checkRoomAvailability: async (req, res, next) => {
        try {
            const { roomId, dateIn, dateOut } = req.body;
            
            let data = await roomAvailabilityService.checkRoomAvailability(roomId, dateIn, dateOut);
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in checkRoomAvailability:", error);
            next(error);
        }
    },

    // Tìm kiếm phòng trống theo tiêu chí
    searchAvailableRooms: async (req, res, next) => {
        try {
            const { dateIn, dateOut, roomType, guestCount, city, hotelId } = req.body;
            
            let data = await roomAvailabilityService.searchAvailableRooms(dateIn, dateOut, roomType, guestCount, city, hotelId);
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in searchAvailableRooms:", error);
            next(error);
        }
    }
};

export default roomAvailabilityController;