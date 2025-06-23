import express from "express";
import roomController from "../controllers/roomController";
import authMiddleware from "../middleware/authMiddleware";
import permissionMiddleware from "../middleware/permissionMiddleware";

const router = express.Router();

// Các endpoint API cho Room
router.get('/', roomController.getAllRooms);  // Public
router.get('/:id', roomController.getRoomById);  // Public
router.get('/hotel/:hotelId', roomController.getRoomsByHotelId);

// Các endpoint cần quyền tương ứng
router.post(
  '/', 
  authMiddleware.verifyToken,
  permissionMiddleware.canCreate('rooms'),
  roomController.createRoom
);

router.put(
  '/:id', 
  authMiddleware.verifyToken,
  permissionMiddleware.canUpdate('rooms'),
  roomController.updateRoom
);

router.delete(
  '/:id', 
  authMiddleware.verifyToken,
  permissionMiddleware.canDelete('rooms'),
  roomController.deleteRoom
);

// Thêm API đặt phòng mới (chỉ yêu cầu xác thực, không cần quyền)
router.post(
  '/booking', 
  authMiddleware.verifyToken,
  roomController.bookRoom
);

export default router;