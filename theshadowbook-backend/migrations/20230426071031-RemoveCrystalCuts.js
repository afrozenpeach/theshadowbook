'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    return queryInterface.removeConstraint('UserCrystal', 'UserCrystal-Cut')
      .then(() => {
        queryInterface.removeIndex('UserCrystal', 'UserCrystal-Cut_idx')
      }).then(() => {
        queryInterface.dropTable('Cut');
      }).then(() => {
        queryInterface.removeColumn('UserCrystal', 'cut');
      });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
