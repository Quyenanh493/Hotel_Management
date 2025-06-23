'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FactBooking extends Model {
    
    static associate(models) {
      FactBooking.belongsTo(models.Customer, { foreignKey: 'customerId' });
      FactBooking.belongsTo(models.Hotel, { foreignKey: 'hotelId' });
      FactBooking.hasMany(models.FactBookingDetail, { foreignKey: 'bookingId' });
      FactBooking.hasMany(models.RoomAvailability, { foreignKey: 'bookingId' });
      FactBooking.hasOne(models.Payment, { foreignKey: 'bookingId' });
    }
  }
  FactBooking.init({
    bookingId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customerId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Customer',
        key: 'customerId'
      }
    },
    hotelId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Hotel',
        key: 'hotelId'
      }
    },
    dateIn: DataTypes.DATE,
    dateOut: DataTypes.DATE,
    orderDate: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'FactBooking',
    tableName: 'FactBooking',
    freezeTableName: true
  });
  return FactBooking;
};