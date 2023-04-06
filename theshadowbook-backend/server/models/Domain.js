const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Domain', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    domain: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: "domain_UNIQUE"
    }
  }, {
    sequelize,
    tableName: 'Domain',
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
        name: "domain_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "domain" },
        ]
      },
    ]
  });
};
