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

    return queryInterface.sequelize.transaction(async t => {
      await queryInterface.removeIndex('CrystalChakra', 'crystalSubType-idx');
      await queryInterface.removeIndex('CrystalCleansing', 'crystalSubType-idx');
      await queryInterface.removeIndex('CrystalDomain', 'crystalSubType-idx');
      await queryInterface.removeIndex('CrystalElement', 'crystalSubType-idx');
      await queryInterface.removeIndex('CrystalMoonPhase', 'crystalSubType-idx');
      await queryInterface.removeIndex('CrystalZodiac', 'crystalSubType-idx');
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
