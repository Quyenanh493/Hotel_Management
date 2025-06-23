import express from "express";
import roomAvailabilityController from "../controllers/roomAvailabilityController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

// Các endpoint API cho RoomAvailability
router.get('/', roomAvailabilityController.getAllRoomAvailabilities);  // Public
router.get('/:id', roomAvailabilityController.getRoomAvailabilityById);  // Public
router.post('/check', roomAvailabilityController.checkRoomAvailability);  // Public
router.post('/search', roomAvailabilityController.searchAvailableRooms);  // Public

// Các endpoint cần quyền admin/staff
router.post(
  '/', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin', 'staff']),
  roomAvailabilityController.createRoomAvailability
);

router.put(
  '/:id', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin', 'staff']),
  roomAvailabilityController.updateRoomAvailability
);

router.delete(
  '/:id', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin']),
  roomAvailabilityController.deleteRoomAvailability
);

export default router;