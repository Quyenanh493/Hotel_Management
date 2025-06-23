'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('roomavailability', [
      // Booking 1
      {
        roomId: 1,
        dateIn: new Date('2023-06-20'),
        dateOut: new Date('2023-06-22'),
        isAvailable: false,
        bookingId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomId: 2,
        dateIn: new Date('2023-06-20'),
        dateOut: new Date('2023-06-22'),
        isAvailable: false,
        bookingId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Booking 2
      {
        roomId: 3,
        dateIn: new Date('2023-07-25'),
        dateOut: new Date('2023-07-26'),
        isAvailable: false,
        bookingId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Booking 3
      {
        roomId: 4,
        dateIn: new Date('2023-08-10'),
        dateOut: new Date('2023-08-12'),
        isAvailable: false,
        bookingId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomId: 5,
        dateIn: new Date('2023-08-10'),
        dateOut: new Date('2023-08-12'),
        isAvailable: false,
        bookingId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Booking 4
      {
        roomId: 6,
        dateIn: new Date('2023-09-15'),
        dateOut: new Date('2023-09-17'),
        isAvailable: false,
        bookingId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomId: 7,
        dateIn: new Date('2023-09-15'),
        dateOut: new Date('2023-09-17'),
        isAvailable: false,
        bookingId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Booking 5
      {
        roomId: 1,
        dateIn: new Date('2023-10-20'),
        dateOut: new Date('2023-10-25'),
        isAvailable: false,
        bookingId: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Booking 6
      {
        roomId: 8,
        dateIn: new Date('2023-11-25'),
        dateOut: new Date('2023-11-26'),
        isAvailable: false,
        bookingId: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Booking 7
      {
        roomId: 9,
        dateIn: new Date('2023-12-30'),
        dateOut: new Date('2024-01-02'),
        isAvailable: false,
        bookingId: 7,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Booking 8
      {
        roomId: 2,
        dateIn: new Date('2024-01-10'),
        dateOut: new Date('2024-01-12'),
        isAvailable: false,
        bookingId: 8,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Booking 9
      {
        roomId: 4,
        dateIn: new Date('2024-02-15'),
        dateOut: new Date('2024-02-18'),
        isAvailable: false,
        bookingId: 9,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Booking 10
      {
        roomId: 6,
        dateIn: new Date('2024-03-20'),
        dateOut: new Date('2024-03-22'),
        isAvailable: false,
        bookingId: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('roomavailability', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true, 
    });
  }
};