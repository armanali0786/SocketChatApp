const { DataTypes } = require('sequelize');
const sequelize = require('./index'); // Ensure this path is correct

const User = sequelize.define(
  'User',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: { // Corrected typo
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneno: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: 'users',
  }
);

module.exports = User;
