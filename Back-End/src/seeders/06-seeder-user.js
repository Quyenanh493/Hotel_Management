'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('user', [
      {
        hotelId: 1,
        accountId: 1,
        roleId: 1,
        userName: 'admin',
        fullName: 'System Administrator',
        userStatus: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelId: 1,
        accountId: 2,
        roleId: 2,
        userName: 'manager1',
        fullName: 'John Manager',
        userStatus: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelId: 1,
        accountId: 3,
        roleId: 3,
        userName: 'receptionist1',
        fullName: 'Sarah Receptionist',
        userStatus: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('user', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true, 
    });
  }
};