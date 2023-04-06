const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Zodiac', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    sign: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: "sign_UNIQUE"
    },
    startMonth: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startDay: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    endMonth: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    endDay: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Zodiac',
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
        name: "sign_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "sign" },
        ]
      },
    ]
  });
};
