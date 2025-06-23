'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FactBookingDetail extends Model {
    static associate(models) {
      FactBookingDetail.belongsTo(models.FactBooking, { foreignKey: 'bookingId' });
      FactBookingDetail.belongsTo(models.Room, { foreignKey: 'roomId' });
      FactBookingDetail.hasMany(models.FactBookingDetailAmenities, { foreignKey: 'bookingDetailId' });
    }
  }
  FactBookingDetail.init({
    bookingDetailId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bookingId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'FactBooking',
        key: 'bookingId'
      }
    },
    roomId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Room',
        key: 'roomId'
      }
    },
    specialRequests: DataTypes.TEXT,
    bookingStatus: DataTypes.STRING,
    adultCount: DataTypes.INTEGER,
    childrenCount: DataTypes.INTEGER,
    roomCount: DataTypes.INTEGER,
    totalAmount: DataTypes.DECIMAL(10, 2),
    specialRate: DataTypes.DECIMAL(10, 2)
  }, {
    sequelize,
    modelName: 'FactBookingDetail',
    tableName: 'FactBookingDetail',
    freezeTableName: true
  });
  return FactBookingDetail;
};