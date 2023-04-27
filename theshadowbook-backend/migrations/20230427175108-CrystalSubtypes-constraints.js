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
      await queryInterface.addIndex('CrystalChakra', ['crystalId', 'subType'], {
        name: 'crystalSubTypeChakra-idx',
        unique: true
      }, { transaction: t });
      await queryInterface.addIndex('CrystalCleansing', ['crystalId', 'subType'], {
        name: 'crystalSubTypeCleansing-idx',
        unique: true
      }, { transaction: t });
      await queryInterface.addIndex('CrystalDomain', ['crystalId', 'subType'], {
        name: 'crystalSubTypeDomain-idx',
        unique: true
      }, { transaction: t });
      await queryInterface.addIndex('CrystalElement', ['crystalId', 'subType'], {
        name: 'crystalSubTypeElement-idx',
        unique: true
      }, { transaction: t });
      await queryInterface.addIndex('CrystalMoonPhase', ['crystalId', 'subType'], {
        name: 'crystalSubTypeMoonPhase-idx',
        unique: true
      }, { transaction: t });
      await queryInterface.addIndex('CrystalZodiac', ['crystalId', 'subType'], {
        name: 'crystalSubTypeZodiac-idx',
        unique: true
      }, { transaction: t });
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.sequelize.transaction(async t => {
      await queryInterface.removeIndex('CrystalChakra', 'crystalSubTypeChakra');
      await queryInterface.removeIndex('CrystalCleansing', 'crystalCleansing');
      await queryInterface.removeIndex('CrystalDomain', 'crystalSubTypeDomain');
      await queryInterface.removeIndex('CrystalElement', 'crystalSubTypeElement');
      await queryInterface.removeIndex('CrystalMoonPhase', 'crystalSubTypeMoonPhase');
      await queryInterface.removeIndex('CrystalZodiac', 'crystalSubTypeZodiac');
      await queryInterface.addIndex('CrystalChakra', ['crystalId', 'subType'], {
        name: 'crystalSubType-idx',
        unique: true
      }, { transaction: t });
      await queryInterface.addIndex('CrystalCleansing', ['crystalId', 'subType'], {
        name: 'crystalSubType-idx',
        unique: true
      }, { transaction: t });
      await queryInterface.addIndex('CrystalDomain', ['crystalId', 'subType'], {
        name: 'crystalSubType-idx',
        unique: true
      }, { transaction: t });
      await queryInterface.addIndex('CrystalElement', ['crystalId', 'subType'], {
        name: 'crystalSubType-idx',
        unique: true
      }, { transaction: t });
      await queryInterface.addIndex('CrystalMoonPhase', ['crystalId', 'subType'], {
        name: 'crystalSubType-idx',
        unique: true
      }, { transaction: t });
      await queryInterface.addIndex('CrystalZodiac', ['crystalId', 'subType'], {
        name: 'crystalSubType-idx',
        unique: true
      }, { transaction: t });
    });
  }
};
