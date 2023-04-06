const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CrystalMoonPhase', {
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
    moonPhaseId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'MoonPhase',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'CrystalMoonPhase',
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
        name: "crystal_moonPhase",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "crystalId" },
          { name: "moonPhaseId" },
        ]
      },
      {
        name: "CrystalMoonPhase-MoonPhase_idx",
        using: "BTREE",
        fields: [
          { name: "moonPhaseId" },
        ]
      },
    ]
  });
};
