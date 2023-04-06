const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('UserCoven', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    covenId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Coven',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'UserCoven',
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
        name: "User_Coven",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "userId" },
          { name: "covenId" },
        ]
      },
      {
        name: "UserCoven-Coven_idx",
        using: "BTREE",
        fields: [
          { name: "covenId" },
        ]
      },
    ]
  });
};
