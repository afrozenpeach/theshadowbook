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
        await queryInterface.renameTable('CrystalShape', 'Shape', { transaction: t });
        await queryInterface.renameTable('CrystalColor', 'Color', { transaction: t });
        await queryInterface.addColumn('CrystalChakra', 'subType', {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true
        }, { transaction: t });
        await queryInterface.addColumn('CrystalCleansing', 'subType', {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true
        }, { transaction: t });
        await queryInterface.addColumn('CrystalDomain', 'subType', {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true
        }, { transaction: t });
        await queryInterface.addColumn('CrystalElement', 'subType', {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true
        }, { transaction: t });
        await queryInterface.addColumn('CrystalMoonPhase', 'subType', {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true
        }, { transaction: t });
        await queryInterface.addColumn('CrystalZodiac', 'subType', {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true
        }, { transaction: t });
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
        await queryInterface.addConstraint('CrystalChakra', {
          name: "CrystalChakra-SubType",
          type: 'foreign key',
          fields: ['subType'],
          references: {
            table: 'CrystalSubType',
            field: 'id'
          }
        }, { transaction: t });
        await queryInterface.addConstraint('CrystalCleansing', {
          name: "CrystalCleansing-SubType",
          type: 'foreign key',
          fields: ['subType'],
          references: {
            table: 'CrystalSubType',
            field: 'id'
          }
        }, { transaction: t });
        await queryInterface.addConstraint('CrystalDomain', {
          name: "CrystalDomain-SubType",
          type: 'foreign key',
          fields: ['subType'],
          references: {
            table: 'CrystalSubType',
            field: 'id'
          }
        }, { transaction: t });
        await queryInterface.addConstraint('CrystalElement', {
          name: "CrystalElement-SubType",
          type: 'foreign key',
          fields: ['subType'],
          references: {
            table: 'CrystalSubType',
            field: 'id'
          }
        }, { transaction: t });
        await queryInterface.addConstraint('CrystalMoonPhase', {
          name: "CrystalMoonPhase-SubType",
          type: 'foreign key',
          fields: ['subType'],
          references: {
            table: 'CrystalSubType',
            field: 'id'
          }
        }, { transaction: t });
        await queryInterface.addConstraint('CrystalZodiac', {
          name: "CrystalZodiac-SubType",
          type: 'foreign key',
          fields: ['subType'],
          references: {
            table: 'CrystalSubType',
            field: 'id'
          }
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
      await queryInterface.renameTable('Shape', 'CrystalShape');
      await queryInterface.renameTable('Color', 'CrystalColor');

      await queryInterface.removeIndex('CrystalChakra', 'crystalSubType-idx');
      await queryInterface.removeIndex('CrystalCleansing', 'crystalSubType-idx');
      await queryInterface.removeIndex('CrystalDomain', 'crystalSubType-idx');
      await queryInterface.removeIndex('CrystalElement', 'crystalSubType-idx');
      await queryInterface.removeIndex('CrystalMoonPhase', 'crystalSubType-idx');
      await queryInterface.removeIndex('CrystalZodiac', 'crystalSubType-idx');

      await queryInterface.removeConstraint('CrystalChakra', 'CrystalChakra-SubType');
      await queryInterface.removeConstraint('CrystalCleansing', 'CrystalCleansing-SubType');
      await queryInterface.removeConstraint('CrystalDomain', 'CrystalDomain-SubType');
      await queryInterface.removeConstraint('CrystalElement', 'CrystalElement-SubType');
      await queryInterface.removeConstraint('CrystalMoonPhase', 'CrystalMoonPhase-SubType');
      await queryInterface.removeConstraint('CrystalZodiac', 'CrystalZodiac-SubType');

      await queryInterface.removeColumn('CrystalChakra', 'subType');
      await queryInterface.removeColumn('CrystalCleansing', 'subType');
      await queryInterface.removeColumn('CrystalDomain', 'subType');
      await queryInterface.removeColumn('CrystalElement', 'subType');
      await queryInterface.removeColumn('CrystalMoonPhase', 'subType');
      await queryInterface.removeColumn('CrystalZodiac', 'subType');
    });
  }
};
