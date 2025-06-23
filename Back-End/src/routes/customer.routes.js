import express from "express";
import customerController from "../controllers/customerController";
import authMiddleware from "../middleware/authMiddleware";
import permissionMiddleware from "../middleware/permissionMiddleware";

const router = express.Router();

// Các endpoint API cho Customer
router.get('/', 
  authMiddleware.verifyToken,
  permissionMiddleware.canRead('customers'),
  customerController.getAllCustomers
);

router.get('/:id', 
  authMiddleware.verifyToken,
  permissionMiddleware.canRead('customers'),
  customerController.getCustomerById
);

router.post(
  '/', 
  authMiddleware.verifyToken,
  permissionMiddleware.canCreate('customers'),
  customerController.createCustomer
);

router.put(
  '/:id', 
  authMiddleware.verifyToken,
  customerController.updateCustomer
);

router.delete(
  '/:id', 
  authMiddleware.verifyToken,
  permissionMiddleware.canDelete('customers'),
  customerController.deleteCustomer
);

export default router;