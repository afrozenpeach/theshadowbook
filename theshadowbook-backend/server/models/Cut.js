const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Cut', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    cut: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: "cut_UNIQUE"
    }
  }, {
    sequelize,
    tableName: 'Cut',
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
        name: "cut_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "cut" },
        ]
      },
    ]
  });
};
