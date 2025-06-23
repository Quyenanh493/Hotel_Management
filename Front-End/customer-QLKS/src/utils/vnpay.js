/**
 * Các hàm tiện ích liên quan đến VNPay
 */

/**
 * Lấy thông tin mã ngân hàng VNPay từ mã
 * @param {string} bankCode Mã ngân hàng từ VNPay
 * @returns {Object} Thông tin ngân hàng
 */
export const getBankInfo = (bankCode) => {
  const bankList = {
    'VNPAYQR': { name: 'Thanh toán qua ứng dụng hỗ trợ VNPAYQR', logo: 'vnpay.png' },
    'VNBANK': { name: 'Thanh toán qua ATM-Tài khoản ngân hàng nội địa', logo: 'atm.png' },
    'INTCARD': { name: 'Thanh toán qua thẻ quốc tế', logo: 'intcard.png' },
    'VISA': { name: 'Thanh toán qua thẻ Visa', logo: 'visa.png' },
    'MASTERCARD': { name: 'Thanh toán qua thẻ Mastercard', logo: 'mastercard.png' },
    'JCB': { name: 'Thanh toán qua thẻ JCB', logo: 'jcb.png' },
    'UPI': { name: 'Thanh toán qua thẻ UnionPay', logo: 'upi.png' },
    'VCB': { name: 'Ngân hàng Vietcombank', logo: 'vietcombank.png' },
    'TCB': { name: 'Ngân hàng Techcombank', logo: 'techcombank.png' },
    'MB': { name: 'Ngân hàng Quân đội', logo: 'mbbank.png' },
    'VIB': { name: 'Ngân hàng Quốc tế', logo: 'vib.png' },
    'ICB': { name: 'Ngân hàng Công thương', logo: 'vietinbank.png' },
    'ACB': { name: 'Ngân hàng Á Châu', logo: 'acb.png' },
    'SCB': { name: 'Ngân hàng Sài Gòn', logo: 'scb.png' },
    'BIDV': { name: 'Ngân hàng BIDV', logo: 'bidv.png' },
    'TPB': { name: 'Ngân hàng Tiên Phong', logo: 'tpbank.png' },
    'VPB': { name: 'Ngân hàng VPBank', logo: 'vpbank.png' },
    'SACOMBANK': { name: 'Ngân hàng Sacombank', logo: 'sacombank.png' },
    'MBBANK': { name: 'Ngân hàng MBBank', logo: 'mbbank.png' },
    'AGRIBANK': { name: 'Ngân hàng Agribank', logo: 'agribank.png' },
    'MSB': { name: 'Ngân hàng Maritime Bank', logo: 'msb.png' },
    'SHB': { name: 'Ngân hàng SHB', logo: 'shb.png' }
  };

  return bankList[bankCode] || { name: `Ngân hàng ${bankCode}`, logo: 'default-bank.png' };
};

/**
 * Lấy thông tin loại thẻ VNPay từ mã
 * @param {string} cardType Mã loại thẻ từ VNPay
 * @returns {string} Tên loại thẻ
 */
export const getCardTypeName = (cardType) => {
  const cardTypes = {
    'ATM': 'Thẻ ATM nội địa',
    'QRCODE': 'QR Code',
    'IB': 'Internet Banking',
    'VNPAYQR': 'Ví VNPAY',
    'INTCARD': 'Thẻ quốc tế',
    'VISA': 'Thẻ Visa',
    'MASTERCARD': 'Thẻ Mastercard',
    'JCB': 'Thẻ JCB',
    'UPI': 'Thẻ UnionPay'
  };

  return cardTypes[cardType] || cardType;
};

/**
 * Định dạng tiền VND
 * @param {number} amount Số tiền
 * @returns {string} Chuỗi tiền định dạng
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

/**
 * Lấy trạng thái thanh toán đã định dạng
 * @param {string} status Trạng thái thanh toán
 * @returns {Object} Thông tin trạng thái
 */
export const getPaymentStatusInfo = (status) => {
  const statusMap = {
    'Pending': { text: 'Đang chờ thanh toán', color: 'orange' },
    'Paid': { text: 'Đã thanh toán', color: 'green' },
    'Failed': { text: 'Thanh toán thất bại', color: 'red' },
    'Cancelled': { text: 'Đã hủy', color: 'gray' },
    'Refunded': { text: 'Đã hoàn tiền', color: 'blue' }
  };

  return statusMap[status] || { text: status, color: 'default' };
};

export default {
  getBankInfo,
  getCardTypeName,
  formatCurrency,
  getPaymentStatusInfo
}; 