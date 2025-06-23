import express from "express";
import userController from "../controllers/userController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

// Các endpoint API cho User
router.get('/', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin']),
  userController.getAllUsers
);

router.get('/:id', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin', 'manager']),
  userController.getUserById
);

router.get('/hotel/:hotelId', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin', 'manager']),
  userController.getUsersByHotelId
);

router.post(
  '/', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin', 'manager']),
  userController.createUser
);

router.put(
  '/:id', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin', 'manager']),
  userController.updateUser
);

router.delete(
  '/:id', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin']),
  userController.deleteUser
);

// API gán vai trò cho người dùng
router.put(
  '/:id/role',
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin']),
  userController.assignRoleToUser
);

// API lấy danh sách quyền của người dùng
router.get(
  '/:id/permissions',
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin']),
  userController.getUserPermissions
);

export default router; 