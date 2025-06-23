import hotelService from '../services/hotelService';

const hotelController = {
    // Lấy tất cả khách sạn (cho public)
    getAllHotels: async (req, res, next) => {
        try {
            let data = await hotelService.getAllHotels();
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in getAllHotels:", error);
            next(error);
        }
    },

    // Lấy tất cả khách sạn cho admin (bao gồm cả active và inactive)
    getAllHotelsForAdmin: async (req, res, next) => {
        try {
            let data = await hotelService.getAllHotelsForAdmin();
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in getAllHotelsForAdmin:", error);
            next(error);
        }
    },

    // Lấy khách sạn theo ID
    getHotelById: async (req, res, next) => {
        try {
            const hotelId = req.params.id;
            let data = await hotelService.getHotelById(hotelId);
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in getHotelById:", error);
            next(error);
        }
    },

    // Lấy danh sách thành phố
    getCities: async (req, res, next) => {
        try {
            let data = await hotelService.getCities();
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in getCities:", error);
            next(error);
        }
    },

    // Lấy danh sách khách sạn theo thành phố
    getHotelsByCity: async (req, res, next) => {
        try {
            const city = req.params.city;
            let data = await hotelService.getHotelsByCity(city);
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in getHotelsByCity:", error);
            next(error);
        }
    },

    // Tìm kiếm khách sạn có sẵn theo tiêu chí
    searchAvailableHotels: async (req, res, next) => {
        try {
            const { city, dateIn, dateOut, roomCount, guestCount } = req.body;
            
            // Kiểm tra dữ liệu đầu vào
            if (!city || !dateIn || !dateOut || !roomCount || !guestCount) {
                return res.status(400).json({
                    EM: 'Thiếu thông tin bắt buộc: city, dateIn, dateOut, roomCount, guestCount',
                    EC: 1,
                    DT: []
                });
            }

            const searchCriteria = {
                city,
                dateIn: new Date(dateIn),
                dateOut: new Date(dateOut),
                roomCount: parseInt(roomCount),
                guestCount: parseInt(guestCount)
            };

            let data = await hotelService.searchAvailableHotels(searchCriteria);
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in searchAvailableHotels:", error);
            next(error);
        }
    },

    // Tìm kiếm khách sạn đơn giản (để debug)
    searchAvailableHotelsSimple: async (req, res, next) => {
        try {
            const { city, guestCount } = req.body;
            
            // Kiểm tra dữ liệu đầu vào
            if (!city || !guestCount) {
                return res.status(400).json({
                    EM: 'Thiếu thông tin bắt buộc: city, guestCount',
                    EC: 1,
                    DT: []
                });
            }

            const searchCriteria = {
                city,
                guestCount: parseInt(guestCount)
            };

            let data = await hotelService.searchAvailableHotelsSimple(searchCriteria);
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in searchAvailableHotelsSimple:", error);
            next(error);
        }
    },

    // Tạo khách sạn mới
    createHotel: async (req, res, next) => {
        try {
            const hotelData = req.body;
            
            // Nếu có hình ảnh được tải lên, thêm đường dẫn vào hotelData
            if (req.file) {
                hotelData.hotelImage = req.file.path;
            }
            
            let data = await hotelService.createHotel(hotelData);
            
            return res.status(201).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in createHotel:", error);
            next(error);
        }
    },

    // Cập nhật khách sạn
    updateHotel: async (req, res, next) => {
        try {
            const hotelId = req.params.id;
            const hotelData = req.body;
            
            // Nếu có hình ảnh được tải lên, thêm đường dẫn vào hotelData
            if (req.file) {
                hotelData.hotelImage = req.file.path;
            }
            
            let data = await hotelService.updateHotel(hotelId, hotelData);
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in updateHotel:", error);
            next(error);
        }
    },

    // Xóa khách sạn
    deleteHotel: async (req, res, next) => {
        try {
            const hotelId = req.params.id;
            let data = await hotelService.deleteHotel(hotelId);
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in deleteHotel:", error);
            next(error);
        }
    }
};

export default hotelController;