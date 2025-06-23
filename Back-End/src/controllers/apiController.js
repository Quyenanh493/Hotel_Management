import logRegUserService from "../services/logRegCustomerService"
import authMiddleware from "../middleware/authMiddleware";

const handleRegister = async (req, res, next) => {
  try {
    console.log("Body received:", req.body);

    let data = await logRegUserService.registerNewUser(req.body);

    // If registration is successful, generate a token
    if (data.EC === 0 && data.DT) {
      // Generate token will be handled in the service
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    }

    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
    
  } catch (e) {
    console.error("Error in handleRegister:", e);
    next(e);
  }
};

const handleLogin = async (req, res, next) => {
  try {
    // Validation đã được xử lý bởi middleware
    let data = await logRegUserService.handleUserLogin(req.body);
    
    // Set tokens in HTTP-only cookies for better security
    if (data.EC === 0 && data.DT) {
      // Set access token
      if (data.DT.accessToken) {
        res.cookie('accessToken', data.DT.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
      }
      
      // Set refresh token
      if (data.DT.refreshToken) {
        res.cookie('refreshToken', data.DT.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
      }
    }
    
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (e) {
    console.error("Error in handleLogin:", e);
    next(e);
  }
};

// Refresh token handler
const handleRefreshToken = async (req, res, next) => {
  try {
    // Get refresh token from cookie or request body
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({
        EM: 'Refresh token không được cung cấp',
        EC: -1,
        DT: ''
      });
    }
    
    // Verify and generate new access token
    const result = await authMiddleware.refreshToken(refreshToken);
    
    if (result.EC === 0) {
      // Set new tokens in HTTP-only cookies
      res.cookie('accessToken', result.DT.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });
      
      res.cookie('refreshToken', result.DT.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      return res.status(200).json({
        EM: result.EM,
        EC: result.EC,
        DT: result.DT
      });
    }
    
    return res.status(401).json({
      EM: result.EM,
      EC: result.EC,
      DT: result.DT
    });
  } catch (e) {
    console.error("Error in handleRefreshToken:", e);
    return res.status(500).json({
      EM: 'Lỗi server khi xử lý refresh token',
      EC: -1,
      DT: ''
    });
  }
};

// Logout handler
const handleLogout = async (req, res, next) => {
  try {
    // Clear JWT cookie
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    
    return res.status(200).json({
      EM: 'Đăng xuất thành công',
      EC: 0,
      DT: ''
    });
  } catch (e) {
    console.error("Error in handleLogout:", e);
    next(e);
  }
};

module.exports = {
  handleRegister,
  handleLogin,
  handleRefreshToken,
  handleLogout
};