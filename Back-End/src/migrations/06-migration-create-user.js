'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('User', {
      userId: {
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
        onDelete: 'SET NULL'
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
      roleId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Role',
          key: 'roleId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      userName: {
        type: Sequelize.STRING
      },
      fullName: {
        type: Sequelize.STRING
      },
      userStatus: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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
    await queryInterface.dropTable('User');
  }
};