'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RoomAvailability', {
      roomAvailabilityId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      roomId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Room',
          key: 'roomId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      dateIn: {
        type: Sequelize.DATE,
        allowNull: false
      },
      dateOut: {
        type: Sequelize.DATE,
        allowNull: false
      },
      isAvailable: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      bookingId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'FactBooking',
          key: 'bookingId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true
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
    await queryInterface.dropTable('RoomAvailability');
  }
};