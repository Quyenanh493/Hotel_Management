'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    static associate(models) {
      Customer.belongsTo(models.Account, { foreignKey: 'accountId' });
      Customer.hasMany(models.FactBooking, { foreignKey: 'customerId' });
      Customer.hasMany(models.RoomReview, { foreignKey: 'customerId' });
    }
  }
  Customer.init({
    customerId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    accountId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Account',
        key: 'accountId'
      }
    },
    customerName: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    address: DataTypes.STRING,
    birthday: DataTypes.DATE,
    idNumber: DataTypes.STRING,
    email: DataTypes.STRING,
    customerNote: DataTypes.STRING,
    customerImage: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Customer',
    tableName: 'Customer',
    freezeTableName: true
  });
  return Customer;
};