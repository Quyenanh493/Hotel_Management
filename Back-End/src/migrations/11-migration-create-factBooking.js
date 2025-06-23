'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FactBooking', {
      bookingId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Customer',
          key: 'customerId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      hotelId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Hotel',
          key: 'hotelId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      dateIn: {
        type: Sequelize.DATE 
      },
      dateOut: {
        type: Sequelize.DATE 
      },
      orderDate: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('FactBooking');
  }
};