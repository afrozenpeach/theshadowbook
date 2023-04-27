const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CrystalCleansing', {
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
    cleansingId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Cleansing',
        key: 'id'
      }
    },
    subType: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'CrystalSubType',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'CrystalCleansing',
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
        name: "Crystal_Cleansing",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "cleansingId" },
          { name: "crystalId" },
        ]
      },
      {
        name: "CrystalCleansing-Crystal_idx",
        using: "BTREE",
        fields: [
          { name: "crystalId" },
        ]
      },
      {
        name: "CrystalSubType-idx",
        using: "BTREE",
        fields: [
          { name: 'crystalId' },
          { name: 'subType' }
        ]
      }
    ]
  });
};
