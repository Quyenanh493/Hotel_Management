import paymentService from '../services/paymentService';

const paymentController = {
  // Tạo URL thanh toán VNPay
  createPaymentUrl: async (req, res, next) => {
    try {
      const { bookingId } = req.body;
      if (!bookingId) {
        return res.status(400).json({
          EM: 'Thiếu thông tin bookingId',
          EC: 1,
          DT: []
        });
      }
      
      const ipAddr = req.headers['x-forwarded-for'] || 
                     req.connection.remoteAddress || 
                     req.socket.remoteAddress || 
                     req.connection.socket.remoteAddress;
      console.log('IP Address being sent to VNPay:', ipAddr);
      const result = await paymentService.createPaymentUrl(bookingId, ipAddr);
      console.log('result', result);
      
      return res.status(result.EC === 0 ? 200 : 400).json({
        EM: result.EM,
        EC: result.EC,
        DT: result.DT
      });
    } catch (error) {
      console.error('Lỗi trong createPaymentUrl controller:', error);
      return res.status(500).json({
        EM: `Lỗi từ server: ${error.message}`,
        EC: -1,
        DT: []
      });
    }
  },
  
  // Xử lý kết quả thanh toán từ VNPay
  vnpayReturn: async (req, res, next) => {
    try {
      console.log('=== CONTROLLER: NHẬN KẾT QUẢ TỪ VNPAY ===');
      console.log('Headers:', JSON.stringify(req.headers, null, 2));
      console.log('Query params:', JSON.stringify(req.query, null, 2));
      console.log('Body:', JSON.stringify(req.body, null, 2));
      console.log('URL đầy đủ:', req.protocol + '://' + req.get('host') + req.originalUrl);
      
      // Sử dụng query params để nhận dữ liệu từ VNPay (VNPay sẽ gửi dữ liệu qua query string)
      const vnpParams = req.query;
      console.log('VNPay return received (params):', JSON.stringify(vnpParams, null, 2));
      
      // Gọi service để xử lý
      const result = await paymentService.vnpayReturn(vnpParams);
      console.log('Kết quả xử lý từ service:', JSON.stringify(result, null, 2));
      
      // Nếu đây là API endpoint, trả về JSON response
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        console.log('Trả về JSON response');
        return res.status(result.EC === 0 ? 200 : 400).json({
          EM: result.EM,
          EC: result.EC,
          DT: result.DT
        });
      }
      
      // Nếu là request từ browser, chuyển hướng người dùng đến trang kết quả thanh toán
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      console.log('Frontend URL để redirect:', frontendUrl);
      
      if (result.EC === 0) {
        // Chuyển hướng đến trang thanh toán thành công với parameter
        const successUrl = `${frontendUrl}/payment/success?orderId=${result.DT.orderId}&amount=${result.DT.amount}`;
        console.log('Redirect đến URL thành công:', successUrl);
        return res.redirect(successUrl);
      } else {
        // Chuyển hướng đến trang thanh toán thất bại với message lỗi
        const errorMessage = encodeURIComponent(result.EM);
        const errorCode = result.DT && result.DT.errorCode ? result.DT.errorCode : 'unknown';
        const failedUrl = `${frontendUrl}/payment/failed?error=${errorMessage}&code=${errorCode}`;
        console.log('Redirect đến URL thất bại:', failedUrl);
        return res.redirect(failedUrl);
      }
    } catch (error) {
      console.error('=== LỖI TRONG CONTROLLER VNPAY_RETURN ===', error);
      console.error('Chi tiết lỗi:', error.stack);
      // Chuyển hướng đến trang lỗi nếu xảy ra exception
      const errorMessage = encodeURIComponent(`Lỗi xử lý thanh toán: ${error.message}`);
      const failedUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/failed?error=${errorMessage}`;
      console.log('Redirect đến URL lỗi:', failedUrl);
      return res.redirect(failedUrl);
    }
  },
  
  // Truy vấn kết quả giao dịch
  queryDr: async (req, res, next) => {
    try {
      const { transactionCode } = req.params;
      
      if (!transactionCode) {
        return res.status(400).json({
          EM: 'Thiếu mã giao dịch',
          EC: 1,
          DT: []
        });
      }
      
      const result = await paymentService.queryDr(transactionCode);
      
      return res.status(result.EC === 0 ? 200 : 400).json({
        EM: result.EM,
        EC: result.EC,
        DT: result.DT
      });
    } catch (error) {
      console.error('Lỗi trong queryDr controller:', error);
      return res.status(500).json({
        EM: `Lỗi từ server: ${error.message}`,
        EC: -1,
        DT: []
      });
    }
  },
  
  // Lấy thông tin thanh toán theo bookingId
  getPaymentByBookingId: async (req, res, next) => {
    try {
      const { bookingId } = req.params;
      
      if (!bookingId) {
        return res.status(400).json({
          EM: 'Thiếu thông tin bookingId',
          EC: 1,
          DT: []
        });
      }
      
      const result = await paymentService.getPaymentByBookingId(bookingId);
      
      return res.status(result.EC === 0 ? 200 : 400).json({
        EM: result.EM,
        EC: result.EC,
        DT: result.DT
      });
    } catch (error) {
      console.error('Lỗi trong getPaymentByBookingId controller:', error);
      return res.status(500).json({
        EM: `Lỗi từ server: ${error.message}`,
        EC: -1,
        DT: []
      });
    }
  },
  
  
  // Hoàn tiền giao dịch
  refundTransaction: async (req, res, next) => {
    try {
      const { transactionCode, amount, message } = req.body;
      
      if (!transactionCode) {
        return res.status(400).json({
          EM: 'Thiếu mã giao dịch',
          EC: 1,
          DT: []
        });
      }
      
      const result = await paymentService.refundTransaction(transactionCode, amount, message);
      
      return res.status(result.EC === 0 ? 200 : 400).json({
        EM: result.EM,
        EC: result.EC,
        DT: result.DT
      });
    } catch (error) {
      console.error('Lỗi trong refundTransaction controller:', error);
      return res.status(500).json({
        EM: `Lỗi từ server: ${error.message}`,
        EC: -1,
        DT: []
      });
    }
  },
  
  // Lấy tất cả các thanh toán
  getAllPayments: async (req, res, next) => {
    try {
      const result = await paymentService.getAllPayments();
      
      return res.status(result.EC === 0 ? 200 : 400).json({
        EM: result.EM,
        EC: result.EC,
        DT: result.DT
      });
    } catch (error) {
      console.error('Lỗi trong getAllPayments controller:', error);
      return res.status(500).json({
        EM: `Lỗi từ server: ${error.message}`,
        EC: -1,
        DT: []
      });
    }
  }
};

export default paymentController;