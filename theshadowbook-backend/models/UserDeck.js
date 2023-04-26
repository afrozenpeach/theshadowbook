const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('UserDeck', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    owner: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    deck: {
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
          { name: "deck" },
        ]
      },
      {
        name: "UserDeck-User_idx",
        using: "BTREE",
        fields: [
          { name: "owner" },
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
