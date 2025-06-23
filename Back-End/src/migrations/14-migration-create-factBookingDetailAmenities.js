'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FactBookingDetailAmenities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bookingDetailId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'FactBookingDetail',
          key: 'bookingDetailId'
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
      quantity: {
        type: Sequelize.INTEGER
      },
      price: {
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
    await queryInterface.dropTable('FactBookingDetailAmenities');
  }
};