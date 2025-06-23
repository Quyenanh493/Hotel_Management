/**
 * Script để dọn dẹp cookie cũ không có prefix
 * Chạy một lần để xóa các cookie cũ trước khi áp dụng hệ thống mới
 */

export const cleanupOldCookies = () => {
  // Xóa các cookie cũ không có prefix
  const cookiesToClean = ['accessToken', 'refreshToken'];
  
  cookiesToClean.forEach(cookieName => {
    // Xóa cookie với path=/
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    
    // Xóa cookie với domain hiện tại
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
    
    // Xóa cookie với domain .localhost (nếu đang test local)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.localhost;`;
    }
  });
  
  console.log('Đã dọn dẹp các cookie cũ của admin app');
};

// Auto run khi import
if (typeof window !== 'undefined') {
  cleanupOldCookies();
}