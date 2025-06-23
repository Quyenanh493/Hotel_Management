'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = [
      'account',
      'amenities',
      'customer',
      'factbooking',
      'factbookingdetail',
      'factbookingdetailamenities',
      'hotel',
      'permission',
      'role',
      'rolepermission',
      'room',
      'roomamenities',
      'roomreview',
      'user'
    ];

    for (const table of tables) {
      await queryInterface.sequelize.query(`ALTER TABLE \`${table}\` AUTO_INCREMENT = 1`);
    }
  },

  async down(queryInterface, Sequelize) {
    // Không rollback
  }
};
