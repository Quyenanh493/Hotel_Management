import { body, validationResult } from 'express-validator';

// Middleware xử lý kết quả validation
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      EM: 'Dữ liệu đầu vào không hợp lệ',
      EC: -1,
      DT: errors.array()
    });
  }
  next();
};

// Validation rules cho đăng ký
const validateRegister = [
  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  body('phone')
    .isMobilePhone('vi-VN')
    .withMessage('Số điện thoại không hợp lệ'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự')
    .matches(/\d/)
    .withMessage('Mật khẩu phải chứa ít nhất 1 số'),
  body('name')
    .optional()
    .isLength({ min: 2 })
    .withMessage('Tên phải có ít nhất 2 ký tự'),
  body('idNumber')
    .optional()
    .isLength({ min: 9, max: 12 })
    .withMessage('Số CMND/CCCD không hợp lệ'),
  body('birthday')
    .optional()
    .isDate()
    .withMessage('Ngày sinh không hợp lệ'),
  handleValidationErrors
];

// Validation rules cho đăng nhập
const validateLogin = [
  body('valueLogin')
    .notEmpty()
    .withMessage('Email hoặc số điện thoại không được để trống'),
  body('password')
    .notEmpty()
    .withMessage('Mật khẩu không được để trống'),
  handleValidationErrors
];

export default {
  validateRegister,
  validateLogin
};