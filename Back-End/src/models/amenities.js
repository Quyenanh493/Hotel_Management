'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Amenities extends Model {
    static associate(models) {
      Amenities.belongsToMany(models.Room, {
        through: models.RoomAmenities, // Bảng trung gian
        foreignKey: 'amenitiesId',
        otherKey: 'roomId',
        as: 'Rooms', // Alias dùng trong include
      });
      // Thêm alias cho mối quan hệ hasMany
      Amenities.hasMany(models.RoomAmenities, { 
        foreignKey: 'amenitiesId',
        as: 'AmenitiesInRoom'  // Thêm alias riêng
      });
      Amenities.hasMany(models.FactBookingDetailAmenities, { foreignKey: 'amenitiesId' });
    }
  }
  
  Amenities.init({
    amenitiesId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    amenitiesName: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.DECIMAL(10, 2),
    icon: DataTypes.STRING,
    amenitiesStatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Amenities',
    tableName: 'Amenities',
    freezeTableName: true
  });
  
  return Amenities;
};