import permissionService from '../services/permissionService';

const permissionController = {
  // Lấy tất cả quyền
  getAllPermissions: async (req, res, next) => {
    try {
      let data = await permissionService.getAllPermissions();
      
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT
      });
    } catch (error) {
      console.error("Error in getAllPermissions:", error);
      next(error);
    }
  },

  // Lấy quyền theo id
  getPermissionById: async (req, res, next) => {
    try {
      const permissionId = req.params.id;
      let data = await permissionService.getPermissionById(permissionId);
      
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT
      });
    } catch (error) {
      console.error("Error in getPermissionById:", error);
      next(error);
    }
  },

  // Tạo quyền mới
  createPermission: async (req, res, next) => {
    try {
      const permissionData = req.body;
      let data = await permissionService.createPermission(permissionData);
      
      return res.status(201).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT
      });
    } catch (error) {
      console.error("Error in createPermission:", error);
      next(error);
    }
  },

  // Cập nhật quyền
  updatePermission: async (req, res, next) => {
    try {
      const permissionId = req.params.id;
      const permissionData = req.body;
      let data = await permissionService.updatePermission(permissionId, permissionData);
      
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT
      });
    } catch (error) {
      console.error("Error in updatePermission:", error);
      next(error);
    }
  },

  // Xóa quyền
  deletePermission: async (req, res, next) => {
    try {
      const permissionId = req.params.id;
      let data = await permissionService.deletePermission(permissionId);
      
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT
      });
    } catch (error) {
      console.error("Error in deletePermission:", error);
      next(error);
    }
  }
};

export default permissionController; 