'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      Payment.belongsTo(models.FactBooking, { foreignKey: 'bookingId' });
    }
  }
  
  Payment.init({
    paymentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    bookingId: {
      type: DataTypes.INTEGER,
      unique: true // Đảm bảo mối quan hệ 1:1
    },
    amount: DataTypes.DECIMAL(10, 2),
    paymentMethod: DataTypes.STRING,
    statusPayment: DataTypes.STRING,
    transactionCode: DataTypes.STRING,
    paymentDate: DataTypes.DATE,
    bankCode: DataTypes.STRING,
    cardType: DataTypes.STRING,
    refundAmount: DataTypes.DECIMAL(10, 2),
    refundDate: DataTypes.DATE,
    refundTransactionCode: DataTypes.STRING,
    vnp_TransactionNo: DataTypes.STRING // Mã giao dịch từ VNPay
  }, {
    sequelize,
    modelName: 'Payment',
    tableName: 'Payment'
  });
  
  return Payment;
};