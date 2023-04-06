const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CrystalElement', {
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
    elementId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Element',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'CrystalElement',
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
        name: "Crystal_Element",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "crystalId" },
          { name: "elementId" },
        ]
      },
      {
        name: "CrystalElement-Element_idx",
        using: "BTREE",
        fields: [
          { name: "elementId" },
        ]
      },
    ]
  });
};
