'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('permission', [
      // Users resource
      {
        permissionName: 'create_user',
        resource: 'users',
        action: 'create',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        permissionName: 'read_user',
        resource: 'users',
        action: 'read',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        permissionName: 'update_user',
        resource: 'users',
        action: 'update',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        permissionName: 'delete_user',
        resource: 'users',
        action: 'delete',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Roles resource
      {
        permissionName: 'create_role',
        resource: 'roles',
        action: 'create',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        permissionName: 'read_role',
        resource: 'roles',
        action: 'read',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        permissionName: 'update_role',
        resource: 'roles',
        action: 'update',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        permissionName: 'delete_role',
        resource: 'roles',
        action: 'delete',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Bookings resource
      {
        permissionName: 'create_booking',
        resource: 'bookings',
        action: 'create',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        permissionName: 'read_booking',
        resource: 'bookings',
        action: 'read',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        permissionName: 'update_booking',
        resource: 'bookings',
        action: 'update',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        permissionName: 'delete_booking',
        resource: 'bookings',
        action: 'delete',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Rooms resource
      {
        permissionName: 'create_room',
        resource: 'rooms',
        action: 'create',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        permissionName: 'read_room',
        resource: 'rooms',
        action: 'read',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        permissionName: 'update_room',
        resource: 'rooms',
        action: 'update',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        permissionName: 'delete_room',
        resource: 'rooms',
        action: 'delete',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Amenities resource
      {
        permissionName: 'create_amenity',
        resource: 'amenities',
        action: 'create',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        permissionName: 'read_amenity',
        resource: 'amenities',
        action: 'read',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        permissionName: 'update_amenity',
        resource: 'amenities',
        action: 'update',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        permissionName: 'delete_amenity',
        resource: 'amenities',
        action: 'delete',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Reports resource
      {
        permissionName: 'read_report',
        resource: 'reports',
        action: 'read',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Payments resource
      {
        permissionName: 'create_payment',
        resource: 'payments',
        action: 'create',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        permissionName: 'read_payment',
        resource: 'payments',
        action: 'read',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        permissionName: 'update_payment',
        resource: 'payments',
        action: 'update',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        permissionName: 'delete_payment',
        resource: 'payments',
        action: 'delete',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Hotel resource
      {
        permissionName: 'read_hotel',
        resource: 'hotel',
        action: 'read',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        permissionName: 'update_hotel',
        resource: 'hotel',
        action: 'update',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Customers resource
      {
        permissionName: 'create_customer',
        resource: 'customers',
        action: 'create',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        permissionName: 'read_customer',
        resource: 'customers',
        action: 'read',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        permissionName: 'update_customer',
        resource: 'customers',
        action: 'update',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        permissionName: 'delete_customer',
        resource: 'customers',
        action: 'delete',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Maintenance resource
      {
        permissionName: 'create_maintenance',
        resource: 'maintenance',
        action: 'create',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        permissionName: 'read_maintenance',
        resource: 'maintenance',
        action: 'read',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        permissionName: 'update_maintenance',
        resource: 'maintenance',
        action: 'update',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        permissionName: 'delete_maintenance',
        resource: 'maintenance',
        action: 'delete',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('permission', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true, 
    });
  }
};