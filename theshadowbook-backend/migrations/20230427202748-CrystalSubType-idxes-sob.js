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
      await queryInterface.removeConstraint('CrystalChakra', 'CrystalChakra-Crystal', { transaction: t });
      await queryInterface.removeIndex('CrystalChakra', 'crystal_chakra'), { transaction: t };
      await queryInterface.addConstraint('CrystalChakra', {
        name: "CrystalChakra-Crystal",
        type: 'foreign key',
        fields: ['crystalId'],
        references: {
          table: 'Crystal',
          field: 'id'
        }
      }, { transaction: t });
      await queryInterface.removeConstraint('CrystalCleansing', 'CrystalCleansing-Crystal', { transaction: t });
      await queryInterface.removeConstraint('CrystalCleansing', 'CrystalCleansing-Cleansing', { transaction: t });
      await queryInterface.removeIndex('CrystalCleansing', 'Crystal_Cleansing', { transaction: t });
      await queryInterface.addConstraint('CrystalCleansing', {
        name: "CrystalCleansing-Crystal",
        type: 'foreign key',
        fields: ['crystalId'],
        references: {
          table: 'Crystal',
          field: 'id'
        }
      }, { transaction: t });
      await queryInterface.removeConstraint('CrystalDomain', 'CrystalDomain-Crystal', { transaction: t });
      await queryInterface.removeIndex('CrystalDomain', 'Crystal_Domain', { transaction: t });
      await queryInterface.addConstraint('CrystalDomain', {
        name: "CrystalDomain-Crystal",
        type: 'foreign key',
        fields: ['crystalId'],
        references: {
          table: 'Crystal',
          field: 'id'
        }
      }, { transaction: t });
      await queryInterface.removeConstraint('CrystalElement', 'CrystalElement-Crystal', { transaction: t });
      await queryInterface.removeIndex('CrystalElement', 'Crystal_Element', { transaction: t });
      await queryInterface.addConstraint('CrystalElement', {
        name: "CrystalElement-Crystal",
        type: 'foreign key',
        fields: ['crystalId'],
        references: {
          table: 'Crystal',
          field: 'id'
        }
      }, { transaction: t });
      await queryInterface.removeConstraint('CrystalMoonPhase', 'CrystalMoonPhase-Crystal', { transaction: t });
      await queryInterface.removeIndex('CrystalMoonPhase', 'crystal_moonPhase', { transaction: t });
      await queryInterface.addConstraint('CrystalMoonPhase', {
        name: "CrystalMoonPhase-Crystal",
        type: 'foreign key',
        fields: ['crystalId'],
        references: {
          table: 'Crystal',
          field: 'id'
        }
      }, { transaction: t });
      await queryInterface.removeConstraint('CrystalZodiac', 'CrystalZodiac-Crystal', { transaction: t });
      await queryInterface.removeIndex('CrystalZodiac', 'crystalId_zodiacId', { transaction: t });
      await queryInterface.addConstraint('CrystalZodiac', {
        name: "CrystalZodiac-Crystal",
        type: 'foreign key',
        fields: ['crystalId'],
        references: {
          table: 'Crystal',
          field: 'id'
        }
      }, { transaction: t });
      await queryInterface.addIndex('CrystalChakra', ['crystalId', 'chakraId', 'subType'], {
        unique: true
      }, { transaction: t })
      await queryInterface.addIndex('CrystalCleansing', ['crystalId', 'cleansingId', 'subType'], {
        unique: true
      }, { transaction: t })
      await queryInterface.addIndex('CrystalDomain', ['crystalId', 'domainId', 'subType'], {
        unique: true
      }, { transaction: t })
      await queryInterface.addIndex('CrystalElement', ['crystalId', 'elementId', 'subType'], {
        unique: true
      }, { transaction: t })
      await queryInterface.addIndex('CrystalMoonPhase', ['crystalId', 'moonPhaseId', 'subType'], {
        unique: true
      }, { transaction: t })
      await queryInterface.addIndex('CrystalZodiac', ['crystalId', 'zodiacId', 'subType'], {
        unique: true
      }, { transaction: t })
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
