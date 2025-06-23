'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FactBookingDetailAmenities extends Model {
    static associate(models) {
      FactBookingDetailAmenities.belongsTo(models.FactBookingDetail, { foreignKey: 'bookingDetailId' });
      FactBookingDetailAmenities.belongsTo(models.Amenities, { foreignKey: 'amenitiesId' });
    }
  }
  FactBookingDetailAmenities.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    bookingDetailId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'FactBookingDetail',
        key: 'bookingDetailId'
      }
    },
    amenitiesId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Amenities',
        key: 'amenitiesId'
      }
    },
    quantity: DataTypes.INTEGER,
    price: DataTypes.DECIMAL(10, 2)
  }, {
    sequelize,
    modelName: 'FactBookingDetailAmenities',
    tableName: 'FactBookingDetailAmenities',
    freezeTableName: true
  });
  return FactBookingDetailAmenities;
};