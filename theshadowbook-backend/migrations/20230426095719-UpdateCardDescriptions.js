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
    return queryInterface.addColumn('Card', 'meaning', {
      type: Sequelize.DataTypes.TEXT
    }).then(async () => {
      await queryInterface.addColumn('Card', 'reversalMeaning', {
        type: Sequelize.DataTypes.TEXT
      })
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.removeColumn('Card', 'meaning')
    .then(async () => {
      await queryInterface.removeColumn('Card', 'reversalMeaning')
    })
  }
};
