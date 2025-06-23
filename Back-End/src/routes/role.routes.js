import express from "express";
import roleController from "../controllers/roleController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

// Các endpoint API cho Role
router.get('/', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin']),
  roleController.getAllRoles
);

router.get('/:id', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin']),
  roleController.getRoleById
);

router.post(
  '/', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin']),
  roleController.createRole
);

router.put(
  '/:id', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin']),
  roleController.updateRole
);

router.delete(
  '/:id', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin']),
  roleController.deleteRole
);

router.post(
  '/add-permission', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin']),
  roleController.addPermissionToRole
);

router.post(
  '/remove-permission', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin']),
  roleController.removePermissionFromRole
);

export default router; 