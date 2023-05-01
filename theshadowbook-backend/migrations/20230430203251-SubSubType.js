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
      await queryInterface.addColumn('Crystal', 'parentCrystal', {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true
      });
      await queryInterface.addColumn('Crystal', 'oldSubTypeId', {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true
      });
      await queryInterface.addConstraint('Crystal', {
        name: "Crystal-Parent",
        type: 'foreign key',
        fields: ['parentCrystal'],
        references: {
          table: 'Crystal',
          field: 'id'
        }
      }, { transaction: t });
      await queryInterface.sequelize.query("INSERT INTO theshadowbook.Crystal (crystal, parentCrystal, oldSubTypeId) SELECT cst.type + ' ' + c.crystal, cst.crystal, cst.id FROM theshadowbook.CrystalSubType cst JOIN theshadowbook.Crystal c ON cst.crystal = c.crystal");
      await queryInterface.sequelize.query("UPDATE theshadowbook.UserCrystal uc INNER JOIN theshadowbook.Crystal c ON uc.subType = c.oldSubTypeId SET uc.crystal = c.id");
      await queryInterface.sequelize.query("UPDATE theshadowbook.CrystalChakra cc INNER JOIN theshadowbook.Crystal c ON cc.subType = c.oldSubTypeId SET cc.crystalId = c.id");
      await queryInterface.sequelize.query("UPDATE theshadowbook.CrystalCleansing cc INNER JOIN theshadowbook.Crystal c ON cc.subType = c.oldSubTypeId SET cc.crystalId = c.id");
      await queryInterface.sequelize.query("UPDATE theshadowbook.CrystalDomain cc INNER JOIN theshadowbook.Crystal c ON cc.subType = c.oldSubTypeId SET cc.crystalId = c.id");
      await queryInterface.sequelize.query("UPDATE theshadowbook.CrystalElement cc INNER JOIN theshadowbook.Crystal c ON cc.subType = c.oldSubTypeId SET cc.crystalId = c.id");
      await queryInterface.sequelize.query("UPDATE theshadowbook.CrystalMoonPhase cc INNER JOIN theshadowbook.Crystal c ON cc.subType = c.oldSubTypeId SET cc.crystalId = c.id");
      await queryInterface.sequelize.query("UPDATE theshadowbook.CrystalZodiac cc INNER JOIN theshadowbook.Crystal c ON cc.subType = c.oldSubTypeId SET cc.crystalId = c.id");
      await queryInterface.sequelize.query("DELETE FROM theshadowbook.CrystalChakra WHERE subType IS NOT NULL");
      await queryInterface.sequelize.query("DELETE FROM theshadowbook.CrystalCleansing WHERE subType IS NOT NULL");
      await queryInterface.sequelize.query("DELETE FROM theshadowbook.CrystalDomain WHERE subType IS NOT NULL");
      await queryInterface.sequelize.query("DELETE FROM theshadowbook.CrystalElement WHERE subType IS NOT NULL");
      await queryInterface.sequelize.query("DELETE FROM theshadowbook.CrystalMoonPhase WHERE subType IS NOT NULL");
      await queryInterface.sequelize.query("DELETE FROM theshadowbook.CrystalZodiac WHERE subType IS NOT NULL");
      await queryInterface.removeColumn('CrystalChakra', 'subType');
      await queryInterface.removeColumn('CrystalCleansing', 'subType');
      await queryInterface.removeColumn('CrystalDomain', 'subType');
      await queryInterface.removeColumn('CrystalElement', 'subType');
      await queryInterface.removeColumn('CrystalMoonPhase', 'subType');
      await queryInterface.removeColumn('CrystalZodiac', 'subType');
      await queryInterface.removeConstraint('UserCrystal', 'UserCrystalSubType-CrystalSubType');
      await queryInterface.dropTable('CrystalSubType');
      await queryInterface.removeColumn('UserCrystal', 'subType');
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
