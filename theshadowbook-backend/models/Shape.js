const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Shape', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    shape: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: "shape_UNIQUE"
    }
  }, {
    sequelize,
    tableName: 'Shape',
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
        name: "shape_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "shape" },
        ]
      },
    ]
  });
};
