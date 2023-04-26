'use strict';

const { query } = require('express');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.removeConstraint('UserDeck', 'UserDeck-Deck')
      .then(async () => {
        await queryInterface.removeConstraint('UserDeck', 'UserDeck-User');
      }).then(async () => {
        await queryInterface.removeConstraint('Cards', 'Cards-Deck');
      }).then(async () => {
        await queryInterface.renameTable('Cards', 'Card');
      }).then(async () => {
        await queryInterface.renameColumn('UserDeck', 'deckId', 'deck');
      }).then(async () => {
        await queryInterface.renameColumn('UserDeck', 'userId', 'owner');
      }).then(async () => {
        await queryInterface.renameColumn('Card', 'deckId', 'deck');
      }).then(async () => {
        await queryInterface.removeIndex('Card', 'Cards-Deck_idx');
      }).then(async () => {
        await queryInterface.removeIndex('UserDeck', 'UserDeck-Deck_idx');
      }).then(async () => {
        await queryInterface.removeIndex('UserDeck', 'UserDeck-User_idx');
      }).then(async () => {
        await queryInterface.addConstraint('UserDeck', {
            name: "UserDeck-User",
            type: 'foreign key',
            fields: ['owner'],
            references: {
              table: 'User',
              field: 'id'
            }
        });
      }).then(async () => {
        await queryInterface.addConstraint('UserDeck', {
            name: "UserDeck-Deck",
            type: 'foreign key',
            fields: ['deck'],
            references: {
              table: 'Deck',
              field: 'id'
            }
        });
      }).then(async () => {
        await queryInterface.addConstraint('Card', {
            name: "Card-Deck",
            type: 'foreign key',
            fields: ['deck'],
            references: {
              table: 'Deck',
              field: 'id'
            }
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
  }
};
