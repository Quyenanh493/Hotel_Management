import imageService from "../services/imageService";

const handleUploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        EM: 'Không có file ảnh được tải lên',
        EC: -1,
        DT: ''
      });
    }

    // Lấy thông tin về loại hình ảnh (mặc định là 'general')
    const imageType = req.body.type || 'general';
    
    // Tải hình ảnh lên Cloudinary với thư mục phù hợp
    const imageUrl = await imageService.uploadImageHM(
      req.file.buffer,
      req.file.originalname,
      imageType
    );

    return res.status(200).json({
      EM: 'Tải ảnh lên thành công',
      EC: 0,
      DT: { imageUrl }
    });
  } catch (e) {
    console.error("Error in handleUploadImage:", e);
    next(e);
  }
};

const handleUploadImageProfile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        EM: 'Không có file ảnh được tải lên',
        EC: -1,
        DT: ''
      });
    }

    const customerId = req.params.customerId;

    // Tải hình ảnh lên Cloudinary với thư mục phù hợp
    const imageUrl = await imageService.uploadCustomerImage(
      req.file.buffer,
      req.file.originalname,
      customerId
    );

    return res.status(200).json({
      EM: 'Tải ảnh lên thành công',
      EC: 0,
      DT: { imageUrl }
    });
  } catch (e) {
    console.error("Error in handleUploadImage:", e);
    next(e);
  }
};

/**
 * Xử lý upload nhiều ảnh cho phòng
 */
const handleUploadRoomImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        EM: 'Không có file ảnh nào được tải lên',
        EC: -1,
        DT: ''
      });
    }

    const roomId = req.params.roomId;
    
    // Kiểm tra giới hạn số lượng ảnh (tối đa 10 ảnh)
    if (req.files.length > 10) {
      return res.status(400).json({
        EM: 'Chỉ được tải lên tối đa 10 ảnh cho một phòng',
        EC: -1,
        DT: ''
      });
    }

    // Chuẩn bị dữ liệu cho việc upload
    const fileBuffers = req.files.map(file => file.buffer);
    const fileNames = req.files.map(file => file.originalname);

    // Tải nhiều ảnh lên Cloudinary
    const imageUrls = await imageService.uploadRoomImages(
      fileBuffers,
      fileNames,
      roomId
    );

    return res.status(200).json({
      EM: `Tải lên thành công ${imageUrls.length} ảnh cho phòng`,
      EC: 0,
      DT: { 
        imageUrls,
        roomId,
        totalImages: imageUrls.length 
      }
    });
  } catch (e) {
    console.error("Error in handleUploadRoomImages:", e);
    next(e);
  }
};

/**
 * Xử lý upload nhiều ảnh cho khách sạn
 */
const handleUploadHotelImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        EM: 'Không có file ảnh nào được tải lên',
        EC: -1,
        DT: ''
      });
    }

    const hotelId = req.params.hotelId;
    
    // Kiểm tra giới hạn số lượng ảnh (tối đa 15 ảnh cho khách sạn)
    if (req.files.length > 15) {
      return res.status(400).json({
        EM: 'Chỉ được tải lên tối đa 15 ảnh cho một khách sạn',
        EC: -1,
        DT: ''
      });
    }

    // Chuẩn bị dữ liệu cho việc upload
    const fileBuffers = req.files.map(file => file.buffer);
    const fileNames = req.files.map(file => file.originalname);

    // Tải nhiều ảnh lên Cloudinary
    const imageUrls = await imageService.uploadHotelImages(
      fileBuffers,
      fileNames,
      hotelId
    );

    return res.status(200).json({
      EM: `Tải lên thành công ${imageUrls.length} ảnh cho khách sạn`,
      EC: 0,
      DT: { 
        imageUrls,
        hotelId,
        totalImages: imageUrls.length 
      }
    });
  } catch (e) {
    console.error("Error in handleUploadHotelImages:", e);
    next(e);
  }
};

/**
 * Lấy tất cả ảnh của một phòng
 */
const handleGetRoomImages = async (req, res, next) => {
  try {
    const roomId = req.params.roomId;
    
    if (!roomId) {
      return res.status(400).json({
        EM: 'Thiếu ID phòng',
        EC: -1,
        DT: ''
      });
    }

    const images = await imageService.getRoomImages(roomId);

    return res.status(200).json({
      EM: 'Lấy danh sách ảnh phòng thành công',
      EC: 0,
      DT: { 
        roomId,
        images,
        totalImages: images.length 
      }
    });
  } catch (e) {
    console.error("Error in handleGetRoomImages:", e);
    return res.status(404).json({
      EM: e.message || 'Lỗi khi lấy danh sách ảnh phòng',
      EC: -1,
      DT: ''
    });
  }
};

/**
 * Lấy tất cả ảnh của một khách sạn
 */
const handleGetHotelImages = async (req, res, next) => {
  try {
    const hotelId = req.params.hotelId;
    
    if (!hotelId) {
      return res.status(400).json({
        EM: 'Thiếu ID khách sạn',
        EC: -1,
        DT: ''
      });
    }

    const images = await imageService.getHotelImages(hotelId);

    return res.status(200).json({
      EM: 'Lấy danh sách ảnh khách sạn thành công',
      EC: 0,
      DT: { 
        hotelId,
        images,
        totalImages: images.length 
      }
    });
  } catch (e) {
    console.error("Error in handleGetHotelImages:", e);
    return res.status(404).json({
      EM: e.message || 'Lỗi khi lấy danh sách ảnh khách sạn',
      EC: -1,
      DT: ''
    });
  }
};

/**
 * Xóa một ảnh cụ thể của phòng
 */
const handleDeleteRoomImage = async (req, res, next) => {
  try {
    const roomId = req.params.roomId;
    const { imageUrl } = req.body;
    
    if (!roomId || !imageUrl) {
      return res.status(400).json({
        EM: 'Thiếu ID phòng hoặc URL ảnh',
        EC: -1,
        DT: ''
      });
    }

    await imageService.deleteRoomImage(roomId, imageUrl);

    return res.status(200).json({
      EM: 'Xóa ảnh phòng thành công',
      EC: 0,
      DT: { roomId, deletedImageUrl: imageUrl }
    });
  } catch (e) {
    console.error("Error in handleDeleteRoomImage:", e);
    return res.status(500).json({
      EM: e.message || 'Lỗi khi xóa ảnh phòng',
      EC: -1,
      DT: ''
    });
  }
};

/**
 * Xóa một ảnh cụ thể của khách sạn
 */
const handleDeleteHotelImage = async (req, res, next) => {
  try {
    const hotelId = req.params.hotelId;
    const { imageUrl } = req.body;
    
    if (!hotelId || !imageUrl) {
      return res.status(400).json({
        EM: 'Thiếu ID khách sạn hoặc URL ảnh',
        EC: -1,
        DT: ''
      });
    }

    await imageService.deleteHotelImage(hotelId, imageUrl);

    return res.status(200).json({
      EM: 'Xóa ảnh khách sạn thành công',
      EC: 0,
      DT: { hotelId, deletedImageUrl: imageUrl }
    });
  } catch (e) {
    console.error("Error in handleDeleteHotelImage:", e);
    return res.status(500).json({
      EM: e.message || 'Lỗi khi xóa ảnh khách sạn',
      EC: -1,
      DT: ''
    });
  }
};

module.exports = {
  handleUploadImage,
  handleUploadImageProfile,
  handleUploadRoomImages,
  handleUploadHotelImages,
  handleGetRoomImages,
  handleGetHotelImages,
  handleDeleteRoomImage,
  handleDeleteHotelImage
};
