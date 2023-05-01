const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CrystalDomain', {
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
    domainId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Domain',
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
    tableName: 'CrystalDomain',
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
        name: "Crystal_Domain",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "crystalId" },
          { name: "domainId" },
        ]
      },
      {
        name: "CrystalDomain-Domain_idx",
        using: "BTREE",
        fields: [
          { name: "domainId" },
        ]
      },
    ]
  });
};
