import express from "express";
import factBookingController from "../controllers/factBookingController";
import authMiddleware from "../middleware/authMiddleware";
import permissionMiddleware from "../middleware/permissionMiddleware";

const router = express.Router();

// Các endpoint API cho FactBooking
router.get('/', 
    authMiddleware.verifyToken,
    permissionMiddleware.canRead('bookings'),
    factBookingController.getAllBookings
);

router.get('/:id', 
    authMiddleware.verifyToken,
    factBookingController.getBookingById
);

router.get('/customer/:customerId', 
    authMiddleware.verifyToken,
    factBookingController.getBookingsByCustomerId
);

// Các endpoint cần quyền tương ứng
router.post(
    '/', 
    authMiddleware.verifyToken,
    permissionMiddleware.canCreate('bookings'),
    factBookingController.createBooking
);

router.put(
    '/:id', 
    authMiddleware.verifyToken,
    permissionMiddleware.canUpdate('bookings'),
    factBookingController.updateBooking
);

router.delete(
    '/:id', 
    authMiddleware.verifyToken,
    permissionMiddleware.canDelete('bookings'),
    factBookingController.deleteBooking
);

export default router; 