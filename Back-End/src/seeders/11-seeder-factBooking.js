'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('factbooking', [
      {
        customerId: 1,
        hotelId: 1,
        dateIn: new Date('2023-06-20'),
        dateOut: new Date('2023-06-22'),
        orderDate: new Date('2023-06-15'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        customerId: 2,
        hotelId: 1,
        dateIn: new Date('2023-07-25'),
        dateOut: new Date('2023-07-26'),
        orderDate: new Date('2023-07-20'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        customerId: 3,
        hotelId: 2,
        dateIn: new Date('2023-08-10'),
        dateOut: new Date('2023-08-12'),
        orderDate: new Date('2023-08-05'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        customerId: 4,
        hotelId: 3,
        dateIn: new Date('2023-09-15'),
        dateOut: new Date('2023-09-17'),
        orderDate: new Date('2023-09-10'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        customerId: 5,
        hotelId: 1,
        dateIn: new Date('2023-10-20'),
        dateOut: new Date('2023-10-25'),
        orderDate: new Date('2023-10-15'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        customerId: 6,
        hotelId: 4,
        dateIn: new Date('2023-11-25'),
        dateOut: new Date('2023-11-26'),
        orderDate: new Date('2023-11-20'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        customerId: 7,
        hotelId: 5,
        dateIn: new Date('2023-12-30'),
        dateOut: new Date('2024-01-02'),
        orderDate: new Date('2023-12-25'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        customerId: 8,
        hotelId: 1,
        dateIn: new Date('2024-01-10'),
        dateOut: new Date('2024-01-12'),
        orderDate: new Date('2024-01-05'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        customerId: 9,
        hotelId: 2,
        dateIn: new Date('2024-02-15'),
        dateOut: new Date('2024-02-18'),
        orderDate: new Date('2024-02-10'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        customerId: 10,
        hotelId: 3,
        dateIn: new Date('2024-03-20'),
        dateOut: new Date('2024-03-22'),
        orderDate: new Date('2024-03-15'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('factbooking', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true, 
    });
  }
};