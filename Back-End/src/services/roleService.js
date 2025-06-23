import db from '../models/index';

const roleService = {
    // Lấy tất cả vai trò
    getAllRoles: async () => {
        try {
            const roles = await db.Role.findAll({
                include: [
                    {
                        model: db.Permission,
                        through: { attributes: [] }
                    }
                ]
            });
            
            return {
                EM: 'Lấy danh sách vai trò thành công',
                EC: 0,
                DT: roles
            };
        } catch (error) {
            console.error("Error in getAllRoles service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Lấy vai trò theo ID
    getRoleById: async (roleId) => {
        try {
            const role = await db.Role.findByPk(roleId, {
                include: [
                    {
                        model: db.Permission,
                        through: { attributes: [] }
                    },
                    {
                        model: db.User,
                        attributes: ['userId', 'fullName', 'userName']
                    }
                ]
            });
            
            if (!role) {
                return {
                    EM: 'Không tìm thấy vai trò',
                    EC: 1,
                    DT: []
                };
            }
            
            return {
                EM: 'Lấy thông tin vai trò thành công',
                EC: 0,
                DT: role
            };
        } catch (error) {
            console.error("Error in getRoleById service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Tạo vai trò mới
    createRole: async (roleData) => {
        const transaction = await db.sequelize.transaction();
        
        try {
            // Kiểm tra tên vai trò đã tồn tại chưa
            const existingRole = await db.Role.findOne({
                where: { roleName: roleData.roleName }
            });
            
            if (existingRole) {
                await transaction.rollback();
                return {
                    EM: 'Tên vai trò đã tồn tại trong hệ thống',
                    EC: 1,
                    DT: []
                };
            }
            
            // Tạo vai trò mới
            const newRole = await db.Role.create({
                roleName: roleData.roleName,
                description: roleData.description || '',
                createdAt: new Date(),
                updatedAt: new Date()
            }, { transaction });
            
            // Nếu có danh sách quyền, thêm vào bảng RolePermission
            if (roleData.permissions && roleData.permissions.length > 0) {
                const permissionPromises = roleData.permissions.map(permissionId => {
                    return db.RolePermission.create({
                        roleId: newRole.roleId,
                        permissionId: permissionId,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }, { transaction });
                });
                
                await Promise.all(permissionPromises);
            }
            
            await transaction.commit();
            
            // Lấy thông tin vai trò đã tạo với dữ liệu liên quan
            const role = await db.Role.findByPk(newRole.roleId, {
                include: [
                    {
                        model: db.Permission,
                        through: { attributes: [] }
                    }
                ]
            });
            
            return {
                EM: 'Tạo vai trò thành công',
                EC: 0,
                DT: role
            };
        } catch (error) {
            await transaction.rollback();
            console.error("Error in createRole service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Cập nhật thông tin vai trò
    updateRole: async (roleId, roleData) => {
        const transaction = await db.sequelize.transaction();
        
        try {
            const role = await db.Role.findByPk(roleId);
            
            if (!role) {
                await transaction.rollback();
                return {
                    EM: 'Không tìm thấy vai trò',
                    EC: 1,
                    DT: []
                };
            }
            
            // Kiểm tra tên vai trò đã tồn tại chưa (nếu có thay đổi)
            if (roleData.roleName && roleData.roleName !== role.roleName) {
                const existingRole = await db.Role.findOne({
                    where: { roleName: roleData.roleName }
                });
                
                if (existingRole) {
                    await transaction.rollback();
                    return {
                        EM: 'Tên vai trò đã tồn tại trong hệ thống',
                        EC: 1,
                        DT: []
                    };
                }
            }
            
            // Cập nhật thông tin vai trò
            await role.update({
                roleName: roleData.roleName !== undefined ? roleData.roleName : role.roleName,
                description: roleData.description !== undefined ? roleData.description : role.description,
                updatedAt: new Date()
            }, { transaction });
            
            // Nếu có cập nhật quyền, xóa các bản ghi cũ và tạo mới
            if (roleData.permissions) {
                // Xóa các quyền cũ
                await db.RolePermission.destroy({
                    where: { roleId: roleId },
                    transaction
                });
                
                // Tạo các quyền mới
                if (roleData.permissions.length > 0) {
                    const permissionPromises = roleData.permissions.map(permissionId => {
                        return db.RolePermission.create({
                            roleId: roleId,
                            permissionId: permissionId,
                            createdAt: new Date(),
                            updatedAt: new Date()
                        }, { transaction });
                    });
                    
                    await Promise.all(permissionPromises);
                }
            }
            
            await transaction.commit();
            
            // Lấy thông tin vai trò đã cập nhật với dữ liệu liên quan
            const updatedRole = await db.Role.findByPk(roleId, {
                include: [
                    {
                        model: db.Permission,
                        through: { attributes: [] }
                    }
                ]
            });
            
            return {
                EM: 'Cập nhật vai trò thành công',
                EC: 0,
                DT: updatedRole
            };
        } catch (error) {
            await transaction.rollback();
            console.error("Error in updateRole service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Xóa vai trò
    deleteRole: async (roleId) => {
        const transaction = await db.sequelize.transaction();
        
        try {
            const role = await db.Role.findByPk(roleId, {
                include: [{ model: db.User }]
            });
            
            if (!role) {
                await transaction.rollback();
                return {
                    EM: 'Không tìm thấy vai trò',
                    EC: 1,
                    DT: []
                };
            }
            
            // Kiểm tra xem vai trò đang được sử dụng bởi người dùng không
            if (role.Users && role.Users.length > 0) {
                await transaction.rollback();
                return {
                    EM: 'Không thể xóa vai trò đang được sử dụng bởi người dùng',
                    EC: 2,
                    DT: []
                };
            }
            
            // Xóa các bản ghi liên quan trong bảng RolePermission
            await db.RolePermission.destroy({
                where: { roleId: roleId },
                transaction
            });
            
            // Xóa vai trò
            await role.destroy({ transaction });
            
            await transaction.commit();
            
            return {
                EM: 'Xóa vai trò thành công',
                EC: 0,
                DT: { roleId }
            };
        } catch (error) {
            await transaction.rollback();
            console.error("Error in deleteRole service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },
    
    // Thêm quyền cho vai trò
    addPermissionToRole: async (roleId, permissionId) => {
        const transaction = await db.sequelize.transaction();
        
        try {
            // Kiểm tra vai trò tồn tại không
            const role = await db.Role.findByPk(roleId);
            if (!role) {
                await transaction.rollback();
                return {
                    EM: 'Không tìm thấy vai trò',
                    EC: 1,
                    DT: []
                };
            }
            
            // Kiểm tra quyền tồn tại không
            const permission = await db.Permission.findByPk(permissionId);
            if (!permission) {
                await transaction.rollback();
                return {
                    EM: 'Không tìm thấy quyền',
                    EC: 1,
                    DT: []
                };
            }
            
            // Kiểm tra quyền đã được gán cho vai trò chưa
            const existingRolePermission = await db.RolePermission.findOne({
                where: {
                    roleId: roleId,
                    permissionId: permissionId
                }
            });
            
            if (existingRolePermission) {
                await transaction.rollback();
                return {
                    EM: 'Quyền đã được gán cho vai trò này',
                    EC: 2,
                    DT: []
                };
            }
            
            // Thêm quyền cho vai trò
            await db.RolePermission.create({
                roleId: roleId,
                permissionId: permissionId,
                createdAt: new Date(),
                updatedAt: new Date()
            }, { transaction });
            
            await transaction.commit();
            
            // Lấy thông tin vai trò với dữ liệu liên quan
            const updatedRole = await db.Role.findByPk(roleId, {
                include: [
                    {
                        model: db.Permission,
                        through: { attributes: [] }
                    }
                ]
            });
            
            return {
                EM: 'Thêm quyền cho vai trò thành công',
                EC: 0,
                DT: updatedRole
            };
        } catch (error) {
            await transaction.rollback();
            console.error("Error in addPermissionToRole service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },
    
    // Xóa quyền khỏi vai trò
    removePermissionFromRole: async (roleId, permissionId) => {
        const transaction = await db.sequelize.transaction();
        
        try {
            // Kiểm tra vai trò tồn tại không
            const role = await db.Role.findByPk(roleId);
            if (!role) {
                await transaction.rollback();
                return {
                    EM: 'Không tìm thấy vai trò',
                    EC: 1,
                    DT: []
                };
            }
            
            // Kiểm tra quyền tồn tại không
            const permission = await db.Permission.findByPk(permissionId);
            if (!permission) {
                await transaction.rollback();
                return {
                    EM: 'Không tìm thấy quyền',
                    EC: 1,
                    DT: []
                };
            }
            
            // Xóa quyền khỏi vai trò
            const deleted = await db.RolePermission.destroy({
                where: {
                    roleId: roleId,
                    permissionId: permissionId
                },
                transaction
            });
            
            if (deleted === 0) {
                await transaction.rollback();
                return {
                    EM: 'Quyền chưa được gán cho vai trò này',
                    EC: 2,
                    DT: []
                };
            }
            
            await transaction.commit();
            
            // Lấy thông tin vai trò với dữ liệu liên quan
            const updatedRole = await db.Role.findByPk(roleId, {
                include: [
                    {
                        model: db.Permission,
                        through: { attributes: [] }
                    }
                ]
            });
            
            return {
                EM: 'Xóa quyền khỏi vai trò thành công',
                EC: 0,
                DT: updatedRole
            };
        } catch (error) {
            await transaction.rollback();
            console.error("Error in removePermissionFromRole service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    }
};

export default roleService; 