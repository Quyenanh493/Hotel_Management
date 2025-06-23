import multer from 'multer';

// Cấu hình lưu trữ
const storage = multer.memoryStorage();

// Bộ lọc tệp để chỉ chấp nhận hình ảnh
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận tệp hình ảnh!'), false);
  }
};

// Cấu hình cài đặt tải lên
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Kích thước tệp tối đa 5MB
  },
  fileFilter: fileFilter
});

export default upload;