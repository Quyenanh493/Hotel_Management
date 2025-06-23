import customerService from '../services/customerService';

const customerController = {
    // Lấy tất cả khách hàng
    getAllCustomers: async (req, res) => {
        try {
            const result = await customerService.getAllCustomers();
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in getAllCustomers controller:", error);
            return res.status(500).json({
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            });
        }
    },

    // Lấy khách hàng theo ID
    getCustomerById: async (req, res) => {
        try {
            const customerId = req.params.id;
            const result = await customerService.getCustomerById(customerId);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in getCustomerById controller:", error);
            return res.status(500).json({
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            });
        }
    },

    // Tạo khách hàng mới
    createCustomer: async (req, res) => {
        try {
            const customerData = req.body;
            const result = await customerService.createCustomer(customerData);
            return res.status(201).json(result);
        } catch (error) {
            console.error("Error in createCustomer controller:", error);
            return res.status(500).json({
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            });
        }
    },

    // Cập nhật thông tin khách hàng
    updateCustomer: async (req, res) => {
        try {
            const customerId = req.params.id;
            const customerData = req.body;
            const result = await customerService.updateCustomer(customerId, customerData);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in updateCustomer controller:", error);
            return res.status(500).json({
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            });
        }
    },

    // Xóa khách hàng
    deleteCustomer: async (req, res) => {
        try {
            const customerId = req.params.id;
            const result = await customerService.deleteCustomer(customerId);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in deleteCustomer controller:", error);
            return res.status(500).json({
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            });
        }
    }
};

export default customerController;