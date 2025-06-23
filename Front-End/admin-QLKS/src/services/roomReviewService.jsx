import request from '../utils/request';

// Lấy tất cả đánh giá phòng
export const getAllRoomReviews = async () => {
  try {
    const response = await request.get('room-reviews');
    return response;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đánh giá phòng:', error);
    throw error;
  }
};

// Lấy đánh giá phòng theo ID
export const getRoomReviewById = async (reviewId) => {
  try {
    const response = await request.get(`room-reviews/${reviewId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin đánh giá phòng ID ${reviewId}:`, error);
    throw error;
  }
};

// Lấy đánh giá phòng theo Room ID
export const getRoomReviewsByRoomId = async (roomId) => {
  try {
    const response = await request.get(`room-reviews/room/${roomId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi lấy danh sách đánh giá của phòng ${roomId}:`, error);
    throw error;
  }
};

// Lấy đánh giá phòng theo Customer ID
export const getRoomReviewsByCustomerId = async (customerId) => {
  try {
    const response = await request.get(`room-reviews/customer/${customerId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi lấy danh sách đánh giá của khách hàng ${customerId}:`, error);
    throw error;
  }
};

// Cập nhật trạng thái đánh giá phòng (ẩn/hiện)
export const updateRoomReviewStatus = async (reviewId, status) => {
  try {
    const response = await request.patch(`room-reviews/${reviewId}/status`, { status });
    return response;
  } catch (error) {
    console.error(`Lỗi khi cập nhật trạng thái đánh giá phòng ID ${reviewId}:`, error);
    throw error;
  }
};

// Xóa đánh giá phòng
export const deleteRoomReview = async (reviewId) => {
  try {
    const response = await request.delete(`room-reviews/${reviewId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi xóa đánh giá phòng ID ${reviewId}:`, error);
    throw error;
  }
}; 