'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoomReview extends Model {
    static associate(models) {
      RoomReview.belongsTo(models.Room, { foreignKey: 'roomId' });
      RoomReview.belongsTo(models.Customer, { foreignKey: 'customerId' });
    }
  }
  RoomReview.init({
    reviewId: {
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
    customerId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Customer',
        key: 'customerId'
      }
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comment: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'RoomReview',
    tableName: 'RoomReview',
    freezeTableName: true
  });
  return RoomReview;
};
