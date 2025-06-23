import express from "express";
import permissionController from "../controllers/permissionController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

// Các endpoint API cho Permission
router.get('/', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin']),
  permissionController.getAllPermissions
);

router.get('/:id', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin']),
  permissionController.getPermissionById
);

router.post(
  '/', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin']),
  permissionController.createPermission
);

router.put(
  '/:id', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin']),
  permissionController.updatePermission
);

router.delete(
  '/:id', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin']),
  permissionController.deletePermission
);

export default router; 