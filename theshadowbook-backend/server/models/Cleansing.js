const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Cleansing', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    cleansing: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: "cleansing_UNIQUE"
    }
  }, {
    sequelize,
    tableName: 'Cleansing',
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
        name: "cleansing_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "cleansing" },
        ]
      },
    ]
  });
};
