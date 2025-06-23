import express from "express";
import apiController from "../controllers/apiController";
import authController from "../controllers/authController";
import validationMiddleware from "../middleware/validationMiddleware";

const router = express.Router();

// API đăng ký và đăng nhập - không cần xác thực
router.post(
  '/register', 
  validationMiddleware.validateRegister,
  apiController.handleRegister
);

router.post(
  '/login', 
  validationMiddleware.validateLogin,
  apiController.handleLogin
);

// API refresh token và logout
router.post(
  '/refresh-token',
  apiController.handleRefreshToken
);

// API quên mật khẩu
router.post('/forgot-password', authController.handleForgotPassword);
router.post('/verify-reset-code', authController.handleVerifyResetCode);
router.post('/reset-password', authController.handleResetPassword);

export default router;