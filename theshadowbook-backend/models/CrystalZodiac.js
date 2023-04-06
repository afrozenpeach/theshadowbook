const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CrystalZodiac', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    crystalId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Crystal',
        key: 'id'
      }
    },
    zodiacId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Zodiac',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'CrystalZodiac',
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
        name: "crystalId_zodiacId",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "crystalId" },
          { name: "zodiacId" },
        ]
      },
      {
        name: "CrystalZodiac-Zodiac_idx",
        using: "BTREE",
        fields: [
          { name: "zodiacId" },
        ]
      },
    ]
  });
};
