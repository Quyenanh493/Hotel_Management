import jwt from 'jsonwebtoken';
import db from '../models/index';
import dotenv from 'dotenv';
dotenv.config();

// Generate JWT token
const generateToken = (accountId, accountType) => {
  return jwt.sign(
    { accountId, accountType },
    process.env.JWT_SECRET || 'fallback-secret-key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// Generate refresh token
const generateRefreshToken = (accountId, accountType) => {
  return jwt.sign(
    { accountId, accountType },
    process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-key',
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
};

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies.jwt;

  if (!token) {
    return res.status(401).json({
      EM: 'Không có token xác thực',
      EC: -1,
      DT: ''
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    req.user = decoded; // decoded = { accountId, accountType }
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        EM: 'Token đã hết hạn',
        EC: -1,
        DT: ''
      });
    }

    return res.status(401).json({
      EM: 'Token không hợp lệ',
      EC: -1,
      DT: ''
    });
  }
};

// Refresh token function
const refreshToken = async (refreshToken) => {
  try {
    // Verify the refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-key'
    );

    // Find the account associated with the token
    const account = await db.Account.findOne({ where: { accountId: decoded.accountId } });

    if (!account) {
      return {
        EM: 'Người dùng không tồn tại',
        EC: -1,
        DT: ''
      };
    }

    // Check if account is active
    if (!account.accountStatus) {
      return {
        EM: 'Tài khoản đã bị vô hiệu hóa',
        EC: -1,
        DT: ''
      };
    }

    // Generate new tokens
    const newAccessToken = generateToken(account.accountId, account.accountType);
    const newRefreshToken = generateRefreshToken(account.accountId, account.accountType);

    return {
      EM: 'Làm mới token thành công',
      EC: 0,
      DT: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        accountId: account.accountId,
        accountType: account.accountType
      }
    };
  } catch (error) {
    console.error('Error refreshing token:', error);
    return {
      EM: 'Refresh token không hợp lệ hoặc đã hết hạn',
      EC: -1,
      DT: ''
    };
  }
};

// Check role middleware
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        EM: 'Không có quyền truy cập',
        EC: -1,
        DT: ''
      });
    }

    if (allowedRoles.includes(req.user.accountType)) {
      next();
    } else {
      return res.status(403).json({
        EM: 'Bạn không có quyền thực hiện hành động này',
        EC: -1,
        DT: ''
      });
    }
  };
};

export default {
  generateToken,
  generateRefreshToken,
  verifyToken,
  refreshToken,
  checkRole
};
