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
    await queryInterface.addColumn('UserDeck', 'notes', {
      type: Sequelize.DataTypes.TEXT
    });
    await queryInterface.addColumn('UserCrystal', 'notes', {
      type: Sequelize.DataTypes.TEXT
    });
    await queryInterface.createTable('CrystalSubType', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true
      },
      crystal: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
      },
      type: {
        type: Sequelize.DataTypes.STRING(45),
        allowNull: false
      }
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['crystal', 'type']
        }
      ]
    });
    await queryInterface.addConstraint('CrystalSubType', {
      name: "CrystalSubType-Crystal",
      type: 'foreign key',
      fields: ['crystal'],
      references: {
        table: 'Crystal',
        field: 'id'
      }
    });
    await queryInterface.addColumn('UserCrystal', 'subType', {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true
    });
    await queryInterface.addConstraint('UserCrystal', {
      name: "UserCrystalSubType-CrystalSubType",
      type: 'foreign key',
      fields: ['subType'],
      references: {
        table: 'CrystalSubType',
        field: 'id'
      }
    });
    await queryInterface.renameTable('Shape', 'CrystalShape');
    await queryInterface.renameTable('Color', 'CrystalColor');
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('UserDeck', 'notes');
    await queryInterface.removeColumn('UserCrystal', 'notes');
    await queryInterface.removeConstraint('UserCrystal', 'UserCrystalSubType-CrystalSubType');
    await queryInterface.removeColumn('UserCrystal', 'subType');
    await queryInterface.removeConstraint('CrystalSubType', 'CrystalSubType-Crystal');
    await queryInterface.dropTable('CrystalSubType');
    await queryInterface.renameTable('CrystalShape', 'Shape');
    await queryInterface.renameTable('CrystalColor', 'Color');
  }
};
