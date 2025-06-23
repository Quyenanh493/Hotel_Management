import db from '../models/index';

// Check if user has a specific permission
const checkPermission = (resource, action) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.accountId) {
        return res.status(401).json({
          EM: 'Không có quyền truy cập',
          EC: -1,
          DT: ''
        });
      }

      // Get the account by account ID
      const account = await db.Account.findByPk(req.user.accountId);
      if (!account) {
        return res.status(401).json({
          EM: 'Tài khoản không tồn tại',
          EC: -1,
          DT: ''
        });
      }
      
      // Nếu là khách hàng và đang truy cập vào tài nguyên bookings
      if (account.accountType === 'customer' && resource === 'bookings') {
        // Kiểm tra khách hàng tồn tại
        const customer = await db.Customer.findOne({ 
          where: { accountId: account.accountId }
        });
        
        if (customer) {
          // Cho phép khách hàng tạo hoặc đọc các booking của họ
          if (action === 'create' || action === 'read') {
            // Lưu thông tin customer vào request để sử dụng sau này
            req.customerInfo = customer;
            return next();
          }
        } else {
          return res.status(401).json({
            EM: 'Không tìm thấy thông tin khách hàng',
            EC: -1,
            DT: ''
          });
        }
      }

      // For non-customers or other actions, check staff/admin permissions
      // Get the user record
      const user = await db.User.findOne({ 
        where: { accountId: account.accountId },
        include: [{
          model: db.Role,
          include: [{
            model: db.Permission,
            where: {
              resource: resource,
              action: action
            },
            required: false
          }]
        }]
      });

      if (!user) {
        return res.status(401).json({
          EM: 'Không tìm thấy thông tin người dùng',
          EC: -1,
          DT: ''
        });
      }

      // Kiểm tra người dùng có Role không
      if (!user.Role) {
        return res.status(403).json({
          EM: 'Người dùng không có vai trò',
          EC: -1,
          DT: ''
        });
      }

      // Kiểm tra Role có Permission phù hợp không
      const hasPermission = user.Role.Permissions && user.Role.Permissions.some(p => 
        p.resource === resource && p.action === action
      );

      if (hasPermission) {
        // Lưu thông tin người dùng vào request để sử dụng sau này
        req.staffInfo = user;
        next();
      } else {
        return res.status(403).json({
          EM: 'Bạn không có quyền thực hiện hành động này',
          EC: -1,
          DT: ''
        });
      }
    } catch (error) {
      console.error('Lỗi trong middleware kiểm tra quyền:', error);
      return res.status(500).json({
        EM: 'Lỗi hệ thống',
        EC: -1,
        DT: ''
      });
    }
  };
};

// Middleware definitions for common actions
const canCreate = (resource) => checkPermission(resource, 'create');
const canRead = (resource) => checkPermission(resource, 'read');
const canUpdate = (resource) => checkPermission(resource, 'update');
const canDelete = (resource) => checkPermission(resource, 'delete');

export default {
  checkPermission,
  canCreate,
  canRead,
  canUpdate,
  canDelete
}; 