'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RolePermission extends Model {
    static associate(models) {
      // Đây là bảng liên kết, nên không cần định nghĩa thêm các mối quan hệ
    }
  }
  RolePermission.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Role',
        key: 'roleId'
      }
    },
    permissionId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Permission',
        key: 'permissionId'
      }
    }
  }, {
    sequelize,
    modelName: 'RolePermission',
    tableName: 'RolePermission',
    freezeTableName: true
  });
  return RolePermission;
};