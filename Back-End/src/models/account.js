'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    static associate(models) {
      Account.hasOne(models.User, { foreignKey: 'accountId' });
      Account.hasOne(models.Customer, { foreignKey: 'accountId' });
    }
  }
  Account.init({
    accountId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING,
    accountType: DataTypes.STRING,
    accountStatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    lastLogin: DataTypes.DATE,
    resetPasswordToken: DataTypes.STRING,
    resetPasswordExpires: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Account',
    tableName: 'Account',
    freezeTableName: true
  });
  return Account;
};