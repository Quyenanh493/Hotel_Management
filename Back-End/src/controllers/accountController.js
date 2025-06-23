import accountService from '../services/accountService';

const accountController = {
    // Lấy tất cả tài khoản
    getAllAccounts: async (req, res) => {
        try {
            const result = await accountService.getAllAccounts();
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in getAllAccounts controller:", error);
            return res.status(500).json({
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            });
        }
    },

    // Lấy tài khoản theo ID
    getAccountById: async (req, res) => {
        try {
            const accountId = req.params.id;
            const result = await accountService.getAccountById(accountId);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in getAccountById controller:", error);
            return res.status(500).json({
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            });
        }
    },

    // Tạo tài khoản mới
    createAccount: async (req, res) => {
        try {
            const accountData = req.body;
            const result = await accountService.createAccount(accountData);
            return res.status(201).json(result);
        } catch (error) {
            console.error("Error in createAccount controller:", error);
            return res.status(500).json({
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            });
        }
    },

    // Cập nhật thông tin tài khoản
    updateAccount: async (req, res) => {
        try {
            const accountId = req.params.id;
            const accountData = req.body;
            const result = await accountService.updateAccount(accountId, accountData);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in updateAccount controller:", error);
            return res.status(500).json({
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            });
        }
    },

    // Xóa tài khoản
    deleteAccount: async (req, res) => {
        try {
            const accountId = req.params.id;
            const result = await accountService.deleteAccount(accountId);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in deleteAccount controller:", error);
            return res.status(500).json({
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            });
        }
    },
    
    // Thay đổi mật khẩu
    changePassword: async (req, res) => {
        try {
            const { accountId, currentPassword, newPassword } = req.body;
            const result = await accountService.changePassword(accountId, currentPassword, newPassword);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in changePassword controller:", error);
            return res.status(500).json({
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            });
        }
    },
    
    // Reset mật khẩu
    resetPassword: async (req, res) => {
        try {
            const email = req.body.email;
            const result = await accountService.resetPassword(email);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in resetPassword controller:", error);
            return res.status(500).json({
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            });
        }
    }
};

export default accountController; 