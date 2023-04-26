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
      return queryInterface.createTable('Shape', {
          id: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            unique: true,
            primaryKey: true
          },
          shape: {
            type: Sequelize.DataTypes.STRING(45),
            allowNull: false,
            unique: true,
          }
        },
        { transaction: t }
      ).then(() => {
        queryInterface.addColumn('UserCrystal', 'shape', {
          type: Sequelize.DataTypes.INTEGER
        },
        { transaction: t });
      }).then(() => {
        queryInterface.addConstraint('UserCrystal', {
            name: "UserCrystal-Shape_idx",
            type: 'foreign key',
            fields: ['shape'],
            references: {
              table: 'Shape',
              field: 'id'
            }
        },
        { transaction: t });
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
    return queryInterface.removeConstraint('UserCrystal', 'UserCrystal-Shape_idx')
      .then(() => {
        queryInterface.removeColumn('UserCrystal', 'shape');
      })
      .then(() => {
        queryInterface.dropTable('Shape')
      })
  }
};
