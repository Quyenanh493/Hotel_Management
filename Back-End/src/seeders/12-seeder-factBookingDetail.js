'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('factbookingdetail', [
      {
        bookingId: 1,
        roomId: 1,
        specialRequests: 'Early check-in if possible',
        bookingStatus: 'Completed',
        adultCount: 2,
        childrenCount: 0,
        roomCount: 1,
        totalAmount: 1500000.00,
        specialRate: 1500000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingId: 1,
        roomId: 2,
        specialRequests: 'Extra pillows',
        bookingStatus: 'Completed',
        adultCount: 2,
        childrenCount: 0,
        roomCount: 1,
        totalAmount: 1200000.00,
        specialRate: 1200000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingId: 2,
        roomId: 3,
        specialRequests: 'Late check-out',
        bookingStatus: 'Completed',
        adultCount: 2,
        childrenCount: 1,
        roomCount: 1,
        totalAmount: 2500000.00,
        specialRate: 2500000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingId: 3,
        roomId: 4,
        specialRequests: 'Room with garden view',
        bookingStatus: 'Completed',
        adultCount: 2,
        childrenCount: 0,
        roomCount: 1,
        totalAmount: 1800000.00,
        specialRate: 1800000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingId: 3,
        roomId: 5,
        specialRequests: 'Room with ocean view',
        bookingStatus: 'Completed',
        adultCount: 2,
        childrenCount: 0,
        roomCount: 1,
        totalAmount: 2200000.00,
        specialRate: 2200000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingId: 4,
        roomId: 6,
        specialRequests: 'Quiet room',
        bookingStatus: 'Completed',
        adultCount: 1,
        childrenCount: 0,
        roomCount: 1,
        totalAmount: 1300000.00,
        specialRate: 1300000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingId: 4,
        roomId: 7,
        specialRequests: 'Extra beds for children',
        bookingStatus: 'Completed',
        adultCount: 2,
        childrenCount: 2,
        roomCount: 1,
        totalAmount: 2000000.00,
        specialRate: 2000000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingId: 5,
        roomId: 1,
        specialRequests: 'Daily room cleaning',
        bookingStatus: 'Completed',
        adultCount: 2,
        childrenCount: 0,
        roomCount: 1,
        totalAmount: 5000000.00,
        specialRate: 1500000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingId: 6,
        roomId: 8,
        specialRequests: 'Beach front room',
        bookingStatus: 'Completed',
        adultCount: 2,
        childrenCount: 0,
        roomCount: 1,
        totalAmount: 2800000.00,
        specialRate: 2800000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingId: 7,
        roomId: 9,
        specialRequests: 'Room with fireplace',
        bookingStatus: 'Completed',
        adultCount: 2,
        childrenCount: 0,
        roomCount: 1,
        totalAmount: 3800000.00,
        specialRate: 1900000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingId: 8,
        roomId: 2,
        specialRequests: 'High floor',
        bookingStatus: 'Confirmed',
        adultCount: 2,
        childrenCount: 0,
        roomCount: 1,
        totalAmount: 2400000.00,
        specialRate: 1200000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingId: 9,
        roomId: 4,
        specialRequests: 'Non-smoking room',
        bookingStatus: 'Confirmed',
        adultCount: 2,
        childrenCount: 0,
        roomCount: 1,
        totalAmount: 4400000.00,
        specialRate: 1800000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingId: 10,
        roomId: 6,
        specialRequests: 'Late check-in',
        bookingStatus: 'Pending',
        adultCount: 2,
        childrenCount: 0,
        roomCount: 1,
        totalAmount: 2600000.00,
        specialRate: 1300000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('factbookingdetail', null, {});
  }
};