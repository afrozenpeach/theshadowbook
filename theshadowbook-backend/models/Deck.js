const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Deck', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'DeckType',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    author: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    artist: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    publisher: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Deck',
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
        name: "name_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [sequelize.fn('lower', sequelize.col('name'))]
      },
    ]
  });
};
