import db from '../models/index';

const customerService = {
    // Lấy tất cả khách hàng
    getAllCustomers: async () => {
        try {
            const customers = await db.Customer.findAll({
                include: [
                    {
                        model: db.Account,
                        attributes: ['email', 'accountType', 'accountStatus']
                    }
                ]
            });
            
            return {
                EM: 'Lấy danh sách khách hàng thành công',
                EC: 0,
                DT: customers
            };
        } catch (error) {
            console.error("Error in getAllCustomers service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Lấy khách hàng theo ID
    getCustomerById: async (customerId) => {
        try {
            const customer = await db.Customer.findByPk(customerId, {
                include: [
                    {
                        model: db.Account,
                        attributes: ['email', 'accountType', 'accountStatus']
                    }
                ]
            });
            
            if (!customer) {
                return {
                    EM: 'Không tìm thấy khách hàng',
                    EC: 1,
                    DT: []
                };
            }
            
            return {
                EM: 'Lấy thông tin khách hàng thành công',
                EC: 0,
                DT: customer
            };
        } catch (error) {
            console.error("Error in getCustomerById service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Tạo khách hàng mới
    createCustomer: async (customerData) => {
        const transaction = await db.sequelize.transaction();
        
        try {
            // Kiểm tra email đã tồn tại chưa
            const existingEmail = await db.Account.findOne({
                where: { email: customerData.email }
            });
            
            if (existingEmail) {
                await transaction.rollback();
                return {
                    EM: 'Email đã tồn tại trong hệ thống',
                    EC: 1,
                    DT: []
                };
            }
            
            // Kiểm tra số điện thoại đã tồn tại chưa
            const existingPhone = await db.Customer.findOne({
                where: { phoneNumber: customerData.phoneNumber }
            });
            
            if (existingPhone) {
                await transaction.rollback();
                return {
                    EM: 'Số điện thoại đã tồn tại trong hệ thống',
                    EC: 1,
                    DT: []
                };
            }
            
            // Tạo tài khoản mới
            const newAccount = await db.Account.create({
                email: customerData.email,
                password: customerData.password || '123456', // Mật khẩu mặc định nếu không cung cấp
                accountType: 'customer',
                accountStatus: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }, { transaction });
            
            // Tạo khách hàng mới
            const newCustomer = await db.Customer.create({
                accountId: newAccount.accountId,
                customerName: customerData.customerName,
                phoneNumber: customerData.phoneNumber,
                address: customerData.address || '',
                birthday: customerData.birthday || null,
                idNumber: customerData.idNumber || '',
                email: customerData.email,
                customerNote: customerData.customerNote || '',
                customerImage: customerData.customerImage || '',
                createdAt: new Date(),
                updatedAt: new Date()
            }, { transaction });
            
            await transaction.commit();
            
            return {
                EM: 'Tạo khách hàng thành công',
                EC: 0,
                DT: newCustomer
            };
        } catch (error) {
            await transaction.rollback();
            console.error("Error in createCustomer service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Cập nhật thông tin khách hàng
    updateCustomer: async (customerId, customerData) => {
        const transaction = await db.sequelize.transaction();
        
        try {
            const customer = await db.Customer.findByPk(customerId);
            
            if (!customer) {
                await transaction.rollback();
                return {
                    EM: 'Không tìm thấy khách hàng',
                    EC: 1,
                    DT: []
                };
            }
            
            // Kiểm tra số điện thoại đã tồn tại chưa (nếu có thay đổi)
            if (customerData.phoneNumber && customerData.phoneNumber !== customer.phoneNumber) {
                const existingPhone = await db.Customer.findOne({
                    where: { phoneNumber: customerData.phoneNumber }
                });
                
                if (existingPhone) {
                    await transaction.rollback();
                    return {
                        EM: 'Số điện thoại đã tồn tại trong hệ thống',
                        EC: 1,
                        DT: []
                    };
                }
            }
            
            // Cập nhật thông tin khách hàng
            await customer.update({
                customerName: customerData.customerName !== undefined ? customerData.customerName : customer.customerName,
                phoneNumber: customerData.phoneNumber !== undefined ? customerData.phoneNumber : customer.phoneNumber,
                address: customerData.address !== undefined ? customerData.address : customer.address,
                birthday: customerData.birthday !== undefined ? customerData.birthday : customer.birthday,
                idNumber: customerData.idNumber !== undefined ? customerData.idNumber : customer.idNumber,
                email: customerData.email !== undefined ? customerData.email : customer.email,
                customerNote: customerData.customerNote !== undefined ? customerData.customerNote : customer.customerNote,
                customerImage: customerData.customerImage !== undefined ? customerData.customerImage : customer.customerImage,
                updatedAt: new Date()
            }, { transaction });
            
            // Nếu có thay đổi email, cập nhật trong bảng Account
            if (customerData.email && customerData.email !== customer.email) {
                await db.Account.update(
                    { email: customerData.email },
                    { 
                        where: { accountId: customer.accountId },
                        transaction 
                    }
                );
            }
            
            await transaction.commit();
            
            // Lấy thông tin khách hàng đã cập nhật
            const updatedCustomer = await db.Customer.findByPk(customerId, {
                include: [
                    {
                        model: db.Account,
                        attributes: ['email', 'accountType', 'accountStatus']
                    }
                ]
            });
            
            return {
                EM: 'Cập nhật thông tin khách hàng thành công',
                EC: 0,
                DT: updatedCustomer
            };
        } catch (error) {
            await transaction.rollback();
            console.error("Error in updateCustomer service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Xóa khách hàng
    deleteCustomer: async (customerId) => {
        const transaction = await db.sequelize.transaction();
        
        try {
            const customer = await db.Customer.findByPk(customerId);
            
            if (!customer) {
                await transaction.rollback();
                return {
                    EM: 'Không tìm thấy khách hàng',
                    EC: 1,
                    DT: []
                };
            }
            
            // Lấy accountId để xóa tài khoản sau
            const accountId = customer.accountId;
            
            // Xóa khách hàng
            await customer.destroy({ transaction });
            
            // Xóa tài khoản liên quan
            if (accountId) {
                await db.Account.destroy({
                    where: { accountId: accountId },
                    transaction
                });
            }
            
            await transaction.commit();
            
            return {
                EM: 'Xóa khách hàng thành công',
                EC: 0,
                DT: []
            };
        } catch (error) {
            await transaction.rollback();
            console.error("Error in deleteCustomer service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    }
};

export default customerService;