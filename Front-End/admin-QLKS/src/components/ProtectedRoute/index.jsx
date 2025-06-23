import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated, hasAdminAccess, getCurrentUser } from '../../services/authService';
import { message } from 'antd';
import { useEffect } from 'react';

/**
 * Bảo vệ các route yêu cầu xác thực và quyền admin/staff
 */
const ProtectedRoute = () => {
  const authenticated = isAuthenticated();
  const currentUser = getCurrentUser();
  
  useEffect(() => {
    if (!authenticated) {
      message.error('Vui lòng đăng nhập để truy cập.');
      return;
    }
    
    if (authenticated && currentUser && !hasAdminAccess(currentUser)) {
      message.error('Tài khoản của bạn không có quyền truy cập vào hệ thống quản trị.');
    }
  }, [authenticated, currentUser]);
  
  // Kiểm tra đã đăng nhập chưa
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Kiểm tra quyền admin/staff
  if (currentUser && !hasAdminAccess(currentUser)) {
    return <Navigate to="/login" replace />;
  }
  
  // Nếu đã đăng nhập và có quyền, hiển thị các routes con
  return <Outlet />;
};

export default ProtectedRoute; 