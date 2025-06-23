import cloudinary from '../config/cloudinary';
import db from '../models/index';

/**
 * Tải lên hình ảnh với thư mục tùy chỉnh
 * @param {Buffer} fileBuffer - Buffer của tệp cần tải lên
 * @param {string} fileName - Tên tệp gốc
 * @param {string} type - Loại hình ảnh (customer, room, hotel, user, general, etc.)
 * @returns {Promise<string>} - URL tải xuống của tệp đã tải lên
 */
const uploadImageHM = async (fileBuffer, fileName, type = 'general') => {
  try {
    // Xác định thư mục dựa trên loại
    let folder = 'images';
    
    // Ánh xạ loại hình ảnh với thư mục tương ứng
    const folderMap = {
      'customer': 'customers',
      'room': 'rooms',
      'hotel': 'hotels',
      'user': 'users',
      'general': 'general'
    };
    
    // Sử dụng thư mục tương ứng nếu có, nếu không sử dụng 'general'
    folder = folderMap[type] || 'general';
    
    // Tải hình ảnh lên Cloudinary
    const downloadURL = await cloudinary.uploadImage(fileBuffer, fileName, folder);
    
    return downloadURL;
  } catch (error) {
    console.error(`Lỗi trong uploadImage (${type}):`, error);
    throw error;
  }
};

/**
 * Tải lên nhiều hình ảnh
 * @param {Array} fileBuffers - Mảng các buffer của tệp cần tải lên
 * @param {Array} fileNames - Mảng tên tệp gốc
 * @param {string} type - Loại hình ảnh
 * @returns {Promise<Array>} - Mảng URL tải xuống của các tệp đã tải lên
 */
const uploadMultipleImages = async (fileBuffers, fileNames, type = 'general') => {
  try {
    const uploadPromises = fileBuffers.map((buffer, index) => 
      uploadImageHM(buffer, fileNames[index], type)
    );
    
    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
  } catch (error) {
    console.error(`Lỗi trong uploadMultipleImages (${type}):`, error);
    throw error;
  }
};

// Giữ lại các hàm cũ để tương thích ngược (có thể xóa sau này)
const uploadCustomerImage = async (fileBuffer, fileName, customerId) => {
  try {
    const downloadURL = await uploadImageHM(fileBuffer, fileName, 'customer');
    
    // Cập nhật bản ghi khách hàng với URL hình ảnh nếu có ID
    if (customerId) {
      await db.Customer.update(
        { customerImage: downloadURL },
        { where: { customerId: customerId } }
      );
    }
    
    return downloadURL;
  } catch (error) {
    console.error('Lỗi trong uploadCustomerImage:', error);
    throw error;
  }
};


/**
 * Tải lên nhiều hình ảnh cho phòng
 * @param {Array} fileBuffers - Mảng buffer của các tệp ảnh
 * @param {Array} fileNames - Mảng tên tệp gốc
 * @param {number} roomId - ID phòng
 * @returns {Promise<Array>} - Mảng URL của các ảnh đã tải lên
 */
const uploadRoomImages = async (fileBuffers, fileNames, roomId) => {
  try {
    const imageUrls = await uploadMultipleImages(fileBuffers, fileNames, 'room');
    
    // Nếu có roomId, cập nhật ảnh vào database
    if (roomId && imageUrls.length > 0) {
      // Lấy danh sách ảnh hiện tại của phòng
      const currentRoom = await db.Room.findByPk(roomId);
      let existingImages = [];
      
      if (currentRoom && currentRoom.roomImages) {
        // Với DataTypes.JSON, Sequelize tự động parse thành array
        existingImages = Array.isArray(currentRoom.roomImages) ? currentRoom.roomImages : [];
      }
      
      // Kết hợp ảnh cũ và ảnh mới
      const allImages = [...existingImages, ...imageUrls];
      
      // Cập nhật database - Sequelize tự động stringify với DataTypes.JSON
      await db.Room.update(
        { 
          roomImage: allImages[0], // Ảnh đầu tiên làm ảnh chính
          roomImages: allImages    // Sequelize tự động convert array thành JSON
        },
        { where: { roomId: roomId } }
      );
    }
    
    return imageUrls;
  } catch (error) {
    console.error('Lỗi trong uploadRoomImages:', error);
    throw error;
  }
};

/**
 * Tải lên nhiều hình ảnh cho khách sạn
 * @param {Array} fileBuffers - Mảng buffer của các tệp ảnh
 * @param {Array} fileNames - Mảng tên tệp gốc
 * @param {number} hotelId - ID khách sạn
 * @returns {Promise<Array>} - Mảng URL của các ảnh đã tải lên
 */
