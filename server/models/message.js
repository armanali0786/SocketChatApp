const { DataTypes } = require('sequelize');
const sequelize = require('./index'); // Ensure this path is correct
const User = require('./user'); // Ensure this path is correct

const Message = sequelize.define('Message', {
  message: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  audioUrl: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  replyMessage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  }
}, {
  tableName: 'messages',
  timestamps: false,
});

// Associations
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

module.exports = Message;
