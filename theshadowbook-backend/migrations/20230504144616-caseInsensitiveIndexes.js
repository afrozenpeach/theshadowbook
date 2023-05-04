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
    await queryInterface.removeIndex('Crystal', 'crystal_UNIQUE');
    await queryInterface.sequelize.query('create unique index crystal_UNIQUE on Crystal((lower(crystal)));');
    await queryInterface.sequelize.query('create unique index name_UNIQUE on Deck((lower(name)));');
    await queryInterface.removeIndex('User', 'name_UNIQUE');
    await queryInterface.sequelize.query('create unique index name_UNIQUE on User((lower(name)));');
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
