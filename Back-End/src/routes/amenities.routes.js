import express from "express";
import amenitiesController from "../controllers/amenitiesController";
import authMiddleware from "../middleware/authMiddleware";
import permissionMiddleware from "../middleware/permissionMiddleware";

const router = express.Router();

// Các endpoint API cho Amenities
router.get('/', amenitiesController.getAllAmenities);  // Public
router.get('/room/:roomId', amenitiesController.getAmenityByRoomId);  // Public
router.get('/:id', amenitiesController.getAmenityById);  // Public

// Các endpoint cần quyền tương ứng
router.post(
  '/', 
  authMiddleware.verifyToken,
  permissionMiddleware.canCreate('amenities'),
  amenitiesController.createAmenity
);

router.put(
  '/:id', 
  authMiddleware.verifyToken,
  permissionMiddleware.canUpdate('amenities'),
  amenitiesController.updateAmenity
);

router.delete(
  '/:id', 
  authMiddleware.verifyToken,
  permissionMiddleware.canDelete('amenities'),
  amenitiesController.deleteAmenity
);

export default router;