import express from "express";
import accountController from "../controllers/accountController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

// Các endpoint API cho Account
router.get('/', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin']),
  accountController.getAllAccounts
);

router.get('/:id', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin']),
  accountController.getAccountById
);

router.post(
  '/', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin']),
  accountController.createAccount
);

router.put(
  '/:id', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin']),
  accountController.updateAccount
);

router.delete(
  '/:id', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin']),
  accountController.deleteAccount
);

router.post(
  '/change-password', 
  authMiddleware.verifyToken,
  accountController.changePassword
);

router.post(
  '/reset-password', 
  accountController.resetPassword
);

export default router; 