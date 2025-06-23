import roleService from '../services/roleService';

const roleController = {
    // Lấy tất cả vai trò
    getAllRoles: async (req, res) => {
        try {
            const result = await roleService.getAllRoles();
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in getAllRoles controller:", error);
            return res.status(500).json({
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            });
        }
    },

    // Lấy vai trò theo ID
    getRoleById: async (req, res) => {
        try {
            const roleId = req.params.id;
            const result = await roleService.getRoleById(roleId);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in getRoleById controller:", error);
            return res.status(500).json({
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            });
        }
    },

    // Tạo vai trò mới
    createRole: async (req, res) => {
        try {
            const roleData = req.body;
            const result = await roleService.createRole(roleData);
            return res.status(201).json(result);
        } catch (error) {
            console.error("Error in createRole controller:", error);
            return res.status(500).json({
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            });
        }
    },

    // Cập nhật thông tin vai trò
    updateRole: async (req, res) => {
        try {
            const roleId = req.params.id;
            const roleData = req.body;
            const result = await roleService.updateRole(roleId, roleData);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in updateRole controller:", error);
            return res.status(500).json({
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            });
        }
    },

    // Xóa vai trò
    deleteRole: async (req, res) => {
        try {
            const roleId = req.params.id;
            const result = await roleService.deleteRole(roleId);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in deleteRole controller:", error);
            return res.status(500).json({
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            });
        }
    },
    
    // Thêm quyền cho vai trò
    addPermissionToRole: async (req, res) => {
        try {
            const { roleId, permissionId } = req.body;
            const result = await roleService.addPermissionToRole(roleId, permissionId);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in addPermissionToRole controller:", error);
            return res.status(500).json({
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            });
        }
    },
    
    // Xóa quyền khỏi vai trò
    removePermissionFromRole: async (req, res) => {
        try {
            const { roleId, permissionId } = req.body;
            const result = await roleService.removePermissionFromRole(roleId, permissionId);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in removePermissionFromRole controller:", error);
            return res.status(500).json({
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            });
        }
    }
};

export default roleController; 