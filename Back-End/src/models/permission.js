'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    static associate(models) {
      Permission.belongsToMany(models.Role, { 
        through: models.RolePermission,
        foreignKey: 'permissionId',
        otherKey: 'roleId'
      });
    }
  }
  Permission.init({
    permissionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    permissionName: DataTypes.STRING,
    resource: DataTypes.STRING,
    action: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Permission',
    tableName: 'Permission',
    freezeTableName: true
  });
  return Permission;
};