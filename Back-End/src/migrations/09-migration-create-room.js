'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Room', {
      roomId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      hotelId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Hotel',
          key: 'hotelId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      roomName: {
        type: Sequelize.STRING
      },
      roomType: {
        type: Sequelize.STRING
      },
      roomStatus: {
        type: Sequelize.STRING
      },
      maxCustomer: {
        type: Sequelize.INTEGER
      },
      maxRoom: {
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.DECIMAL(10, 2)
      },
      roomImage: {
        type: Sequelize.STRING
      },
      roomImages: {
        type: Sequelize.JSON
      },
      averageRating: {
        type: Sequelize.DECIMAL(3, 1),
        defaultValue: 0.0
      },
      totalReview: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      description: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('Room');
  }
};