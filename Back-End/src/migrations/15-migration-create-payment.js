'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Payment', {
      paymentId: {
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
        onDelete: 'CASCADE',
        unique: true 
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      paymentMethod: {
        type: Sequelize.STRING,
        allowNull: false
      },
      statusPayment: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Pending'
      },
      transactionCode: {
        type: Sequelize.STRING
      },
      paymentDate: {
        type: Sequelize.DATE
      },
      bankCode: {
        type: Sequelize.STRING
      },
      cardType: {
        type: Sequelize.STRING
      },
      refundAmount: {
        type: Sequelize.DECIMAL(10, 2)
      },
      refundDate: {
        type: Sequelize.DATE
      },
      refundTransactionCode: {
        type: Sequelize.STRING
      },
      vnp_TransactionNo: {
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Payment');
  }
};