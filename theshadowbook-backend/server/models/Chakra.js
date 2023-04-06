const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Chakra', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    chakra: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: "chakra_UNIQUE"
    }
  }, {
    sequelize,
    tableName: 'Chakra',
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
        name: "chakra_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "chakra" },
        ]
      },
    ]
  });
};
