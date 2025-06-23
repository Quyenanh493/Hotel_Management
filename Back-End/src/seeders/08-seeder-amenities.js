'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('amenities', [
      {
        amenitiesName: 'Wi-Fi',
        description: 'High-speed wireless internet',
        price: 0.00,
        icon: 'wifi',
        amenitiesStatus: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        amenitiesName: 'Breakfast',
        description: 'Continental breakfast buffet',
        price: 150000.00,
        icon: 'coffee',
        amenitiesStatus: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        amenitiesName: 'Airport Transfer',
        description: 'Private car service to/from airport',
        price: 350000.00,
        icon: 'car',
        amenitiesStatus: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        amenitiesName: 'Spa Service',
        description: 'Full-service spa treatment',
        price: 500000.00,
        icon: 'spa',
        amenitiesStatus: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        amenitiesName: 'Laundry',
        description: 'Same-day laundry service',
        price: 200000.00,
        icon: 'laundry',
        amenitiesStatus: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        amenitiesName: 'Mini Bar',
        description: 'In-room mini bar with snacks and drinks',
        price: 250000.00,
        icon: 'minibar',
        amenitiesStatus: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        amenitiesName: 'Room Service',
        description: '24-hour room service',
        price: 50000.00,
        icon: 'room-service',
        amenitiesStatus: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        amenitiesName: 'Gym Access',
        description: 'Access to hotel fitness center',
        price: 100000.00,
        icon: 'gym',
        amenitiesStatus: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        amenitiesName: 'Swimming Pool',
        description: 'Access to hotel swimming pool',
        price: 100000.00,
        icon: 'pool',
        amenitiesStatus: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        amenitiesName: 'Extra Bed',
        description: 'Additional bed for room',
        price: 300000.00,
        icon: 'bed',
        amenitiesStatus: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('amenities', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true, 
    });
  }
};