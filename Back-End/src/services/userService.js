import db from '../models/index';
import bcrypt from 'bcryptjs';

const userService = {
    // Lấy tất cả người dùng
    getAllUsers: async () => {
        try {
            const users = await db.User.findAll({
                include: [
                    {
                        model: db.Account,
                        attributes: ['email', 'accountType', 'accountStatus']
                    },
                    {
                        model: db.Hotel,
                        attributes: ['hotelName', 'address']
                    },
                    {
                        model: db.Role,
                        attributes: ['roleName', 'description']
                    }
                ]
            });
            
            return {
                EM: 'Lấy danh sách người dùng thành công',
                EC: 0,
                DT: users
            };
        } catch (error) {
            console.error("Error in getAllUsers service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Lấy người dùng theo ID
    getUserById: async (userId) => {
        try {
            const user = await db.User.findByPk(userId, {
                include: [
                    {
                        model: db.Account,
                        attributes: ['email', 'accountType', 'accountStatus']
                    },
                    {
                        model: db.Hotel,
                        attributes: ['hotelName', 'address']
                    },
                    {
                        model: db.Role,
                        attributes: ['roleName', 'description']
                    }
                ]
            });
            
            if (!user) {
                return {
                    EM: 'Không tìm thấy người dùng',
                    EC: 1,
                    DT: []
                };
            }
            
            return {
                EM: 'Lấy thông tin người dùng thành công',
                EC: 0,
                DT: user
            };
        } catch (error) {
            console.error("Error in getUserById service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },
    
    // Lấy người dùng theo hotelId
    getUsersByHotelId: async (hotelId) => {
        try {
            const users = await db.User.findAll({
                where: { hotelId: hotelId },
                include: [
                    {
                        model: db.Account,
                        attributes: ['email', 'accountType', 'accountStatus']
                    },
                    {
                        model: db.Role,
                        attributes: ['roleName', 'description']
                    }
                ]
            });
            
            return {
                EM: 'Lấy danh sách người dùng theo khách sạn thành công',
                EC: 0,
                DT: users
            };
        } catch (error) {
            console.error("Error in getUsersByHotelId service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Tạo người dùng mới
    createUser: async (userData) => {
        const transaction = await db.sequelize.transaction();
        
        try {
            // Kiểm tra email đã tồn tại chưa
            const existingEmail = await db.Account.findOne({
                where: { email: userData.email }
            });
            
            if (existingEmail) {
                await transaction.rollback();
                return {
                    EM: 'Email đã tồn tại trong hệ thống',
                    EC: 1,
                    DT: []
                };
            }
            
            // Kiểm tra khách sạn có tồn tại không
            if (userData.hotelId) {
                const hotel = await db.Hotel.findByPk(userData.hotelId);
                if (!hotel) {
                    await transaction.rollback();
                    return {
                        EM: 'Khách sạn không tồn tại',
                        EC: 1,
                        DT: []
                    };
                }
            }
            
            // Kiểm tra role có tồn tại không
            if (userData.roleId) {
                const role = await db.Role.findByPk(userData.roleId);
                if (!role) {
                    await transaction.rollback();
                    return {
                        EM: 'Vai trò không tồn tại',
                        EC: 1,
                        DT: []
                    };
                }
            }
            
            // Hash mật khẩu
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(userData.password || '123456', salt);
            
            // Tạo tài khoản mới
            const newAccount = await db.Account.create({
                email: userData.email,
                password: hashedPassword,
                accountType: 'staff',
                accountStatus: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }, { transaction });
            
            // Tạo người dùng mới
            const newUser = await db.User.create({
                hotelId: userData.hotelId,
                accountId: newAccount.accountId,
                roleId: userData.roleId,
                userName: userData.userName,
                fullName: userData.fullName,
                userStatus: userData.userStatus !== undefined ? userData.userStatus : true,
                createdAt: new Date(),
                updatedAt: new Date()
            }, { transaction });
            
            await transaction.commit();
            
            // Lấy thông tin người dùng đã tạo với dữ liệu liên quan
            const user = await db.User.findByPk(newUser.userId, {
                include: [
                    {
                        model: db.Account,
                        attributes: ['email', 'accountType', 'accountStatus']
                    },
                    {
                        model: db.Hotel,
                        attributes: ['hotelName', 'address']
                    },
                    {
                        model: db.Role,
                        attributes: ['roleName', 'description']
                    }
                ]
            });
            
            return {
                EM: 'Tạo người dùng thành công',
                EC: 0,
                DT: user
            };
        } catch (error) {
            await transaction.rollback();
            console.error("Error in createUser service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Cập nhật thông tin người dùng
    updateUser: async (userId, userData) => {
        const transaction = await db.sequelize.transaction();
        
        try {
            const user = await db.User.findByPk(userId, {
                include: [
                    { model: db.Account }
                ]
            });
            
            if (!user) {
                await transaction.rollback();
                return {
                    EM: 'Không tìm thấy người dùng',
                    EC: 1,
                    DT: []
                };
            }
            
            // Kiểm tra email đã tồn tại chưa (nếu có thay đổi)
            if (userData.email && userData.email !== user.Account.email) {
                const existingEmail = await db.Account.findOne({
                    where: { email: userData.email }
                });
                
                if (existingEmail) {
                    await transaction.rollback();
                    return {
                        EM: 'Email đã tồn tại trong hệ thống',
                        EC: 1,
                        DT: []
                    };
                }
            }
            
            // Kiểm tra khách sạn có tồn tại không (nếu có thay đổi)
            if (userData.hotelId && userData.hotelId !== user.hotelId) {
                const hotel = await db.Hotel.findByPk(userData.hotelId);
                if (!hotel) {
                    await transaction.rollback();
                    return {
                        EM: 'Khách sạn không tồn tại',
                        EC: 1,
                        DT: []
                    };
                }
            }
            
            // Kiểm tra role có tồn tại không (nếu có thay đổi)
            if (userData.roleId && userData.roleId !== user.roleId) {
                const role = await db.Role.findByPk(userData.roleId);
                if (!role) {
                    await transaction.rollback();
                    return {
                        EM: 'Vai trò không tồn tại',
                        EC: 1,
                        DT: []
                    };
                }
            }
            
            // Cập nhật thông tin người dùng
            await user.update({
                hotelId: userData.hotelId !== undefined ? userData.hotelId : user.hotelId,
                roleId: userData.roleId !== undefined ? userData.roleId : user.roleId,
                userName: userData.userName !== undefined ? userData.userName : user.userName,
                fullName: userData.fullName !== undefined ? userData.fullName : user.fullName,
                userStatus: userData.userStatus !== undefined ? userData.userStatus : user.userStatus,
                updatedAt: new Date()
            }, { transaction });
            
            // Nếu có thay đổi email, cập nhật trong bảng Account
            if (userData.email && userData.email !== user.Account.email) {
                await db.Account.update(
                    { email: userData.email },
                    { 
                        where: { accountId: user.accountId },
                        transaction 
                    }
                );
            }
            
            await transaction.commit();
            
            // Lấy thông tin người dùng đã cập nhật với dữ liệu liên quan
            const updatedUser = await db.User.findByPk(userId, {
                include: [
                    {
                        model: db.Account,
                        attributes: ['email', 'accountType', 'accountStatus']
                    },
                    {
                        model: db.Hotel,
                        attributes: ['hotelName', 'address']
                    },
                    {
                        model: db.Role,
                        attributes: ['roleName', 'description']
                    }
                ]
            });
            
            return {
                EM: 'Cập nhật người dùng thành công',
                EC: 0,
                DT: updatedUser
            };
        } catch (error) {
            await transaction.rollback();
            console.error("Error in updateUser service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Xóa người dùng
    deleteUser: async (userId) => {
        const transaction = await db.sequelize.transaction();
        
        try {
            const user = await db.User.findByPk(userId, {
                include: [
                    { model: db.Account }
                ]
            });
            
            if (!user) {
                await transaction.rollback();
                return {
                    EM: 'Không tìm thấy người dùng',
                    EC: 1,
                    DT: []
                };
            }
            
            // Xóa người dùng và tài khoản liên quan
            await user.destroy({ transaction });
            await db.Account.destroy({
                where: { accountId: user.accountId },
                transaction
            });
            
            await transaction.commit();
            
            return {
                EM: 'Xóa người dùng thành công',
                EC: 0,
                DT: { userId }
            };
        } catch (error) {
            await transaction.rollback();
            console.error("Error in deleteUser service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Gán vai trò cho người dùng
    assignRoleToUser: async (userId, roleId) => {
        try {
            // Kiểm tra người dùng có tồn tại không
            const user = await db.User.findByPk(userId);
            if (!user) {
                return {
                    EM: 'Không tìm thấy người dùng',
                    EC: 1,
                    DT: []
                };
            }

            // Kiểm tra vai trò có tồn tại không
            const role = await db.Role.findByPk(roleId);
            if (!role) {
                return {
                    EM: 'Không tìm thấy vai trò',
                    EC: 2,
                    DT: []
                };
            }

            // Gán vai trò cho người dùng
            await user.update({ roleId });

            // Lấy thông tin người dùng đã cập nhật
            const updatedUser = await db.User.findByPk(userId, {
                include: [{
                    model: db.Role,
                    attributes: ['roleId', 'roleName', 'description']
                }]
            });

            return {
                EM: 'Gán vai trò cho người dùng thành công',
                EC: 0,
                DT: updatedUser
            };
        } catch (error) {
            console.error("Error in assignRoleToUser service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Lấy danh sách quyền của người dùng
    getUserPermissions: async (userId) => {
        try {
            // Kiểm tra người dùng có tồn tại không
            const user = await db.User.findByPk(userId, {
                include: [{
                    model: db.Role,
                    include: [{
                        model: db.Permission,
                        through: { attributes: [] } // Không lấy thông tin từ bảng trung gian
                    }]
                }]
            });

            if (!user) {
                return {
                    EM: 'Không tìm thấy người dùng',
                    EC: 1,
                    DT: []
                };
            }

            // Kiểm tra người dùng có vai trò không
            if (!user.Role) {
                return {
                    EM: 'Người dùng chưa được gán vai trò',
                    EC: 2,
                    DT: []
                };
            }

            return {
                EM: 'Lấy danh sách quyền của người dùng thành công',
                EC: 0,
                DT: {
                    userId: user.id,
                    userName: user.name,
                    role: {
                        roleId: user.Role.roleId,
                        roleName: user.Role.roleName
                    },
                    permissions: user.Role.Permissions
                }
            };
        } catch (error) {
            console.error("Error in getUserPermissions service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    }
};

export default userService; 