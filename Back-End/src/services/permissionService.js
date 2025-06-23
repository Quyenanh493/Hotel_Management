import db from '../models/index';

const permissionService = {
    // Lấy tất cả quyền
    getAllPermissions: async () => {
        try {
            const permissions = await db.Permission.findAll({
                order: [['permissionId', 'ASC']]
            });
            
            return {
                EM: 'Lấy danh sách quyền thành công',
                EC: 0,
                DT: permissions
            };
        } catch (error) {
            console.error("Error in getAllPermissions service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Lấy quyền theo ID
    getPermissionById: async (permissionId) => {
        try {
            const permission = await db.Permission.findByPk(permissionId);
            
            if (!permission) {
                return {
                    EM: 'Không tìm thấy quyền',
                    EC: 1,
                    DT: []
                };
            }
            
            return {
                EM: 'Lấy thông tin quyền thành công',
                EC: 0,
                DT: permission
            };
        } catch (error) {
            console.error("Error in getPermissionById service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Tạo quyền mới
    createPermission: async (permissionData) => {
        try {
            // Kiểm tra dữ liệu đầu vào
            if (!permissionData.permissionName || !permissionData.resource || !permissionData.action) {
                return {
                    EM: 'Thiếu thông tin bắt buộc: permissionName, resource hoặc action',
                    EC: 1,
                    DT: []
                };
            }
            
            // Kiểm tra xem quyền đã tồn tại chưa
            const existingPermission = await db.Permission.findOne({
                where: { permissionName: permissionData.permissionName }
            });
            
            if (existingPermission) {
                return {
                    EM: 'Tên quyền đã tồn tại',
                    EC: 2,
                    DT: []
                };
            }
            
            // Tạo quyền mới
            const newPermission = await db.Permission.create({
                permissionName: permissionData.permissionName,
                resource: permissionData.resource,
                action: permissionData.action,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            
            return {
                EM: 'Tạo quyền thành công',
                EC: 0,
                DT: newPermission
            };
        } catch (error) {
            console.error("Error in createPermission service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Cập nhật quyền
    updatePermission: async (permissionId, permissionData) => {
        try {
            const permission = await db.Permission.findByPk(permissionId);
            
            if (!permission) {
                return {
                    EM: 'Không tìm thấy quyền',
                    EC: 1,
                    DT: []
                };
            }
            
            // Kiểm tra xem permissionName mới có trùng với quyền khác không
            if (permissionData.permissionName && permissionData.permissionName !== permission.permissionName) {
                const existingPermission = await db.Permission.findOne({
                    where: { permissionName: permissionData.permissionName }
                });
                
                if (existingPermission) {
                    return {
                        EM: 'Tên quyền đã tồn tại',
                        EC: 2,
                        DT: []
                    };
                }
            }
            
            // Cập nhật thông tin quyền
            await permission.update({
                permissionName: permissionData.permissionName || permission.permissionName,
                resource: permissionData.resource || permission.resource,
                action: permissionData.action || permission.action,
                updatedAt: new Date()
            });
            
            return {
                EM: 'Cập nhật thông tin quyền thành công',
                EC: 0,
                DT: permission
            };
        } catch (error) {
            console.error("Error in updatePermission service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Xóa quyền
    deletePermission: async (permissionId) => {
        try {
            const permission = await db.Permission.findByPk(permissionId);
            
            if (!permission) {
                return {
                    EM: 'Không tìm thấy quyền',
                    EC: 1,
                    DT: []
                };
            }
            
            // Kiểm tra xem quyền có liên kết với vai trò nào không
            const rolePermissions = await db.RolePermission.findAll({
                where: { permissionId: permissionId }
            });
            
            if (rolePermissions.length > 0) {
                return {
                    EM: 'Không thể xóa quyền vì đang được gán cho vai trò. Vui lòng xóa liên kết trước.',
                    EC: 2,
                    DT: []
                };
            }
            
            // Xóa quyền
            await permission.destroy();
            
            return {
                EM: 'Xóa quyền thành công',
                EC: 0,
                DT: []
            };
        } catch (error) {
            console.error("Error in deletePermission service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    }
};

export default permissionService; 