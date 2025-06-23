import axios from 'axios';
import { deleteCookie, getCookie, setCookie } from '../helper/cookie';
import { refreshToken } from '../services/authService';

// Tạo một instance Axios với cấu hình tùy chỉnh
const request = axios.create({
  baseURL: 'http://localhost:8080/api/v1/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Lưu các request đang chờ xử lý refresh token
let isRefreshing = false;
let refreshSubscribers = [];

// Function để thêm callback vào danh sách chờ
const subscribeTokenRefresh = (cb) => refreshSubscribers.push(cb);

// Function để thực thi tất cả các callback sau khi refresh token thành công
const onRefreshed = (token) => {
  refreshSubscribers.map(cb => cb(token));
  refreshSubscribers = [];
};

// Function để lấy token từ cookie một cách an toàn
const getAuthToken = () => {
  try {
    const token = getCookie('accessToken');
    if (!token || token === 'undefined' || token === 'null') {
      console.warn('Token không hợp lệ hoặc không tồn tại');
      return null;
    }
    return token;
  } catch (error) {
    console.error('Lỗi khi lấy token:', error);
    return null;
  }
};

// Bộ chặn request
request.interceptors.request.use(
  (config) => {
    // Lấy token từ cookie
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Bộ chặn response
request.interceptors.response.use(
  (response) => {
    // Xử lý phản hồi thành công
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response) {
      const { status } = error.response;
      console.error('Lỗi phản hồi:', error.response.data);
      
      // Nếu lỗi 401 và chưa thử refresh token
      if (status === 401 && !originalRequest._retry) {
        // Đánh dấu request hiện tại đã thử refresh token
        originalRequest._retry = true;
        
        // Nếu đang trong quá trình refresh token, thêm request vào hàng chờ
        if (isRefreshing) {
          return new Promise((resolve) => {
            subscribeTokenRefresh(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axios(originalRequest));
            });
          });
        }
        
        isRefreshing = true;
        
        try {
          // Thử làm mới token
          const response = await refreshToken();
          
          if (response && response.EC === 0 && response.DT && response.DT.accessToken) {
            const newToken = response.DT.accessToken;
            
            // Cập nhật token cho request hiện tại
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            
            // Thông báo cho các request khác rằng token đã được làm mới
            onRefreshed(newToken);
            
            // Đặt lại trạng thái refresh
            isRefreshing = false;
            
            // Thử lại request ban đầu
            return axios(originalRequest);
          } else {
            // Nếu không thể làm mới token
            isRefreshing = false;
            console.warn('Không thể làm mới token, phiên đăng nhập hết hạn');
            
            // Chuyển hướng người dùng đến trang đăng nhập
            window.location.href = '/login';
            return Promise.reject({
              ...error,
              customMessage: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại'
            });
          }
        } catch (refreshError) {
          isRefreshing = false;
          console.error('Lỗi khi làm mới token:', refreshError);
          
          // Chuyển hướng người dùng đến trang đăng nhập
          window.location.href = '/login';
          return Promise.reject({
            ...error, 
            customMessage: 'Không thể làm mới phiên đăng nhập'
          });
        }
      } else if (status === 403) {
        // Không có quyền truy cập
        console.error('Không có quyền truy cập');
      }
    } else if (error.request) {
      // Yêu cầu đã được thực hiện nhưng không nhận được phản hồi
      console.error('Lỗi yêu cầu:', error.request);
    } else {
      // Đã xảy ra lỗi khi thiết lập yêu cầu
      console.error('Lỗi:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default request;