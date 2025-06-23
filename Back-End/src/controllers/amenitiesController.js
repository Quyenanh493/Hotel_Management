import amenitiesService from '../services/amenitiesService';

const amenitiesController = {
    // Lấy tất cả tiện nghi
    getAllAmenities: async (req, res, next) => {
        try {
            let data = await amenitiesService.getAllAmenities();
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in getAllAmenities:", error);
            next(error);
        }
    },

    // Lấy tiện nghi theo ID
    getAmenityById: async (req, res, next) => {
        try {
            const amenityId = req.params.id;
            let data = await amenitiesService.getAmenityById(amenityId);
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in getAmenityById:", error);
            next(error);
        }
    },

    // Tạo tiện nghi mới
    createAmenity: async (req, res, next) => {
        try {
            const amenityData = req.body;
            let data = await amenitiesService.createAmenity(amenityData);
            
            return res.status(201).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in createAmenity:", error);
            next(error);
        }
    },

    // Cập nhật tiện nghi
    updateAmenity: async (req, res, next) => {
        try {
            const amenityId = req.params.id;
            const amenityData = req.body;
            let data = await amenitiesService.updateAmenity(amenityId, amenityData);
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in updateAmenity:", error);
            next(error);
        }
    },

    // Lấy tiện nghi theo ID phòng
    getAmenityByRoomId: async (req, res, next) => {
        try {
            const roomId = req.params.roomId;
            let data = await amenitiesService.getAmenityByRoomId(roomId);
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in getAmenityByRoomId:", error);
            next(error);
        }
    },

    // Xóa tiện nghi
    deleteAmenity: async (req, res, next) => {
        try {
            const amenityId = req.params.id;
            let data = await amenitiesService.deleteAmenity(amenityId);
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in deleteAmenity:", error);
            next(error);
        }
    }
};

export default amenitiesController;