import express from "express";
import factBookingDetailController from "../controllers/factBookingDetailController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

// Các endpoint API cho FactBookingDetail
router.get('/', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin', 'staff']),
  factBookingDetailController.getAllBookingDetails
);

router.get('/:id', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin', 'staff']),
  factBookingDetailController.getBookingDetailById
);

router.get('/booking/:bookingId', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin', 'staff']),
  factBookingDetailController.getBookingDetailsByBookingId
);

router.post(
  '/', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin', 'staff']),
  factBookingDetailController.createBookingDetail
);

router.put(
  '/:id', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin', 'staff']),
  factBookingDetailController.updateBookingDetail
);

router.delete(
  '/:id', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin']),
  factBookingDetailController.deleteBookingDetail
);

export default router; 