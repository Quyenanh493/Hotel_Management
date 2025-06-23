'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RoomAmenities', {
      id: {
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
      amenitiesId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Amenities',
          key: 'amenitiesId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    await queryInterface.dropTable('RoomAmenities');
  }
};