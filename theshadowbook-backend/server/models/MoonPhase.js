const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MoonPhase', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    moonPhase: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: "moonPhase_UNIQUE"
    }
  }, {
    sequelize,
    tableName: 'MoonPhase',
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
        name: "moonPhase_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "moonPhase" },
        ]
      },
    ]
  });
};
