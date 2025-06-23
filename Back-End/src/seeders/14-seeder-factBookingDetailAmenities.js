'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('factbookingdetailamenities', [
      {
        bookingDetailId: 1,
        amenitiesId: 2, // Breakfast
        quantity: 2,
        price: 150000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingDetailId: 1,
        amenitiesId: 3, // Airport Transfer
        quantity: 1,
        price: 350000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingDetailId: 2,
        amenitiesId: 2, // Breakfast
        quantity: 2,
        price: 150000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingDetailId: 3,
        amenitiesId: 2, // Breakfast
        quantity: 3,
        price: 150000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingDetailId: 3,
        amenitiesId: 4, // Spa Service
        quantity: 1,
        price: 500000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingDetailId: 4,
        amenitiesId: 2, // Breakfast
        quantity: 2,
        price: 150000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingDetailId: 5,
        amenitiesId: 2, // Breakfast
        quantity: 2,
        price: 150000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingDetailId: 5,
        amenitiesId: 9, // Swimming Pool
        quantity: 2,
        price: 100000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingDetailId: 6,
        amenitiesId: 2, // Breakfast
        quantity: 1,
        price: 150000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingDetailId: 7,
        amenitiesId: 2, // Breakfast
        quantity: 4,
        price: 150000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingDetailId: 7,
        amenitiesId: 10, // Extra Bed
        quantity: 1,
        price: 300000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingDetailId: 8,
        amenitiesId: 2, // Breakfast
        quantity: 2,
        price: 150000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingDetailId: 8,
        amenitiesId: 4, // Spa Service
        quantity: 2,
        price: 500000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingDetailId: 9,
        amenitiesId: 2, // Breakfast
        quantity: 2,
        price: 150000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingDetailId: 10,
        amenitiesId: 2, // Breakfast
        quantity: 2,
        price: 150000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('factbookingdetailamenities', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true, 
    });
  }
};