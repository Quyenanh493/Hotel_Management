import express from "express";
import roomReviewController from "../controllers/roomReviewController";
import authMiddleware from "../middleware/authMiddleware";
import permissionMiddleware from "../middleware/permissionMiddleware";

const router = express.Router();

// Các endpoint API cho RoomReview
router.get('/', roomReviewController.getAllRoomReviews);
router.get('/:id', roomReviewController.getRoomReviewById);
router.get('/room/:roomId', roomReviewController.getRoomReviewsByRoomId);
router.get('/hotel/:hotelId', roomReviewController.getRoomReviewsByHotelId);
router.get('/customer/:customerId', roomReviewController.getRoomReviewsByCustomerId);

// Các endpoint cần quyền tương ứng
router.post(
  '/', 
  authMiddleware.verifyToken,
  roomReviewController.createRoomReview
);

router.put(
  '/:id', 
  authMiddleware.verifyToken,
  permissionMiddleware.canUpdate('roomReviews'),
  roomReviewController.updateRoomReview
);

router.delete(
  '/:id', 
  authMiddleware.verifyToken,
  permissionMiddleware.canDelete('roomReviews'),
  roomReviewController.deleteRoomReview
);

export default router; 