'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('role', [
      {
        roleName: 'Admin',
        description: 'System administrator with full access',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleName: 'Manager',
        description: 'Hotel manager with access to most features',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleName: 'Receptionist',
        description: 'Front desk staff handling check-ins and bookings',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleName: 'Housekeeping',
        description: 'Staff responsible for room maintenance',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('role', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true, 
    });
  }
};