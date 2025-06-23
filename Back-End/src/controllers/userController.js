import userService from '../services/userService';
import db from '../models';

const User = db.User;
const Role = db.Role;
const Permission = db.Permission;

const userController = {
    // Lấy tất cả người dùng
    getAllUsers: async (req, res) => {
        try {
            const result = await userService.getAllUsers();
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in getAllUsers controller:", error);
            return res.status(500).json({
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            });
        }
    },

    // Lấy người dùng theo ID
    getUserById: async (req, res) => {
        try {
            const userId = req.params.id;
            const result = await userService.getUserById(userId);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in getUserById controller:", error);
            return res.status(500).json({
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            });
        }
    },
    
    // Lấy người dùng theo hotelId
    getUsersByHotelId: async (req, res) => {
        try {
            const hotelId = req.params.hotelId;
            const result = await userService.getUsersByHotelId(hotelId);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in getUsersByHotelId controller:", error);
            return res.status(500).json({
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            });
        }
    },

    // Tạo người dùng mới
    createUser: async (req, res) => {
        try {
            const userData = req.body;
            const result = await userService.createUser(userData);
            return res.status(201).json(result);
        } catch (error) {
            console.error("Error in createUser controller:", error);
            return res.status(500).json({
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            });
        }
    },

    // Cập nhật thông tin người dùng
    updateUser: async (req, res) => {
        try {
            const userId = req.params.id;
            const userData = req.body;
            const result = await userService.updateUser(userId, userData);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in updateUser controller:", error);
            return res.status(500).json({
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            });
        }
    },

    // Xóa người dùng
    deleteUser: async (req, res) => {
        try {
            const userId = req.params.id;
            const result = await userService.deleteUser(userId);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in deleteUser controller:", error);
            return res.status(500).json({
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            });
        }
    },

    // Gán vai trò cho người dùng
    assignRoleToUser: async (req, res) => {
        try {
            const userId = req.params.id;
            const { roleId } = req.body;
            const result = await userService.assignRoleToUser(userId, roleId);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in assignRoleToUser controller:", error);
            return res.status(500).json({
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            });
        }
    },

    // Lấy danh sách quyền của người dùng
    getUserPermissions: async (req, res) => {
        try {
            const userId = req.params.id;
            const result = await userService.getUserPermissions(userId);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in getUserPermissions controller:", error);
            return res.status(500).json({
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            });
        }
    }
};

export default userController; 