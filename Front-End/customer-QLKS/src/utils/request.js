import axios from 'axios';
import { deleteCookie, getCookie, setCookie } from '../helper/cookie';

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

// Function để lấy token từ cookie một cách an toàn, đảm bảo không bị undefined
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
    // Lấy token từ cookie nếu có
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

// Làm mới token (sẽ được gọi khi nhận được lỗi 401)
const refreshToken = async () => {
  try {
    const refreshToken = getCookie('refreshToken');
    if (!refreshToken || refreshToken === 'undefined' || refreshToken === 'null') {
      console.warn('Refresh token không tồn tại hoặc không hợp lệ');
      return null;
    }
    
    const response = await axios.post('http://localhost:8080/api/v1/auth/refresh-token', {
      refreshToken: refreshToken
    });
    
    if (response.data && response.data.EC === 0 && response.data.DT) {
      const { accessToken, refreshToken: newRefreshToken } = response.data.DT;
      
      // Validate tokens before setting
      if (accessToken && typeof accessToken === 'string' && 
          newRefreshToken && typeof newRefreshToken === 'string') {
        // Lưu token mới vào cookie, đặt thời gian hết hạn
        setCookie('accessToken', accessToken, 1); // 1 ngày
        setCookie('refreshToken', newRefreshToken, 7); // 7 ngày
        return accessToken;
      } else {
        console.error('Invalid tokens received from refresh endpoint:', response.data.DT);
      }
    } else {
      console.warn('Unable to refresh token. Response:', response.data);
    }
    return null;
  } catch (error) {
    console.error('Lỗi khi làm mới token:', error);
    return null;
  }
};

// Bộ chặn response
request.interceptors.response.use(
  (response) => {
    // Xử lý các phản hồi thành công
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Nếu có phản hồi lỗi từ server
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
          const newToken = await refreshToken();
          
          if (newToken) {
            // Cập nhật token cho request hiện tại
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            
            // Thông báo cho các request khác rằng token đã được làm mới
            onRefreshed(newToken);
            
            // Đặt lại trạng thái refresh
            isRefreshing = false;
            
            // Thử lại request ban đầu
            return axios(originalRequest);
          } else {
            // Nếu không thể làm mới token, đặt lại trạng thái
            isRefreshing = false;
            console.warn('Không thể làm mới token, có thể phiên đăng nhập đã hết hạn');
            
            // KHÔNG xóa token ở đây để tránh gây ra vấn đề với các request khác
            // KHÔNG tự động chuyển hướng người dùng
            
            // Trả về lỗi để xử lý ở component
            return Promise.reject({
              ...error,
              customMessage: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại'
            });
          }
        } catch (refreshError) {
          isRefreshing = false;
          console.error('Lỗi khi làm mới token:', refreshError);
          
          // Trả về lỗi để xử lý ở component
          return Promise.reject({
            ...error, 
            customMessage: 'Không thể làm mới phiên đăng nhập'
          });
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default request;