'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FactBookingDetail', {
      bookingDetailId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bookingId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'FactBooking',
          key: 'bookingId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      roomId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Room',
          key: 'roomId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      specialRequests: {
        type: Sequelize.TEXT
      },
      bookingStatus: {
        type: Sequelize.STRING
      },
      adultCount: {
        type: Sequelize.INTEGER
      },
      childrenCount: {
        type: Sequelize.INTEGER
      },
      roomCount: {
        type: Sequelize.INTEGER
      },
      totalAmount: {
        type: Sequelize.DECIMAL(10, 2)
      },
      specialRate: {
        type: Sequelize.DECIMAL(10, 2)
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
    await queryInterface.dropTable('FactBookingDetail');
  }
};