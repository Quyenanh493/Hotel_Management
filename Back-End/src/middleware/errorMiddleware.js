// Middleware xử lý lỗi
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack);
  
  // Kiểm tra loại lỗi và trả về response phù hợp
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      EM: 'Dữ liệu không hợp lệ',
      EC: -1,
      DT: err.errors.map(e => e.message)
    });
  }
  
  // Lỗi mặc định
  return res.status(500).json({
    EM: 'Lỗi từ máy chủ',
    EC: -2,
    DT: process.env.NODE_ENV === 'production' ? null : err.message
  });
};

// Middleware xử lý route không tồn tại
const notFound = (req, res, next) => {
  const error = new Error(`Không tìm thấy - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export default {
  errorHandler,
  notFound
};