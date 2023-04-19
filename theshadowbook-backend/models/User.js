const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('User', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: true,
      unique: "name_UNIQUE"
    },
    createDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(320),
      allowNull: true,
      unique: "email_UNIQUE"
    },
    profile: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    sunSign: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Zodiac',
        key: 'id'
      }
    },
    moonSign: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Zodiac',
        key: 'id'
      }
    },
    risingSign: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Zodiac',
        key: 'id'
      }
    },
    firebaseId: {
      type: DataTypes.STRING(45),
      allowNull: true,
      unique: "firebaseId_UNIQUE"
    },
    isAdmin: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'User',
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
        name: "email_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "name_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "name" },
        ]
      },
      {
        name: "firebaseId_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "firebaseId" },
        ]
      },
      {
        name: "User-SunSign_idx",
        using: "BTREE",
        fields: [
          { name: "sunSign" },
        ]
      },
      {
        name: "User-MoonSign_idx",
        using: "BTREE",
        fields: [
          { name: "moonSign" },
        ]
      },
      {
        name: "User-RisingSign_idx",
        using: "BTREE",
        fields: [
          { name: "risingSign" },
        ]
      },
    ]
  });
};
