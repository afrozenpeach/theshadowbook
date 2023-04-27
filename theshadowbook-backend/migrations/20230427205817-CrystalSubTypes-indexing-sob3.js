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
    await queryInterface.removeIndex('CrystalChakra', 'crystalSubTypeChakra-idx');
    await queryInterface.removeIndex('CrystalCleansing', 'crystalSubTypeCleansing-idx');
    await queryInterface.removeIndex('CrystalDomain', 'crystalSubTypeDomain-idx');
    await queryInterface.removeIndex('CrystalElement', 'crystalSubTypeElement-idx');
    await queryInterface.removeIndex('CrystalMoonPhase', 'crystalSubTypeMoonPhase-idx');
    await queryInterface.removeIndex('CrystalZodiac', 'crystalSubTypeZodiac-idx');
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
