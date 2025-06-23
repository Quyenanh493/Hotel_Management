import request from '../utils/request';

// Lấy tất cả khách sạn
export const getAllHotels = async () => {
  try {
    const response = await request.get('/hotels');
    return response;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách khách sạn:', error);
    throw error;
  }
};

// Lấy khách sạn theo ID
export const getHotelById = async (hotelId) => {
  try {
    const response = await request.get(`/hotels/${hotelId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin khách sạn ID ${hotelId}:`, error);
    throw error;
  }
};

// Lấy danh sách thành phố
export const getCities = async () => {
  try {
    const response = await request.get('/hotels/cities');
    return response;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách thành phố:', error);
    throw error;
  }
};

// Lấy danh sách khách sạn theo thành phố
export const getHotelsByCity = async (city) => {
  try {
    const response = await request.get(`/hotels/city/${encodeURIComponent(city)}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi lấy khách sạn theo thành phố ${city}:`, error);
    throw error;
  }
};

// Tìm kiếm khách sạn có sẵn theo tiêu chí
export const searchAvailableHotels = async (searchCriteria) => {
  try {
    const response = await request.post('/hotels/search', searchCriteria);
    return response;
  } catch (error) {
    console.error('Lỗi khi tìm kiếm khách sạn có sẵn:', error);
    throw error;
  }
};

// Tìm kiếm khách sạn đơn giản (để debug)
export const searchAvailableHotelsSimple = async (searchCriteria) => {
  try {
    const response = await request.post('/hotels/search-simple', searchCriteria);
    return response;
  } catch (error) {
    console.error('Lỗi khi tìm kiếm khách sạn đơn giản:', error);
    throw error;
  }
};

export const getDefaultHotel = async () => {
  try {
    // Lấy khách sạn đầu tiên từ danh sách
    const response = await getAllHotels();
    if (response && response.EC === 0 && response.DT && response.DT.length > 0) {
      // Trả về khách sạn đầu tiên trong danh sách
      return {
        EC: 0,
        DT: response.DT[0],
        EM: 'Lấy thông tin khách sạn thành công'
      };
    } else {
      return {
        EC: 1,
        DT: null,
        EM: 'Không tìm thấy thông tin khách sạn'
      };
    }
  } catch (error) {
    console.error('Lỗi khi lấy thông tin khách sạn mặc định:', error);
    return {
      EC: -1,
      DT: null,
      EM: 'Lỗi từ server khi lấy thông tin khách sạn'
    };
  }
};
