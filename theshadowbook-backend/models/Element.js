const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Element', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    element: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: "element_UNIQUE"
    }
  }, {
    sequelize,
    tableName: 'Element',
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
        name: "element_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "element" },
        ]
      },
    ]
  });
};
