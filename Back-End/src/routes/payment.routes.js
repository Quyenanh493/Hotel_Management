import express from "express";
import paymentController from "../controllers/paymentController";
import authMiddleware from "../middleware/authMiddleware";
import permissionMiddleware from "../middleware/permissionMiddleware";

const router = express.Router();

// Tạo URL thanh toán VNPay
router.post(
  '/create-payment-url',
  authMiddleware.verifyToken,
  paymentController.createPaymentUrl
);

// Truy vấn kết quả giao dịch VNPay
router.get('/query-dr/:transactionCode', 
  authMiddleware.verifyToken,
  paymentController.queryDr
);

// Hoàn tiền giao dịch
router.post('/refund',
  authMiddleware.verifyToken,
  permissionMiddleware.canUpdate('payments'),
  paymentController.refundTransaction
);

// Lấy thông tin thanh toán theo bookingId
router.get(
  '/:bookingId',
  authMiddleware.verifyToken,
  permissionMiddleware.canRead('payments'),
  paymentController.getPaymentByBookingId
);

// Lấy tất cả các thanh toán
router.get(
  '/',
  authMiddleware.verifyToken,
  permissionMiddleware.canRead('payments'),
  paymentController.getAllPayments
);

export default router;