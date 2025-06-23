'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Hotel extends Model {
    static associate(models) {
      Hotel.hasMany(models.User, { foreignKey: 'hotelId' });
      Hotel.hasMany(models.Room, { foreignKey: 'hotelId' });
      Hotel.hasMany(models.FactBooking, { foreignKey: 'hotelId' });
    }
  }
  Hotel.init({
    hotelId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    hotelName: DataTypes.STRING,
    openDay: DataTypes.DATE,
    address: DataTypes.STRING,
    hotelStatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    hotelType: DataTypes.STRING,
    hotelImage: DataTypes.STRING,
    hotelImages: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    description: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Hotel',
    tableName: 'Hotel',
    freezeTableName: true
  });
  return Hotel;
};