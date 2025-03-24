const sequelize = require('./connect');
const { DataTypes } = require('sequelize');
const User = require('./User');
const File = require('./Files');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  role: {
    type: DataTypes.ENUM("r", "w", "d", "all", "rw", "rd", "wd"),
    allowNull: false
  },
  UserId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  FileId: {
    type: DataTypes.INTEGER,
    references: {
      model: File,
      key: 'id'
    }
  }
}, {
  indexes: [
    // Create a unique composite index for UserId and FileId
    {
      unique: true,
      fields: ['UserId', 'FileId']
    }
  ]
});

File.belongsToMany(User, { through: Role });
User.belongsToMany(File, { through: Role });

module.exports = Role;