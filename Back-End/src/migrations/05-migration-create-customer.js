'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Customer', {
      customerId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      accountId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Account',
          key: 'accountId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      customerName: {
        type: Sequelize.STRING
      },
      phoneNumber: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      birthday: {
        type: Sequelize.DATE
      },
      idNumber: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      customerNote: {
        type: Sequelize.STRING
      },
      customerImage: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Customer');
  }
};