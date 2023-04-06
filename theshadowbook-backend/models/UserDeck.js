const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('UserDeck', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    deckId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Deck',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Status',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'UserDeck',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "id_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "UserDeck-Deck_idx",
        using: "BTREE",
        fields: [
          { name: "deckId" },
        ]
      },
      {
        name: "UserDeck-User_idx",
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
      {
        name: "UserDeck-Status_idx",
        using: "BTREE",
        fields: [
          { name: "status" },
        ]
      },
    ]
  });
};
