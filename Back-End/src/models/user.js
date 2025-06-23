'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Hotel, { foreignKey: 'hotelId' });
      User.belongsTo(models.Account, { foreignKey: 'accountId' });
      User.belongsTo(models.Role, { foreignKey: 'roleId' });
    }
  }
  User.init({
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    hotelId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Hotel',
        key: 'hotelId'
      }
    },
    accountId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Account',
        key: 'accountId'
      }
    },
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Role',
        key: 'roleId'
      }
    },
    userName: DataTypes.STRING,
    fullName: DataTypes.STRING,
    userStatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'User',
    freezeTableName: true
  });
  return User;
};