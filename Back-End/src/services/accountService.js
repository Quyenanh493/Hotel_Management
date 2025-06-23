import db from '../models/index';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';


const accountService = {
    // Lấy tất cả tài khoản
    getAllAccounts: async () => {
        try {
            const accounts = await db.Account.findAll({
                attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] }
            });
            
            return {
                EM: 'Lấy danh sách tài khoản thành công',
                EC: 0,
                DT: accounts
            };
        } catch (error) {
            console.error("Error in getAllAccounts service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Lấy tài khoản theo ID
    getAccountById: async (accountId) => {
        try {
            const account = await db.Account.findByPk(accountId, {
                attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] },
                include: [
                    { model: db.User, required: false },
                    { model: db.Customer, required: false }
                ]
            });
            
            if (!account) {
                return {
                    EM: 'Không tìm thấy tài khoản',
                    EC: 1,
                    DT: []
                };
            }
            
            return {
                EM: 'Lấy thông tin tài khoản thành công',
                EC: 0,
                DT: account
            };
        } catch (error) {
            console.error("Error in getAccountById service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Tạo tài khoản mới
    createAccount: async (accountData) => {
        const transaction = await db.sequelize.transaction();
        
        try {
            // Kiểm tra email đã tồn tại chưa
            const existingEmail = await db.Account.findOne({
                where: { email: accountData.email }
            });
            
            if (existingEmail) {
                await transaction.rollback();
                return {
                    EM: 'Email đã tồn tại trong hệ thống',
                    EC: 1,
                    DT: []
                };
            }
            
            // Hash mật khẩu
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(accountData.password, salt);
            
            // Tạo tài khoản mới
            const newAccount = await db.Account.create({
                email: accountData.email,
                password: hashedPassword,
                accountType: accountData.accountType || 'customer',
                accountStatus: accountData.accountStatus !== undefined ? accountData.accountStatus : true,
                lastLogin: null,
                resetPasswordToken: null,
                resetPasswordExpires: null,
                createdAt: new Date(),
                updatedAt: new Date()
            }, { transaction });
            
            await transaction.commit();
            
            // Loại bỏ mật khẩu và thông tin nhạy cảm khác
            const accountToReturn = {
                accountId: newAccount.accountId,
                email: newAccount.email,
                accountType: newAccount.accountType,
                accountStatus: newAccount.accountStatus,
                lastLogin: newAccount.lastLogin,
                createdAt: newAccount.createdAt,
                updatedAt: newAccount.updatedAt
            };
            
            return {
                EM: 'Tạo tài khoản thành công',
                EC: 0,
                DT: accountToReturn
            };
        } catch (error) {
            await transaction.rollback();
            console.error("Error in createAccount service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Cập nhật thông tin tài khoản
    updateAccount: async (accountId, accountData) => {
        const transaction = await db.sequelize.transaction();
        
        try {
            const account = await db.Account.findByPk(accountId);
            
            if (!account) {
                await transaction.rollback();
                return {
                    EM: 'Không tìm thấy tài khoản',
                    EC: 1,
                    DT: []
                };
            }
            
            // Kiểm tra email đã tồn tại chưa (nếu có thay đổi)
            if (accountData.email && accountData.email !== account.email) {
                const existingEmail = await db.Account.findOne({
                    where: { email: accountData.email }
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
            
            // Cập nhật thông tin tài khoản
            await account.update({
                email: accountData.email !== undefined ? accountData.email : account.email,
                accountType: accountData.accountType !== undefined ? accountData.accountType : account.accountType,
                accountStatus: accountData.accountStatus !== undefined ? accountData.accountStatus : account.accountStatus,
                updatedAt: new Date()
            }, { transaction });
            
            await transaction.commit();
            
            // Lấy thông tin tài khoản đã cập nhật
            const updatedAccount = await db.Account.findByPk(accountId, {
                attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] }
            });
            
            return {
                EM: 'Cập nhật tài khoản thành công',
                EC: 0,
                DT: updatedAccount
            };
        } catch (error) {
            await transaction.rollback();
            console.error("Error in updateAccount service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Xóa tài khoản
    deleteAccount: async (accountId) => {
        const transaction = await db.sequelize.transaction();
        
        try {
            const account = await db.Account.findByPk(accountId, {
                include: [
                    { model: db.User, required: false },
                    { model: db.Customer, required: false }
                ]
            });
            
            if (!account) {
                await transaction.rollback();
                return {
                    EM: 'Không tìm thấy tài khoản',
                    EC: 1,
                    DT: []
                };
            }
            
            // Kiểm tra và xóa thông tin người dùng nếu có
            if (account.User) {
                await account.User.destroy({ transaction });
            }
            
            // Kiểm tra và xóa thông tin khách hàng nếu có
            if (account.Customer) {
                await account.Customer.destroy({ transaction });
            }
            
            // Xóa tài khoản
            await account.destroy({ transaction });
            
            await transaction.commit();
            
            return {
                EM: 'Xóa tài khoản thành công',
                EC: 0,
                DT: { accountId }
            };
        } catch (error) {
            await transaction.rollback();
            console.error("Error in deleteAccount service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },
    
    // Thay đổi mật khẩu
    changePassword: async (accountId, currentPassword, newPassword) => {
        try {
            const account = await db.Account.findByPk(accountId);
            
            if (!account) {
                return {
                    EM: 'Không tìm thấy tài khoản',
                    EC: 1,
                    DT: []
                };
            }
            
            // Kiểm tra mật khẩu hiện tại
            const isPasswordValid = bcrypt.compareSync(currentPassword, account.password);
            if (!isPasswordValid) {
                return {
                    EM: 'Mật khẩu hiện tại không chính xác',
                    EC: 2,
                    DT: []
                };
            }
            
            // Hash mật khẩu mới
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(newPassword, salt);
            
            // Cập nhật mật khẩu
            await account.update({
                password: hashedPassword,
                updatedAt: new Date()
            });
            
            return {
                EM: 'Thay đổi mật khẩu thành công',
                EC: 0,
                DT: []
            };
        } catch (error) {
            console.error("Error in changePassword service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },
    
    // Reset mật khẩu
    resetPassword: async (email) => {
        try {
            const account = await db.Account.findOne({ where: { email } });
            
            if (!account) {
                return {
                    EM: 'Không tìm thấy tài khoản với email này',
                    EC: 1,
                    DT: []
                };
            }
            
            // Tạo token reset password
            const resetPasswordToken = crypto.randomBytes(20).toString('hex');
            const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 giờ
            
            // Cập nhật thông tin token
            await account.update({
                resetPasswordToken,
                resetPasswordExpires,
                updatedAt: new Date()
            });
            
            // Gửi email reset password
            // Đây là nơi bạn sẽ thêm logic gửi email
            // emailUtils.sendResetPasswordEmail(email, resetPasswordToken);
            
            return {
                EM: 'Gửi yêu cầu reset mật khẩu thành công. Vui lòng kiểm tra email của bạn.',
                EC: 0,
                DT: []
            };
        } catch (error) {
            console.error("Error in resetPassword service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    }
};

export default accountService; 