const uploadHotelImages = async (fileBuffers, fileNames, hotelId) => {
  try {
    const imageUrls = await uploadMultipleImages(fileBuffers, fileNames, 'hotel');
    
    // Nếu có hotelId, cập nhật ảnh vào database
    if (hotelId && imageUrls.length > 0) {
      // Lấy danh sách ảnh hiện tại của khách sạn
      const currentHotel = await db.Hotel.findByPk(hotelId);
      let existingImages = [];
      
      if (currentHotel && currentHotel.hotelImages) {
        // Với DataTypes.JSON, Sequelize tự động parse thành array
        existingImages = Array.isArray(currentHotel.hotelImages) ? currentHotel.hotelImages : [];
      }
      
      // Kết hợp ảnh cũ và ảnh mới
      const allImages = [...existingImages, ...imageUrls];
      
      // Cập nhật database - Sequelize tự động stringify với DataTypes.JSON
      await db.Hotel.update(
        { 
          hotelImage: allImages[0], // Ảnh đầu tiên làm ảnh chính
          hotelImages: allImages    // Sequelize tự động convert array thành JSON
        },
        { where: { hotelId: hotelId } }
      );
    }
    
    return imageUrls;
  } catch (error) {
    console.error('Lỗi trong uploadHotelImages:', error);
    throw error;
  }
};

/**
 * Lấy tất cả ảnh của một phòng
 * @param {number} roomId - ID phòng
 * @returns {Promise<Array>} - Mảng URL ảnh của phòng
 */
const getRoomImages = async (roomId) => {
  try {
    const room = await db.Room.findByPk(roomId);
    if (!room) {
      throw new Error('Không tìm thấy phòng');
    }
    
    let images = [];
    if (room.roomImages) {
      // Với DataTypes.JSON, Sequelize tự động parse thành array
      images = Array.isArray(room.roomImages) ? room.roomImages : [];
    } else if (room.roomImage) {
      images = [room.roomImage];
    }
    
    return images;
  } catch (error) {
    console.error('Lỗi trong getRoomImages:', error);
    throw error;
  }
};

/**
 * Lấy tất cả ảnh của một khách sạn
 * @param {number} hotelId - ID khách sạn
 * @returns {Promise<Array>} - Mảng URL ảnh của khách sạn
 */
const getHotelImages = async (hotelId) => {
  try {
    const hotel = await db.Hotel.findByPk(hotelId);
    if (!hotel) {
      throw new Error('Không tìm thấy khách sạn');
    }
    
    let images = [];
    if (hotel.hotelImages) {
      // Với DataTypes.JSON, Sequelize tự động parse thành array
      images = Array.isArray(hotel.hotelImages) ? hotel.hotelImages : [];
    } else if (hotel.hotelImage) {
      images = [hotel.hotelImage];
    }
    
    return images;
  } catch (error) {
    console.error('Lỗi trong getHotelImages:', error);
    throw error;
  }
};

/**
 * Xóa ảnh cụ thể của phòng
 * @param {number} roomId - ID phòng
 * @param {string} imageUrl - URL ảnh cần xóa
 * @returns {Promise<boolean>} - Kết quả xóa
 */
const deleteRoomImage = async (roomId, imageUrl) => {
  try {
    const room = await db.Room.findByPk(roomId);
    if (!room) {
      throw new Error('Không tìm thấy phòng');
    }
    
    let images = [];
    if (room.roomImages) {
      // Với DataTypes.JSON, Sequelize tự động parse thành array
      images = Array.isArray(room.roomImages) ? room.roomImages : [];
    }
    
    // Lọc bỏ ảnh cần xóa
    images = images.filter(img => img !== imageUrl);
    
    // Cập nhật ảnh chính nếu ảnh bị xóa là ảnh chính
    let mainImage = room.roomImage;
    if (mainImage === imageUrl) {
      mainImage = images.length > 0 ? images[0] : null;
    }
    
    await db.Room.update(
      { 
        roomImage: mainImage,
        roomImages: images  // Sequelize tự động convert array thành JSON
      },
      { where: { roomId: roomId } }
    );
    
    return true;
  } catch (error) {
    console.error('Lỗi trong deleteRoomImage:', error);
    throw error;
  }
};

/**
 * Xóa ảnh cụ thể của khách sạn
 * @param {number} hotelId - ID khách sạn
 * @param {string} imageUrl - URL ảnh cần xóa
 * @returns {Promise<boolean>} - Kết quả xóa
 */
const deleteHotelImage = async (hotelId, imageUrl) => {
  try {
    const hotel = await db.Hotel.findByPk(hotelId);
    if (!hotel) {
      throw new Error('Không tìm thấy khách sạn');
    }
    
    let images = [];
    if (hotel.hotelImages) {
      // Với DataTypes.JSON, Sequelize tự động parse thành array
      images = Array.isArray(hotel.hotelImages) ? hotel.hotelImages : [];
    }
    
    // Lọc bỏ ảnh cần xóa
    images = images.filter(img => img !== imageUrl);
    
    // Cập nhật ảnh chính nếu ảnh bị xóa là ảnh chính
    let mainImage = hotel.hotelImage;
    if (mainImage === imageUrl) {
      mainImage = images.length > 0 ? images[0] : null;
    }
    
    await db.Hotel.update(
      { 
        hotelImage: mainImage,
        hotelImages: images  // Sequelize tự động convert array thành JSON
      },
      { where: { hotelId: hotelId } }
    );
    
    return true;
  } catch (error) {
    console.error('Lỗi trong deleteHotelImage:', error);
    throw error;
  }
};

export default {
  uploadImageHM,
  uploadMultipleImages,
  uploadCustomerImage,
  uploadRoomImages,
  uploadHotelImages,
  getRoomImages,
  getHotelImages,
  deleteRoomImage,
  deleteHotelImage
};