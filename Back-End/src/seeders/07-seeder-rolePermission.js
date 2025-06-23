'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('rolepermission', [
      // Admin has all permissions (1-35)
      ...Array.from({ length: 35 }, (_, i) => ({
        roleId: 1, // Admin
        permissionId: i + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      })),

      // Manager permissions
      // User management (read only)
      {
        roleId: 2, // Manager
        permissionId: 2, // read_user
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Full booking management
      {
        roleId: 2, // Manager
        permissionId: 9, // create_booking
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2, // Manager
        permissionId: 10, // read_booking
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2, // Manager
        permissionId: 11, // update_booking
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2, // Manager
        permissionId: 12, // delete_booking
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Full room management
      {
        roleId: 2, // Manager
        permissionId: 13, // create_room
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2, // Manager
        permissionId: 14, // read_room
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2, // Manager
        permissionId: 15, // update_room
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2, // Manager
        permissionId: 16, // delete_room
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Full amenity management
      {
        roleId: 2, // Manager
        permissionId: 17, // create_amenity
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2, // Manager
        permissionId: 18, // read_amenity
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2, // Manager
        permissionId: 19, // update_amenity
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2, // Manager
        permissionId: 20, // delete_amenity
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Reports
      {
        roleId: 2, // Manager
        permissionId: 21, // read_report
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Full payment management
      {
        roleId: 2, // Manager
        permissionId: 22, // create_payment
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2, // Manager
        permissionId: 23, // read_payment
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2, // Manager
        permissionId: 24, // update_payment
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2, // Manager
        permissionId: 25, // delete_payment
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Hotel information (read only)
      {
        roleId: 2, // Manager
        permissionId: 26, // read_hotel
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Customer management
      {
        roleId: 2, // Manager
        permissionId: 28, // read_customer
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2, // Manager
        permissionId: 29, // update_customer
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Receptionist permissions
      // Booking management (create, read, update only)
      {
        roleId: 3, // Receptionist
        permissionId: 9, // create_booking
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 3, // Receptionist
        permissionId: 10, // read_booking
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 3, // Receptionist
        permissionId: 11, // update_booking
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Room information (read only)
      {
        roleId: 3, // Receptionist
        permissionId: 14, // read_room
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Amenity information (read only)
      {
        roleId: 3, // Receptionist
        permissionId: 18, // read_amenity
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Payment management (create, read, update)
      {
        roleId: 3, // Receptionist
        permissionId: 22, // create_payment
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 3, // Receptionist
        permissionId: 23, // read_payment
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 3, // Receptionist
        permissionId: 24, // update_payment
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Customer management (create, read, update)
      {
        roleId: 3, // Receptionist
        permissionId: 27, // create_customer
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 3, // Receptionist
        permissionId: 28, // read_customer
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 3, // Receptionist
        permissionId: 29, // update_customer
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Housekeeping permissions
      // Room info (read only)
      {
        roleId: 4, // Housekeeping
        permissionId: 14, // read_room
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Maintenance management
      {
        roleId: 4, // Housekeeping
        permissionId: 31, // create_maintenance
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 4, // Housekeeping
        permissionId: 32, // read_maintenance
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 4, // Housekeeping
        permissionId: 33, // update_maintenance
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('rolepermission', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true, 
    });
  }
};