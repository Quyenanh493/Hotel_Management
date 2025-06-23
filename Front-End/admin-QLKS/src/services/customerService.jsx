import request from '../utils/request';

// Lấy tất cả khách hàng
export const getAllCustomers = async () => {
  try {
    const response = await request.get('customers');
    return response;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách khách hàng:', error);
    throw error;
  }
};

// Lấy khách hàng theo ID
export const getCustomerById = async (customerId) => {
  try {
    const response = await request.get(`customers/${customerId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin khách hàng ID ${customerId}:`, error);
    throw error;
  }
};

// Tạo khách hàng mới
export const createCustomer = async (customerData) => {
  try {
    const response = await request.post('customers', customerData);
    return response;
  } catch (error) {
    console.error('Lỗi khi tạo khách hàng mới:', error);
    throw error;
  }
};

// Cập nhật thông tin khách hàng
export const updateCustomer = async (customerId, customerData) => {
  try {
    const response = await request.put(`customers/${customerId}`, customerData);
    return response;
  } catch (error) {
    console.error(`Lỗi khi cập nhật khách hàng ID ${customerId}:`, error);
    throw error;
  }
};

// Xóa khách hàng
export const deleteCustomer = async (customerId) => {
  try {
    const response = await request.delete(`customers/${customerId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi xóa khách hàng ID ${customerId}:`, error);
    throw error;
  }
}; 