import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { deleteAllCookies } from "../../helper/cookie";

function Logout() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Xóa tất cả cookie
    deleteAllCookies();
    
    // Xóa thông tin người dùng từ localStorage
    localStorage.removeItem('admin');
    
    // Chuyển hướng về trang chủ
    navigate("/", { replace: true });
  }, [navigate]);
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Đang đăng xuất...</p>
    </div>
  );
}

export default Logout;