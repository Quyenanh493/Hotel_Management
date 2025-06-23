'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('payment', [
      {
        bookingId: 1,
        amount: 2700000.00, // Tổng của các phòng trong booking 1
        paymentMethod: 'Credit Card',
        statusPayment: 'Paid',
        transactionCode: 'TRX001',
        paymentDate: new Date('2023-01-15'),
        bankCode: 'VCB',
        cardType: 'ATM',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingId: 2,
        amount: 2500000.00,
        paymentMethod: 'Cash',
        statusPayment: 'Paid',
        transactionCode: 'TRX002',
        paymentDate: new Date('2023-02-20'),
        bankCode: null,
        cardType: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingId: 3,
        amount: 4000000.00, // Tổng của các phòng trong booking 3
        paymentMethod: 'Bank Transfer',
        statusPayment: 'Paid',
        transactionCode: 'TRX003',
        paymentDate: new Date('2023-03-10'),
        bankCode: 'TCB',
        cardType: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingId: 4,
        amount: 3300000.00, // Tổng của các phòng trong booking 4
        paymentMethod: 'Credit Card',
        statusPayment: 'Paid',
        transactionCode: 'TRX004',
        paymentDate: new Date('2023-04-05'),
        bankCode: 'VCB',
        cardType: 'VISA',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingId: 5,
        amount: 5000000.00,
        paymentMethod: 'Credit Card',
        statusPayment: 'Paid',
        transactionCode: 'TRX005',
        paymentDate: new Date('2023-05-15'),
        bankCode: 'VCB',
        cardType: 'MASTER',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingId: 6,
        amount: 2800000.00,
        paymentMethod: 'Cash',
        statusPayment: 'Paid',
        transactionCode: 'TRX006',
        paymentDate: new Date('2023-06-20'),
        bankCode: null,
        cardType: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingId: 7,
        amount: 3800000.00,
        paymentMethod: 'Credit Card',
        statusPayment: 'Paid',
        transactionCode: 'TRX007',
        paymentDate: new Date('2023-07-10'),
        bankCode: 'TCB',
        cardType: 'VISA',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingId: 8,
        amount: 2400000.00,
        paymentMethod: 'Credit Card',
        statusPayment: 'Paid',
        transactionCode: 'TRX008',
        paymentDate: new Date('2023-08-05'),
        bankCode: 'VCB',
        cardType: 'VISA',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingId: 9,
        amount: 4400000.00,
        paymentMethod: 'Bank Transfer',
        statusPayment: 'Pending',
        transactionCode: 'TRX009',
        paymentDate: null,
        bankCode: null,
        cardType: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingId: 10,
        amount: 2600000.00,
        paymentMethod: 'Credit Card',
        statusPayment: 'Pending',
        transactionCode: 'TRX010',
        paymentDate: null,
        bankCode: null,
        cardType: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('payment', null, {});
  }
};