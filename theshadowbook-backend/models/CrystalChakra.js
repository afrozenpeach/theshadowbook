const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CrystalChakra', {
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
    chakraId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Chakra',
        key: 'id'
      }
    },
  }, {
    sequelize,
    tableName: 'CrystalChakra',
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
        name: "crystal_chakra",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "crystalId" },
          { name: "chakraId" },
        ]
      },
      {
        name: "CrystalChakra-Chakra_idx",
        using: "BTREE",
        fields: [
          { name: "chakraId" },
        ]
      },
    ]
  });
};
