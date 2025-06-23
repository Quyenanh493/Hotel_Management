'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Hotel', {
      hotelId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      hotelName: {
        type: Sequelize.STRING
      },
      openDay: {
        type: Sequelize.DATE
      },
      address: {
        type: Sequelize.STRING
      },
      hotelStatus: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      hotelType: {
        type: Sequelize.STRING
      },
      hotelImage: {
        type: Sequelize.STRING
      },
      hotelImages: {
        type: Sequelize.JSON
      },
      description: {
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
    await queryInterface.dropTable('Hotel');
  }
};