'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('User', 'isAdmin', {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('User', isAdmin);
  }
};
