const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Crystal', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    crystal: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: "crystal_UNIQUE"
    }
  }, {
    sequelize,
    tableName: 'Crystal',
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
        name: "crystal_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "crystal" },
        ]
      },
    ]
  });
};
