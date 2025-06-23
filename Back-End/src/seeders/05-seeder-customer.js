'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('customer', [
      {
        accountId: 4,
        customerName: 'John Doe',
        phoneNumber: '0901234567',
        address: '123 Nguyễn Trãi, Quận 1, TP.HCM',
        birthday: new Date('1985-05-15'),
        idNumber: '079085123456',
        email: 'john.doe@example.com',
        customerNote: 'Prefers quiet rooms',
        customerImage: 'customer1.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        accountId: 5,
        customerName: 'Jane Smith',
        phoneNumber: '0912345678',
        address: '456 Lê Lợi, Quận 1, TP.HCM',
        birthday: new Date('1990-08-22'),
        idNumber: '079090234567',
        email: 'jane.smith@example.com',
        customerNote: 'Allergic to feather pillows',
        customerImage: 'customer2.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        accountId: 6,
        customerName: 'Robert Johnson',
        phoneNumber: '0923456789',
        address: '789 Trần Hưng Đạo, Quận 5, TP.HCM',
        birthday: new Date('1978-12-10'),
        idNumber: '079078345678',
        email: 'robert.johnson@example.com',
        customerNote: 'Business traveler, needs early check-in',
        customerImage: 'customer3.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        accountId: 7,
        customerName: 'Emily Wilson',
        phoneNumber: '0934567890',
        address: '101 Điện Biên Phủ, Quận 3, TP.HCM',
        birthday: new Date('1992-03-25'),
        idNumber: '079092456789',
        email: 'emily.wilson@example.com',
        customerNote: 'Prefers high floor rooms',
        customerImage: 'customer4.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        accountId: 8,
        customerName: 'Michael Brown',
        phoneNumber: '0945678901',
        address: '202 Võ Văn Tần, Quận 3, TP.HCM',
        birthday: new Date('1983-07-18'),
        idNumber: '079083567890',
        email: 'michael.brown@example.com',
        customerNote: 'Frequent guest, VIP treatment',
        customerImage: 'customer5.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        accountId: 9,
        customerName: 'Sarah Davis',
        phoneNumber: '0956789012',
        address: '303 Cách Mạng Tháng 8, Quận 10, TP.HCM',
        birthday: new Date('1995-11-30'),
        idNumber: '079095678901',
        email: 'sarah.davis@example.com',
        customerNote: 'Prefers rooms with bathtub',
        customerImage: 'customer6.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        accountId: 10,
        customerName: 'David Miller',
        phoneNumber: '0967890123',
        address: '404 Nguyễn Thị Minh Khai, Quận 1, TP.HCM',
        birthday: new Date('1980-02-14'),
        idNumber: '079080789012',
        email: 'david.miller@example.com',
        customerNote: 'Needs accessible room',
        customerImage: 'customer7.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        accountId: 1,
        customerName: 'Jennifer Taylor',
        phoneNumber: '0978901234',
        address: '505 Lý Tự Trọng, Quận 1, TP.HCM',
        birthday: new Date('1988-09-05'),
        idNumber: '079088890123',
        email: 'jennifer.taylor@example.com',
        customerNote: 'Prefers non-smoking rooms',
        customerImage: 'customer8.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        accountId: 2,
        customerName: 'William Anderson',
        phoneNumber: '0989012345',
        address: '606 Hai Bà Trưng, Quận 1, TP.HCM',
        birthday: new Date('1975-04-20'),
        idNumber: '079075901234',
        email: 'william.anderson@example.com',
        customerNote: 'Prefers rooms with city view',
        customerImage: 'customer9.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        accountId: 3,
        customerName: 'Elizabeth Thomas',
        phoneNumber: '0990123456',
        address: '707 Phạm Ngũ Lão, Quận 1, TP.HCM',
        birthday: new Date('1993-06-12'),
        idNumber: '079093012345',
        email: 'elizabeth.thomas@example.com',
        customerNote: 'Prefers king-size bed',
        customerImage: 'customer10.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('customer', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true, 
    });
  }
};