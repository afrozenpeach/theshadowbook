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

    return queryInterface.sequelize.transaction(t => {
      return queryInterface.removeConstraint('UserCrystal', 'UserCrystal-Cut',
        { transaction: t }
      ).then(() => {
        queryInterface.removeIndex('UserCrystal', 'UserCrystal-Cut_idx', {transaction: t})
      }).then(() => {
        queryInterface.dropTable('Cut', { transaction: t });
      }).then(() => {
        queryInterface.removeColumn('UserCrystal', 'cut', { transaction: t });
      });
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
