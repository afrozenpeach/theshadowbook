const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('UserCrystal', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    owner: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    crystal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Crystal',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    primaryColor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Color',
        key: 'id'
      }
    },
    secondaryColor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Color',
        key: 'id'
      }
    },
    tertiaryColor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Color',
        key: 'id'
      }
    },
    sizeX: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sizeY: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sizeZ: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    karat: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cut: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Cut',
        key: 'id'
      }
    },
    aura: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Status',
        key: 'id'
      }
    },
    shape: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'CrystalShape',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'UserCrystal',
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
        name: "idCrystals_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "UserCrystal-Color_idx",
        using: "BTREE",
        fields: [
          { name: "secondaryColor" },
          { name: "tertiaryColor" },
          { name: "primaryColor" },
        ]
      },
      {
        name: "UserCrystal-Crystal_idx",
        using: "BTREE",
        fields: [
          { name: "crystal" },
        ]
      },
      {
        name: "UserCrystal-Cut_idx",
        using: "BTREE",
        fields: [
          { name: "cut" },
        ]
      },
      {
        name: "UserCrystal-PrimaryColor_idx",
        using: "BTREE",
        fields: [
          { name: "primaryColor" },
        ]
      },
      {
        name: "UserCrystal-TertiaryColor_idx",
        using: "BTREE",
        fields: [
          { name: "tertiaryColor" },
        ]
      },
      {
        name: "UserCrystal-User_idx",
        using: "BTREE",
        fields: [
          { name: "owner" },
        ]
      },
      {
        name: "UserCrystal-Status_idx",
        using: "BTREE",
        fields: [
          { name: "status" },
        ]
      },
      {
        name: "UserCrystal-Shape_idx",
        using: "BTREE",
        fields: [
          { name: "shape" },
        ]
      },
    ]
  });
};
