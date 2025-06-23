import request from '../utils/request';

// Lấy tất cả đánh giá phòng
export const getAllRoomReviews = async () => {
  try {
    const response = await request.get('/room-reviews');
    return response;
  } catch (error) {
    console.error('Lỗi khi lấy tất cả đánh giá phòng:', error);
    throw error;
  }
};

// Lấy đánh giá phòng theo ID đánh giá
export const getRoomReviewById = async (reviewId) => {
  try {
    const response = await request.get(`/room-reviews/${reviewId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi lấy đánh giá phòng theo ID ${reviewId}:`, error);
    throw error;
  }
};

// Lấy đánh giá phòng theo ID phòng
export const getRoomReviewsByRoomId = async (roomId) => {
  try {
    const response = await request.get(`/room-reviews/room/${roomId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi lấy đánh giá phòng theo roomId ${roomId}:`, error);
    throw error;
  }
};

// Lấy đánh giá phòng theo ID khách sạn
export const getRoomReviewsByHotelId = async (hotelId) => {
  try {
    const response = await request.get(`/room-reviews/hotel/${hotelId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi lấy đánh giá phòng theo hotelId ${hotelId}:`, error);
    throw error;
  }
};

// Lấy đánh giá phòng theo ID khách hàng
export const getRoomReviewsByCustomerId = async (customerId) => {
  try {
    const response = await request.get(`/room-reviews/customer/${customerId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi lấy đánh giá phòng theo customerId ${customerId}:`, error);
    throw error;
  }
};

// Tạo đánh giá phòng mới
export const createRoomReview = async (reviewData) => {
  try {
    const response = await request.post('/room-reviews', reviewData);
    return response;
  } catch (error) {
    console.error('Lỗi khi tạo đánh giá phòng:', error);
    throw error;
  }
};

// Cập nhật đánh giá phòng
export const updateRoomReview = async (reviewId, reviewData) => {
  try {
    const response = await request.put(`/room-reviews/${reviewId}`, reviewData);
    return response;
  } catch (error) {
    console.error(`Lỗi khi cập nhật đánh giá phòng ID ${reviewId}:`, error);
    throw error;
  }
};

// Xóa đánh giá phòng
export const deleteRoomReview = async (reviewId) => {
  try {
    const response = await request.delete(`/room-reviews/${reviewId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi xóa đánh giá phòng ID ${reviewId}:`, error);
    throw error;
  }
};

// Kiểm tra xem khách hàng đã đánh giá phòng chưa
export const checkCustomerReviewed = async (customerId, roomId) => {
  try {
    console.log('Kiểm tra đánh giá với:', { customerId, roomId });
    
    // Đảm bảo customerId và roomId là số
    const customerIdNum = parseInt(customerId);
    const roomIdNum = parseInt(roomId);
    
    if (isNaN(customerIdNum) || isNaN(roomIdNum)) {
      console.error('checkCustomerReviewed: ID không hợp lệ', { customerId, roomId });
      return false;
    }
    
    const response = await request.get(`/room-reviews/customer/${customerIdNum}`);
    console.log('Kết quả API checkCustomerReviewed:', response);
    
    if (response && response.EC === 0 && response.DT) {
      // Đảm bảo so sánh dạng số
      const hasReviewed = response.DT.some(review => 
        parseInt(review.roomId) === roomIdNum
      );
      
      console.log(`Khách hàng ${customerIdNum} đã đánh giá phòng ${roomIdNum}: ${hasReviewed}`);
      return hasReviewed;
    }
    return false;
  } catch (error) {
    console.error(`Lỗi khi kiểm tra đánh giá của khách hàng:`, error);
    return false;
  }
}; 