'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RoomAvailability extends Model {
    static associate(models) {
      RoomAvailability.belongsTo(models.Room, { foreignKey: 'roomId' });
      RoomAvailability.belongsTo(models.FactBooking, { foreignKey: 'bookingId' });
    }
  }
  
  RoomAvailability.init({
    roomAvailabilityId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    roomId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Room',
        key: 'roomId'
      }
    },
    dateIn: {
      type: DataTypes.DATE,
      allowNull: false
    },
    dateOut: {
      type: DataTypes.DATE,
      allowNull: false
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    bookingId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'FactBooking',
        key: 'bookingId'
      },
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'RoomAvailability',
    tableName: 'RoomAvailability',
    freezeTableName: true
  });
  
  return RoomAvailability;
};