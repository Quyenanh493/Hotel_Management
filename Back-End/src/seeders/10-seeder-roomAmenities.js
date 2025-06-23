'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('roomamenities', [
      {
        roomID: 1,
        amenitiesId: 1, // Wi-Fi
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomID: 1,
        amenitiesId: 6, // Mini Bar
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomID: 1,
        amenitiesId: 7, // Room Service
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomID: 2,
        amenitiesId: 1, // Wi-Fi
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomID: 2,
        amenitiesId: 7, // Room Service
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomID: 3,
        amenitiesId: 1, // Wi-Fi
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomID: 3,
        amenitiesId: 6, // Mini Bar
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomID: 3,
        amenitiesId: 7, // Room Service
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomID: 3,
        amenitiesId: 8, // Gym Access
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomID: 3,
        amenitiesId: 9, // Swimming Pool
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomID: 4,
        amenitiesId: 1, // Wi-Fi
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomID: 4,
        amenitiesId: 6, // Mini Bar
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomID: 5,
        amenitiesId: 1, // Wi-Fi
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomID: 5,
        amenitiesId: 6, // Mini Bar
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomID: 5,
        amenitiesId: 9, // Swimming Pool
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('roomamenities', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true, 
    });
  }
};