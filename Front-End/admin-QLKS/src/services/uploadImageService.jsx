import request from '../utils/request';

export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    // Gọi API endpoint để tải lên Cloudinary
    const response = await request.post('upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.DT.imageUrl; // Giả sử backend trả về URL ảnh trong trường imageUrl
  } catch (error) {
    console.error('Lỗi tải lên ảnh:', error);
    throw error;
  }
};