import db from '../models/index';
import { VNPay } from 'vnpay';
import crypto from 'crypto';
import moment from 'moment';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Thông tin cấu hình VNPay
const vnpConfig = {
  tmnCode: process.env.TMN_CODE, // Mã website tại VNPay
  secureSecret: process.env.SECURE_SECRET, // Chuỗi bí mật
  vnpUrl: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html", // URL thanh toán VNPay
  returnUrl: "https://244d-59-153-225-189.ngrok-free.app/vnpay-return" // URL callback
};

// Thử khởi tạo lại đối tượng VNPay với cấu hình đúng
const vnpay = new VNPay({
  tmnCode: vnpConfig.tmnCode,
  secureSecret: vnpConfig.secureSecret,
  vnpUrl: vnpConfig.vnpUrl,
  returnUrl: vnpConfig.returnUrl,
  testMode: true, // Đảm bảo ở chế độ test/sandbox
  hashAlgorithm: 'SHA512', // VNPay sử dụng thuật toán SHA512 để tạo chữ ký
});

// Cấu hình email transporter
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  }
});

const paymentService = {
  // Tạo URL thanh toán VNPay
  createPaymentUrl: async (bookingId, ipAddr) => {
    try {
      console.log('=== BẮT ĐẦU TẠO URL THANH TOÁN VNPAY ===');
      console.log('bookingId:', bookingId);
      console.log('ipAddr:', ipAddr);
      
      // Kiểm tra booking có tồn tại không
      const booking = await db.FactBooking.findByPk(bookingId, {
        include: [
          {
            model: db.FactBookingDetail,
            required: true,
            include: [
              {
                model: db.Room
              },
              {
                model: db.FactBookingDetailAmenities,
                include: [
                  {
                    model: db.Amenities
                  }
                ]
              }
            ]
          },
          {
            model: db.Payment,
            required: false
          }
        ]
      });

      if (!booking) {
        console.log('Không tìm thấy đơn đặt phòng:', bookingId);
        return {
          EM: 'Không tìm thấy đơn đặt phòng',
          EC: 1,
          DT: []
        };
      }

      // Kiểm tra nếu đã có thanh toán thành công
      if (booking.Payment && booking.Payment.statusPayment === 'Paid') {
        console.log('Đơn đặt phòng đã được thanh toán trước đó:', bookingId);
        return {
          EM: 'Đơn đặt phòng này đã được thanh toán',
          EC: 1,
          DT: []
        };
      }

      // Tính tổng số tiền từ các chi tiết đặt phòng
      let totalAmount = 0;
      console.log('Chi tiết các khoản thanh toán:');
      
      // Lấy ra ngày nhận phòng và ngày trả phòng để tính số ngày
      const checkInDate = booking.dateIn ? moment(booking.dateIn) : null;
      const checkOutDate = booking.dateOut ? moment(booking.dateOut) : null;

      let daysCount = 1; // Mặc định 1 ngày
      if (checkInDate && checkOutDate && checkInDate.isValid() && checkOutDate.isValid()) {
        daysCount = checkOutDate.diff(checkInDate, 'days');
        if (daysCount <= 0) daysCount = 1; // Đảm bảo tối thiểu 1 ngày
      }

      console.log('Ngày nhận phòng:', checkInDate ? checkInDate.format('YYYY-MM-DD') : 'N/A');
      console.log('Ngày trả phòng:', checkOutDate ? checkOutDate.format('YYYY-MM-DD') : 'N/A');
      console.log('Số ngày đặt phòng:', daysCount);

      booking.FactBookingDetails.forEach((detail, index) => {
        // Lấy giá phòng và số lượng phòng
        const roomPrice = parseFloat(detail.Room?.price || detail.totalAmount || 0);
        const roomCount = parseInt(detail.roomCount || 1);
        
        // Tính tổng tiền phòng = giá phòng × số phòng × số ngày
        const roomCost = roomPrice * roomCount * daysCount;
        
        let totalAmenities = 0;
        
        // Tính tổng tiền tiện ích cho phòng này
        if (detail.FactBookingDetailAmenities && detail.FactBookingDetailAmenities.length > 0) {
          totalAmenities = detail.FactBookingDetailAmenities.reduce((sum, amenity) => {
            const amenityPrice = parseFloat(amenity.price || 0);
            const amenityQuantity = parseFloat(amenity.quantity || 0);
            return sum + (amenityPrice * amenityQuantity);
          }, 0);
        }
        
        // Tổng tiền tiện ích cho tất cả phòng = tiền tiện ích × số phòng
        const amenitiesCost = totalAmenities * daysCount;
        
        // Tổng tiền cho chi tiết đặt phòng này
        const detailTotal = roomCost + amenitiesCost;
        
        // Cộng dồn vào tổng số tiền
        totalAmount += detailTotal;
        
        // Log chi tiết tính toán
        console.log(`=== Chi tiết phòng ${index + 1} (ID: ${detail.roomId}) ===`);
        console.log(`- Giá phòng: ${roomPrice.toLocaleString()} VND`);
        console.log(`- Số phòng: ${roomCount}`);
        console.log(`- Số ngày: ${daysCount}`);
        console.log(`- Tổng tiền phòng (${roomPrice} × ${roomCount} × ${daysCount}): ${roomCost.toLocaleString()} VND`);
        console.log(`- Tổng tiền tiện ích: ${totalAmenities.toLocaleString()} VND × ${roomCount} = ${amenitiesCost.toLocaleString()} VND`);
        console.log(`- Tổng chi tiết này: ${detailTotal.toLocaleString()} VND`);
        
        // Nếu có chi tiết tiện ích, in ra chi tiết
        if (detail.FactBookingDetailAmenities && detail.FactBookingDetailAmenities.length > 0) {
          console.log('  Chi tiết các tiện ích:');
          detail.FactBookingDetailAmenities.forEach(amenity => {
            const amenityPrice = parseFloat(amenity.price || 0);
            const amenityQuantity = parseFloat(amenity.quantity || 0);
            const amenityTotal = amenityPrice * amenityQuantity;
            console.log(`  - ${amenity.Amenities?.amenitiesName || 'Unknown'}, Số lượng: ${amenityQuantity}, Giá: ${amenityPrice.toLocaleString()} VND, Thành tiền: ${amenityTotal.toLocaleString()} VND`);
          });
        }
      });
      
      console.log(`Tổng số tiền cần thanh toán: ${totalAmount.toLocaleString()} VND`);
      console.log(`Số ngày đặt phòng: ${daysCount}`);

      // Tạo thông tin thanh toán
      const date = new Date();
      const createDate = moment(date).format('yyyyMMddHHmmss');
      const orderId = `${moment(date).format('HHmmss')}-${bookingId}`;

      console.log('=== THÔNG SỐ THANH TOÁN VNPAY ===');
      console.log('createDate:', createDate);
      console.log('orderId:', orderId);
      console.log('vnpConfig:', JSON.stringify(vnpConfig, null, 2));
      
      // Kiểm tra định dạng số tiền
      const amountForVnpay = Math.round(totalAmount * 100);
      console.log('Số tiền gốc (totalAmount):', totalAmount);
      console.log('Số tiền cho VNPay (đã nhân 100):', amountForVnpay);
      console.log('Kiểm tra kiểu dữ liệu của số tiền:', typeof amountForVnpay);

      // Tạo đối tượng tham số đầy đủ để log
      const paymentParams = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TxnRef: orderId,
        vnp_IpAddr: ipAddr || '127.0.0.1',
        vnp_OrderInfo: `Thanh toan don hang #${bookingId}`,
        vnp_OrderType: 'billpayment',
        vnp_Amount: String(Math.round(totalAmount * 100)),
        vnp_Locale: 'vn',
        vnp_CurrCode: 'VND',
        vnp_CreateDate: createDate,
        vnp_ReturnUrl: vnpConfig.returnUrl
      };
      
      console.log('Tất cả tham số gửi đến VNPay:', JSON.stringify(paymentParams, null, 2));

      // Sử dụng thư viện vnpay để tạo URL thanh toán
      const paymentUrl = vnpay.buildPaymentUrl({
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TxnRef: orderId,
        vnp_IpAddr: ipAddr || '127.0.0.1',
        vnp_OrderInfo: `Thanh toan don hang #${bookingId}`,
        vnp_OrderType: 'billpayment',
        vnp_Amount: String(Math.round(totalAmount)),
        vnp_Locale: 'vn',
        vnp_CurrCode: 'VND',
        vnp_CreateDate: createDate,
        vnp_ReturnUrl: vnpConfig.returnUrl
      });

      console.log('Payment URL được tạo:', paymentUrl);

      // Lưu thông tin thanh toán vào database
      let payment = await db.Payment.findOne({ where: { bookingId } });
      
      if (!payment) {
        // Tạo mới nếu chưa có
        payment = await db.Payment.create({
          bookingId,
          amount: totalAmount,
          paymentMethod: 'VNPay',
          statusPayment: 'Pending',
          transactionCode: orderId,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log('Đã tạo bản ghi Payment mới:', payment.paymentId);
      } else {
        // Cập nhật nếu đã có
        await payment.update({
          amount: totalAmount,
          paymentMethod: 'VNPay',
          statusPayment: 'Pending',
          transactionCode: orderId,
          updatedAt: new Date()
        });
        console.log('Đã cập nhật bản ghi Payment:', payment.paymentId);
      }

      console.log('=== KẾT THÚC TẠO URL THANH TOÁN VNPAY ===');
      return {
        EM: 'Tạo URL thanh toán thành công',
        EC: 0,
        DT: { paymentUrl, transactionCode: orderId }
      };
    } catch (error) {
      console.error('=== LỖI KHI TẠO URL THANH TOÁN VNPAY ===', error);
      console.error('Chi tiết lỗi:', error.stack);
      return {
        EM: `Lỗi từ server: ${error.message}`,
        EC: -1,
        DT: []
      };
    }
  },

  // Xử lý kết quả thanh toán từ VNPay
  vnpayReturn: async (vnpParams) => {
    try {
      console.log('=== BẮT ĐẦU XỬ LÝ KẾT QUẢ THANH TOÁN VNPAY ===');
      console.log('Dữ liệu nhận được từ VNPay:', JSON.stringify(vnpParams, null, 2));
      
      // Sử dụng phương thức verifyReturnUrl của thư viện vnpay để xác thực URL trả về
      const verifyResult = vnpay.verifyReturnUrl(vnpParams);
      console.log('Kết quả xác thực từ thư viện:', JSON.stringify(verifyResult, null, 2));
      
      // Kiểm tra tính toàn vẹn dữ liệu
      if (!verifyResult.isVerified) {
        console.error('CHÚ Ý: Chữ ký không khớp, giao dịch có thể bị giả mạo!');
        return {
          EM: 'Lỗi xác thực chữ ký VNPay - Giao dịch không hợp lệ',
          EC: 97, // Mã lỗi 97 - Chữ ký không hợp lệ
          DT: []
        };
      }
      
      // Kiểm tra thành công hay thất bại
      if (!verifyResult.isSuccess) {
        console.log('Thanh toán thất bại, mã lỗi:', verifyResult.vnp_ResponseCode);
        
        // Lấy mã giao dịch
        const transactionCode = verifyResult.vnp_TxnRef;
        
        // Tìm thanh toán theo mã giao dịch
        const payment = await db.Payment.findOne({
          where: { transactionCode }
        });
        
        if (payment) {
          await payment.update({
            statusPayment: 'Failed',
            updatedAt: new Date()
          });
        }
        
        return {
          EM: 'Thanh toán thất bại',
          EC: 1,
          DT: { 
            errorCode: verifyResult.vnp_ResponseCode,
            message: getVnpayResponseMessage(verifyResult.vnp_ResponseCode)
          }
        };
      }
      
      // Nếu thanh toán thành công, cập nhật trạng thái và gửi email thông báo
      if (vnpParams.vnp_ResponseCode === '00') {
        const payment = await db.Payment.findOne({
          where: {
            transactionCode: vnpParams.vnp_TxnRef
          },
          include: [
            {
              model: db.FactBooking,
              include: [
                {
                  model: db.Customer
                },
                {
                  model: db.FactBookingDetail,
                  include: [
                    {
                      model: db.Room
                    },
                    {
                      model: db.FactBookingDetailAmenities,
                      include: [
                        {
                          model: db.Amenities
                        }
                      ]
                    }
                  ]
                },
                {
                  model: db.Hotel
                }
              ]
            }
          ]
        });

        if (!payment) {
          console.log('Không tìm thấy thông tin thanh toán cho mã giao dịch:', vnpParams.vnp_TxnRef);
          return {
            EM: 'Không tìm thấy thông tin thanh toán',
            EC: -1,
            DT: { errorCode: 'NOT_FOUND' }
          };
        }

        console.log('Thông tin thanh toán tìm thấy:', JSON.stringify(payment, null, 2));
        
        // Cập nhật thanh toán -> trạng thái đã thanh toán
        await payment.update({
          statusPayment: 'Paid',
          paymentDate: moment(verifyResult.vnp_PayDate, 'YYYYMMDDHHmmss').toDate(),
          bankCode: vnpParams.vnp_BankCode || '',
          cardType: vnpParams.vnp_CardType || '',
          vnp_TransactionNo: vnpParams.vnp_TransactionNo || ''
        });
        
        // Cập nhật trạng thái booking thành Confirmed
        if (payment.bookingId) {
          console.log('Cập nhật trạng thái booking thành Confirmed:', payment.bookingId);
          
          await db.FactBooking.update(
            { 
              statusBooking: 'Confirmed',
              updatedAt: new Date()
            },
            { where: { bookingId: payment.bookingId } }
          );
          
          await db.FactBookingDetail.update(
            { 
              statusBookingDetail: 'Confirmed',
              updatedAt: new Date()
            },
            { where: { bookingId: payment.bookingId } }
          );
          
          // Gửi email thông báo thanh toán thành công
          await sendPaymentConfirmationEmail(payment);
        }

        return {
          EM: 'Thanh toán thành công',
          EC: 0,
          DT: {
            orderId: payment.bookingId,
            amount: payment.amount,
            paymentDate: payment.paymentDate,
            bankCode: payment.bankCode,
            cardType: payment.cardType,
            transactionNo: payment.vnp_TransactionNo
          }
        };
      }
      
      return {
        EM: 'Thanh toán thất bại',
        EC: 1,
        DT: { 
          errorCode: verifyResult.vnp_ResponseCode,
          message: getVnpayResponseMessage(verifyResult.vnp_ResponseCode)
        }
      };
    } catch (error) {
      console.error('=== LỖI KHI XỬ LÝ KẾT QUẢ THANH TOÁN VNPAY ===', error);
      console.error('Chi tiết lỗi:', error.stack);
      return {
        EM: `Lỗi từ server: ${error.message}`,
        EC: -1,
        DT: []
      };
    }
  },

  // Lấy thông tin thanh toán theo bookingId
  getPaymentByBookingId: async (bookingId) => {
    try {
      const payment = await db.Payment.findOne({
        where: { bookingId },
        include: [
          {
            model: db.FactBooking,
            include: [
              {
                model: db.Customer,
                attributes: ['customerName', 'email', 'phoneNumber']
              },
              {
                model: db.FactBookingDetail,
                include: [
                  {
                    model: db.Room,
                    attributes: ['roomName', 'roomType', 'price']
                  }
                ]
              },
              {
                model: db.Hotel,
                attributes: ['hotelName', 'address']
              }
            ]
          }
        ]
      });

      if (!payment) {
        return {
          EM: 'Không tìm thấy thông tin thanh toán',
          EC: 1,
          DT: []
        };
      }

      return {
        EM: 'Lấy thông tin thanh toán thành công',
        EC: 0,
        DT: payment
      };
    } catch (error) {
      console.error('Lỗi khi lấy thông tin thanh toán:', error);
      return {
        EM: 'Lỗi từ server',
        EC: -1,
        DT: []
      };
    }
  },

  // Truy vấn kết quả giao dịch
  queryDr: async (transactionCode) => {
    try {
      // Tìm thanh toán theo mã giao dịch
      const payment = await db.Payment.findOne({
        where: { transactionCode },
        include: [{ model: db.FactBooking }]
      });

      if (!payment) {
        return {
          EM: 'Không tìm thấy thông tin thanh toán',
          EC: 1,
          DT: []
        };
      }

      // Format theo định dạng VNPay - sử dụng thời gian theo GMT+7
      const now = new Date();
      const transactionDate = payment.createdAt || now;
      
      // Generate a random request ID as required by VNPay
      const requestId = crypto.randomUUID().replace(/-/g, '');
      
      // Build query parameters as per documentation
      const queryParams = {
        vnp_RequestId: requestId,
        vnp_Version: '2.1.0',
        vnp_Command: 'querydr',
        vnp_TmnCode: vnpConfig.tmnCode,
        vnp_TxnRef: transactionCode,
        vnp_OrderInfo: `Truy van giao dich ${transactionCode}`,
        vnp_TransactionDate: moment(transactionDate).format('YYYYMMDDHHmmss'),
        vnp_CreateDate: moment(now).format('YYYYMMDDHHmmss'),
        vnp_IpAddr: '127.0.0.1'
      };

      console.log('Tham số truy vấn giao dịch:', JSON.stringify(queryParams, null, 2));

      // Thực hiện truy vấn thông qua thư viện
      const queryResult = await vnpay.queryDr(queryParams);
      console.log('Kết quả truy vấn từ VNPay:', JSON.stringify(queryResult, null, 2));
      
      if (queryResult.isSuccess) {
        // Kiểm tra tính toàn vẹn dữ liệu
        if (!queryResult.isVerified) {
          console.error('CHÚ Ý: Chữ ký không khớp, dữ liệu phản hồi có thể bị giả mạo!');
          return {
            EM: 'Lỗi xác thực chữ ký VNPay - Dữ liệu không hợp lệ',
            EC: 97,
            DT: []
          };
        }
        
        // Cập nhật thông tin thanh toán nếu có kết quả mới
        if (queryResult.vnp_ResponseCode === '00' && payment.statusPayment !== 'Paid') {
          await payment.update({
            statusPayment: 'Paid',
            paymentDate: moment(queryResult.vnp_PayDate, 'YYYYMMDDHHmmss').toDate(),
            bankCode: queryResult.vnp_BankCode,
            cardType: queryResult.vnp_CardType,
            vnp_TransactionNo: queryResult.vnp_TransactionNo,
            updatedAt: new Date()
          });
          
          // Cập nhật trạng thái đặt phòng
          if (payment.bookingId) {
            // Cập nhật trạng thái các chi tiết đặt phòng
            await db.FactBookingDetail.update(
              { bookingStatus: 'Confirmed' },
              { where: { bookingId: payment.bookingId } }
            );
            
            // Cập nhật trạng thái booking
            await db.FactBooking.update(
              { status: 'Confirmed' },
              { where: { bookingId: payment.bookingId } }
            );
          }
        }
        
        return {
          EM: 'Truy vấn giao dịch thành công',
          EC: 0,
          DT: {
            transactionCode,
            status: queryResult.vnp_ResponseCode === '00' ? 'Success' : 'Failed',
            responseCode: queryResult.vnp_ResponseCode,
            message: getVnpayResponseMessage(queryResult.vnp_ResponseCode),
            paymentDate: queryResult.vnp_PayDate ? moment(queryResult.vnp_PayDate, 'YYYYMMDDHHmmss').toDate() : null,
            amount: queryResult.vnp_Amount ? parseInt(queryResult.vnp_Amount) / 100 : payment.amount,
            orderInfo: queryResult.vnp_OrderInfo || '',
            bankCode: queryResult.vnp_BankCode || payment.bankCode || '',
            cardType: queryResult.vnp_CardType || payment.cardType || '',
            transactionNo: queryResult.vnp_TransactionNo || payment.vnp_TransactionNo || ''
          }
        };
      } else {
        return {
          EM: 'Truy vấn giao dịch thất bại',
          EC: 1,
          DT: {
            transactionCode,
            responseCode: queryResult.vnp_ResponseCode,
            message: getVnpayResponseMessage(queryResult.vnp_ResponseCode)
          }
        };
      }
    } catch (error) {
      console.error('Lỗi khi truy vấn kết quả giao dịch:', error);
      console.error('Chi tiết lỗi:', error.stack);
      return {
        EM: `Lỗi từ server: ${error.message}`,
        EC: -1,
        DT: []
      };
    }
  },

  // Hoàn tiền giao dịch
  refundTransaction: async (transactionCode, amount, message = 'Hoàn tiền') => {
    try {
      // Tìm thanh toán theo mã giao dịch
      const payment = await db.Payment.findOne({
        where: { transactionCode },
        include: [{ model: db.FactBooking }]
      });

      if (!payment) {
        return {
          EM: 'Không tìm thấy thông tin thanh toán',
          EC: 1,
          DT: []
        };
      }

      // Kiểm tra trạng thái thanh toán
      if (payment.statusPayment !== 'Paid') {
        return {
          EM: 'Giao dịch này không thể hoàn tiền vì chưa được thanh toán thành công',
          EC: 1,
          DT: []
        };
      }

      // Format theo định dạng VNPay
      const now = new Date();
      const createDate = moment(now).format('YYYYMMDDHHmmss');
      
      // Tạo mã giao dịch hoàn tiền
      const refundRequestId = crypto.randomUUID().replace(/-/g, '');
      const refundOrderId = `RF${moment(now).format('HHmmss')}`;
      
      // Số tiền hoàn, nếu không chỉ định sẽ hoàn toàn bộ
      const refundAmount = amount || payment.amount;
      
      // Sử dụng thư viện vnpay để tạo yêu cầu hoàn tiền
      const refundParams = {
        vnp_RequestId: refundRequestId,
        vnp_Version: '2.1.0',
        vnp_Command: 'refund',
        vnp_TmnCode: vnpConfig.tmnCode,
        vnp_TransactionType: '02', // Hoàn toàn phần (full refund)
        vnp_TxnRef: refundOrderId,
        vnp_Amount: Math.round(refundAmount * 100), // Số tiền * 100 (VNPay yêu cầu)
        vnp_OrderInfo: message || `Hoan tien giao dich ${transactionCode}`,
        vnp_TransactionNo: payment.vnp_TransactionNo, // Mã GD trả về từ VNPAY
        vnp_TransactionDate: payment.paymentDate ? moment(payment.paymentDate).format('YYYYMMDDHHmmss') : createDate,
        vnp_CreateDate: createDate,
        vnp_IpAddr: '127.0.0.1',
        vnp_CreateBy: 'System'
      };

      console.log('Tham số hoàn tiền:', JSON.stringify(refundParams, null, 2));

      // Thực hiện yêu cầu hoàn tiền
      const refundResult = await vnpay.refund(refundParams);
      console.log('Kết quả hoàn tiền từ VNPay:', JSON.stringify(refundResult, null, 2));
      
      if (refundResult.isSuccess) {
        // Kiểm tra tính toàn vẹn dữ liệu
        if (!refundResult.isVerified) {
          console.error('CHÚ Ý: Chữ ký không khớp, dữ liệu phản hồi có thể bị giả mạo!');
          return {
            EM: 'Lỗi xác thực chữ ký VNPay - Dữ liệu không hợp lệ',
            EC: 97,
            DT: []
          };
        }
        
        // Cập nhật thông tin thanh toán
        await payment.update({
          statusPayment: 'Refunded',
          refundAmount: refundAmount,
          refundDate: new Date(),
          refundTransactionCode: refundOrderId,
          updatedAt: new Date()
        });
        
        // Cập nhật trạng thái đặt phòng
        if (payment.bookingId) {
          // Cập nhật trạng thái các chi tiết đặt phòng
          await db.FactBookingDetail.update(
            { bookingStatus: 'Cancelled' },
            { where: { bookingId: payment.bookingId } }
          );
          
          // Cập nhật trạng thái booking
          await db.FactBooking.update(
            { status: 'Cancelled' },
            { where: { bookingId: payment.bookingId } }
          );
        }
        
        return {
          EM: 'Hoàn tiền thành công',
          EC: 0,
          DT: {
            transactionCode,
            refundOrderId,
            amount: refundAmount,
            responseCode: refundResult.vnp_ResponseCode,
            message: refundResult.message || getVnpayResponseMessage(refundResult.vnp_ResponseCode)
          }
        };
      } else {
        return {
          EM: 'Hoàn tiền thất bại',
          EC: 1,
          DT: {
            transactionCode,
            responseCode: refundResult.vnp_ResponseCode,
            message: refundResult.message || getVnpayResponseMessage(refundResult.vnp_ResponseCode)
          }
        };
      }
    } catch (error) {
      console.error('Lỗi khi hoàn tiền giao dịch:', error);
      console.error('Chi tiết lỗi:', error.stack);
      return {
        EM: `Lỗi từ server: ${error.message}`,
        EC: -1,
        DT: []
      };
    }
  },

  // Lấy tất cả các thanh toán
  getAllPayments: async () => {
    try {
      const payments = await db.Payment.findAll({
        include: [
          {
            model: db.FactBooking,
            include: [
              {
                model: db.Customer,
                attributes: ['customerName', 'email', 'phoneNumber']
              },
              {
                model: db.Hotel,
                attributes: ['hotelName']
              }
            ]
          }
        ],
        order: [['paymentId', 'DESC']]
      });

      return {
        EM: 'Lấy danh sách thanh toán thành công',
        EC: 0,
        DT: payments
      };
    } catch (error) {
      console.error('Lỗi khi lấy danh sách thanh toán:', error);
      return {
        EM: 'Lỗi từ server',
        EC: -1,
        DT: []
      };
    }
  }
};

// Hàm chuyển đổi mã phản hồi của VNPay thành thông báo dễ đọc
const getVnpayResponseMessage = (responseCode) => {
  const messages = {
    '00': 'Giao dịch thành công',
    '01': 'Giao dịch đã tồn tại',
    '02': 'Merchant không hợp lệ (kiểm tra lại vnp_TmnCode)',
    '03': 'Dữ liệu gửi sang không đúng định dạng',
    '04': 'Khởi tạo GD không thành công do Website đang bị tạm khóa',
    '05': 'Giao dịch không thành công do: Quý khách nhập sai mật khẩu thanh toán quá số lần quy định.',
    '06': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch',
    '07': 'Giao dịch bị nghi ngờ là gian lận',
    '08': 'Giao dịch không thành công do: Hệ thống Ngân hàng đang bảo trì.',
    '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ',
    '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
    '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán',
    '12': 'Giao dịch không thành công do: Thẻ/Tài khoản bị khóa',
    '13': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực',
    '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
    '51': 'Giao dịch không thành công do: Tài khoản không đủ số dư',
    '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày',
    '75': 'Ngân hàng thanh toán đang bảo trì',
    '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán nhiều lần',
    '97': 'Chữ ký không hợp lệ',
    '99': 'Các lỗi khác'
  };
  
  return messages[responseCode] || `Lỗi không xác định (Mã lỗi: ${responseCode})`;
};

// Helper function to get date in GMT+7 (Vietnam timezone)
const getDateInGMT7 = (date) => {
  const gmtPlus7 = new Date(date);
  gmtPlus7.setHours(gmtPlus7.getHours() + 7);
  return gmtPlus7;
};

// Hàm gửi email xác nhận thanh toán
const sendPaymentConfirmationEmail = async (payment) => {
  try {
    // Kiểm tra nếu không có thông tin booking hoặc khách hàng
    if (!payment.FactBooking || !payment.FactBooking.Customer) {
      console.log('Thiếu thông tin booking hoặc khách hàng để gửi email');
      return;
    }
    console.log("payment", payment)
    const booking = payment.FactBooking;
    const customer = booking.Customer;
    const hotel = booking.Hotel || { hotelName: 'Khách sạn của chúng tôi' };
    
    if (!customer.email) {
      console.log('Không có email khách hàng để gửi thông báo');
      return;
    }
    
    // Format payment date
    const paymentDate = payment.paymentDate 
      ? moment(payment.paymentDate).format('DD/MM/YYYY HH:mm:ss')
      : moment().format('DD/MM/YYYY HH:mm:ss');
    
    // Format check-in/check-out dates
    const checkInDate = booking.dateIn 
      ? moment(booking.dateIn).format('DD/MM/YYYY')
      : 'N/A';
    
    const checkOutDate = booking.dateOut
      ? moment(booking.dateOut).format('DD/MM/YYYY')
      : 'N/A';
    
    // Calculate number of days
    const daysCount = booking.dateIn && booking.dateOut
      ? moment(booking.dateOut).diff(moment(booking.dateIn), 'days')
      : 1;
    
    // Generate room details HTML
    let roomsHtml = '';
    if (booking.FactBookingDetails && booking.FactBookingDetails.length > 0) {
      booking.FactBookingDetails.forEach((detail, index) => {
        roomsHtml += `
          <div style="margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
            <h3 style="margin-top: 0; color: #333;">Phòng ${index + 1}</h3>
            <p><strong>Tên phòng:</strong> ${detail.Room?.roomName || 'N/A'}</p>
            <p><strong>Số lượng:</strong> ${detail.roomCount || 1}</p>
            <p><strong>Số người lớn:</strong> ${detail.adultCount || 0}</p>
            <p><strong>Số trẻ em:</strong> ${detail.childrenCount || 0}</p>
            <p><strong>Giá phòng:</strong> ${formatCurrency(detail.Room?.price || 0)} / đêm</p>
            
            ${detail.FactBookingDetailAmenities && detail.FactBookingDetailAmenities.length > 0 ? 
              `<div style="margin-top: 10px;">
                <strong>Tổng tiền tiện ích:</strong> 
                ${`<p>${formatCurrency(
                        detail.FactBookingDetailAmenities.reduce((total, amenity) => 
                          total + (amenity.price * amenity.quantity * daysCount), 0)
                      )}</p>`}
              </div>` : ''
            }
          </div>
        `;
      });
    } else {
      roomsHtml = '<p>Không có thông tin chi tiết phòng</p>';
    }
    
    // Tạo nội dung email
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-hotel-email@gmail.com',
      to: customer.email,
      subject: `LiveRoom Xác nhận thanh toán đơn đặt phòng`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #4CAF50;">THANH TOÁN THÀNH CÔNG</h1>
            <p style="font-size: 16px; color: #555;">Cảm ơn bạn đã đặt phòng của khách sạn ${hotel.hotelName} tại LiveRoom</p>
          </div>
          
          <div style="margin-bottom: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
            <h2 style="margin-top: 0; color: #333;">Thông tin đặt phòng</h2>
            <p><strong>Mã đơn hàng:</strong> #${booking.bookingId}</p>
            <p><strong>Ngày nhận phòng:</strong> ${checkInDate}</p>
            <p><strong>Ngày trả phòng:</strong> ${checkOutDate}</p>
            <p><strong>Số đêm:</strong> ${daysCount}</p>
            <p><strong>Trạng thái:</strong> <span style="color: #4CAF50; font-weight: bold;">Đã xác nhận</span></p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h2 style="color: #333;">Thông tin khách hàng</h2>
            <p><strong>Họ tên:</strong> ${customer.customerName || 'N/A'}</p>
            <p><strong>Email:</strong> ${customer.email}</p>
            <p><strong>Số điện thoại:</strong> ${customer.phoneNumber || 'N/A'}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h2 style="color: #333;">Chi tiết phòng</h2>
            ${roomsHtml}
          </div>
          
          <div style="margin-bottom: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
            <h2 style="margin-top: 0; color: #333;">Thông tin thanh toán</h2>
            <p><strong>Số tiền:</strong> ${formatCurrency(payment.amount || 0)}</p>
            <p><strong>Phương thức:</strong> VNPay</p>
            <p><strong>Thời gian:</strong> ${paymentDate}</p>
            <p><strong>Trạng thái:</strong> <span style="color: #4CAF50; font-weight: bold;">Đã thanh toán</span></p>
            ${payment.bankCode ? `<p><strong>Ngân hàng:</strong> ${payment.bankCode}</p>` : ''}
            ${payment.cardType ? `<p><strong>Loại thẻ:</strong> ${payment.cardType}</p>` : ''}
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #777;">Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi:</p>
            <p style="color: #777;">Email: support@${hotel.hotelName?.toLowerCase().replace(/\s+/g, '')}.com | Điện thoại: ${hotel.phoneNumber || '0123456789'}</p>
          </div>
        </div>
      `
    };
    
    // Gửi email
    const info = await emailTransporter.sendMail(mailOptions);
    console.log('Email xác nhận thanh toán đã được gửi:', info.response);
    
    return true;
  } catch (error) {
    console.error('Lỗi khi gửi email xác nhận thanh toán:', error);
    return false;
  }
};

// Hàm định dạng tiền tệ
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

export default paymentService;