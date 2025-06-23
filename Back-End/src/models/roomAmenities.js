'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RoomAmenities extends Model {
    static associate(models) {
      RoomAmenities.belongsTo(models.Room, { foreignKey: 'roomId' });
      RoomAmenities.belongsTo(models.Amenities, { foreignKey: 'amenitiesId' });
    }
  }
  
  RoomAmenities.init({
    id: {
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
    amenitiesId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Amenities',
        key: 'amenitiesId'
      }
    }
  }, {
    sequelize,
    modelName: 'RoomAmenities',
    tableName: 'RoomAmenities',
    freezeTableName: true
  });
  
  return RoomAmenities;
};