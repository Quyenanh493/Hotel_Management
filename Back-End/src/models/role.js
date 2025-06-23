'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.hasMany(models.User, { foreignKey: 'roleId' });
      Role.belongsToMany(models.Permission, { 
        through: models.RolePermission,
        foreignKey: 'roleId',
        otherKey: 'permissionId'
      });
    }
  }
  Role.init({
    roleId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    roleName: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Role',
    tableName: 'Role',
    freezeTableName: true
  });
  return Role;
};