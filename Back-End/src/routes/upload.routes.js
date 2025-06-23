import express from "express";
import upload from "../middleware/uploadMiddleware";
import imageController from "../controllers/imageController";
const router = express.Router();

// API tải lên hình ảnh - yêu cầu xác thực
router.post(
  '/',
  upload.single('image'),
  imageController.handleUploadImage
);

router.post(
  '/profile/:customerId',
  upload.single('image'),
  imageController.handleUploadImageProfile
);

// API tải lên nhiều ảnh cho phòng (tối đa 10 ảnh)
router.post(
  '/room/:roomId',
  upload.array('images', 10),
  imageController.handleUploadRoomImages
);

// API tải lên nhiều ảnh cho khách sạn (tối đa 15 ảnh)
router.post(
  '/hotel/:hotelId',
  upload.array('images', 15),
  imageController.handleUploadHotelImages
);

// API lấy danh sách ảnh của phòng
router.get(
  '/room/:roomId',
  imageController.handleGetRoomImages
);

// API lấy danh sách ảnh của khách sạn
router.get(
  '/hotel/:hotelId',
  imageController.handleGetHotelImages
);

// API xóa ảnh cụ thể của phòng
router.delete(
  '/room/:roomId',
  imageController.handleDeleteRoomImage
);

// API xóa ảnh cụ thể của khách sạn
router.delete(
  '/hotel/:hotelId',
  imageController.handleDeleteHotelImage
);

export default router;