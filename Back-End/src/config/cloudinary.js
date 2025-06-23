import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});


const uploadImage = async (fileBuffer, fileName, folder = 'images') => {
  try {
    // Chuyển đổi buffer thành base64
    const base64String = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;
    
    // Tải lên Cloudinary
    const result = await cloudinary.uploader.upload(base64String, {
      folder: folder,
      resource_type: 'auto',
      public_id: `${Date.now()}_${fileName.split('.')[0]}` // Tạo tên file duy nhất
    });
    
    // Trả về URL
    return result.secure_url;
  } catch (error) {
    console.error('Lỗi khi tải hình ảnh lên Cloudinary:', error);
    throw new Error('Không thể tải lên hình ảnh');
  }
};

export default {
  uploadImage
};