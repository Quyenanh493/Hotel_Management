'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Hash password for all accounts
    const hashedPassword = await bcrypt.hash('Password123', 10);

    return queryInterface.bulkInsert('account', [
      {
        email: 'admin@example.com',
        password: hashedPassword,
        accountType: 'admin',
        accountStatus: true,
        lastLogin: new Date(),
        resetPasswordToken: null,
        resetPasswordExpires: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'manager@example.com',
        password: hashedPassword,
        accountType: 'staff',
        accountStatus: true,
        lastLogin: new Date(),
        resetPasswordToken: null,
        resetPasswordExpires: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'receptionist@example.com',
        password: hashedPassword,
        accountType: 'staff',
        accountStatus: true,
        lastLogin: new Date(),
        resetPasswordToken: null,
        resetPasswordExpires: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'john.doe@example.com',
        password: hashedPassword,
        accountType: 'customer',
        accountStatus: true,
        lastLogin: new Date(),
        resetPasswordToken: null,
        resetPasswordExpires: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'jane.smith@example.com',
        password: hashedPassword,
        accountType: 'customer',
        accountStatus: true,
        lastLogin: new Date(),
        resetPasswordToken: null,
        resetPasswordExpires: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'robert.johnson@example.com',
        password: hashedPassword,
        accountType: 'customer',
        accountStatus: true,
        lastLogin: new Date(),
        resetPasswordToken: null,
        resetPasswordExpires: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'emily.wilson@example.com',
        password: hashedPassword,
        accountType: 'customer',
        accountStatus: true,
        lastLogin: new Date(),
        resetPasswordToken: null,
        resetPasswordExpires: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'michael.brown@example.com',
        password: hashedPassword,
        accountType: 'customer',
        accountStatus: true,
        lastLogin: new Date(),
        resetPasswordToken: null,
        resetPasswordExpires: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'sarah.davis@example.com',
        password: hashedPassword,
        accountType: 'customer',
        accountStatus: true,
        lastLogin: new Date(),
        resetPasswordToken: null,
        resetPasswordExpires: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'david.miller@example.com',
        password: hashedPassword,
        accountType: 'customer',
        accountStatus: true,
        lastLogin: new Date(),
        resetPasswordToken: null,
        resetPasswordExpires: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('account', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true, 
    });
  }
};